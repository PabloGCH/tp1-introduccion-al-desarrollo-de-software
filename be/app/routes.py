from flask import current_app as app, request, jsonify, make_response
from flask_login import login_user, login_required, logout_user, current_user
import base64
import uuid
import os

from .exceptions import (
    LoginFailedException,
    InvalidReactionException,
    PermissionDeniedException,
    PostNotFoundException,
    UserNotFoundException,
    WrongPasswordException,
    VerifyFieldException,
    CommentNotFoundException,
    InvalidFilterException)
from .models import (User, Post, Reaction, Comment)
from .forms_validators import (
        validate_login_form,
        validate_register_form,
        validate_password_change_form,
        validate_profile_update_form,
        validate_comment_form,
        validate_update_comment_form,
        validate_post_form)
from . import db
from . import login_manager

# API
# ================
@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.json
        validate_login_form(data)

        user = User.query.filter((User.username == data['email-username']) | (User.email == data['email-username'])).first()

        if not user or user.check_password(data['password']) is False:
            raise LoginFailedException(['email-username', 'password'])

        login_user(user)
        return jsonify({'user': {'username': user.username, 'name': user.name, 'surname': user.surname, 'image': user.image}}), 200

    except Exception as e:
        return jsonify({'message': str(e), 'field': e.field}), e.code

@app.route('/api/logout', methods=['POST'])
def logout():
    if current_user.is_authenticated:
        logout_user()
        return jsonify({'message': 'User logged out'}), 200
    return jsonify({'message': 'User not logged in'}), 200

@login_manager.user_loader
def load_user(user):
    if user is not None:
        return User.query.get(user)

@app.route('/api/register', methods=['POST'])
def register():
    try:
        data = request.json
        validate_register_form(data)
        new_user = User(username=data['username'], name=data['name'], surname=data['surname'], email=data['email'])
        new_user.set_password(data['password'])
        db.session.add(new_user)
        db.session.commit()

        return jsonify({'message': 'User created successfully'}), 201

    except Exception as e:
        return jsonify({'message': str(e), 'field': e.field}), e.code


@app.route('/api/profile/<username>', methods=['GET'])
def getProfile(username):
    try:
        user = User.query.filter_by(username=username).first()
        if not user:
            raise Exception('User not found')
        return jsonify({'username': user.username, 'name': user.name, 'surname': user.surname, 'image': user.image}), 200
    except Exception as e:
        return jsonify({'message': str(e), 'field': e.field}), e.code


@app.route('/api/profile', methods=['PUT'])
@login_required
def updateProfile():
    try:
        body = request.json
        validate_profile_update_form(body)

        current_user.name = body['name']
        current_user.surname = body['surname']

        if 'image' in body:
            file = base64.b64decode(body['image'])
            filename = f"{uuid.uuid4()}.png"
            # Deletes previous image if it exists
            if current_user.image:
                try:
                    os.remove(f"uploads/{current_user.image}")
                except Exception:
                    pass
            # Creates uploads folder if it doesn't exist
            if not os.path.exists('uploads'):
                os.makedirs('uploads')
            with open(f"uploads/{filename}", 'wb') as f:
                f.write(file)
            current_user.image = filename

        db.session.commit()
        return jsonify({'message': 'Profile updated successfully'}), 200
    except Exception as e:
        return jsonify({'message': str(e), 'field': e.field}), e.code


@app.route('/api/change-password', methods=['PUT'])
@login_required
def changePassword():
    try:
        body = request.json
        user = current_user

        if not user:
            raise UserNotFoundException()

        validate_password_change_form(body)

        if not user.check_password(body['oldPassword']):
            raise WrongPasswordException()


        user.set_password(body['newPassword'])

        db.session.commit()
        return jsonify({'message': 'Password changed successfully'}), 200
    except Exception as e:
        return jsonify({'message': str(e), 'field': e.field}), e.code


@app.route('/api/posts', methods=['GET'])
@login_required
def getPost():
    try:
        posts = Post.query.filter_by(deletedAt=None).order_by(Post.created.desc()).all()
        return jsonify([convertPostToResponse(post) for post in posts]), 200
    except Exception as e:
        return jsonify({'message': str(e), 'field': e.field}), e.code


@app.route('/api/posts/<username>/<filter>', methods=['GET'])
@login_required
def getPostForUser(username, filter):
    try:
        if filter not in ['last-posts', 'like', 'dislike']:
            raise InvalidFilterException()

        if filter == 'last-posts':
            posts = Post.query.join(User).filter(
                Post.deletedAt.is_(None),
                User.username == username
            ).order_by(Post.created.desc()).all()
        else:
            posts = Post.query.join(Reaction).join(User).filter(
                Post.deletedAt.is_(None),
                User.username == username,
                Reaction.type == filter
            ).order_by(Post.created.desc()).all()
        return jsonify([convertPostToResponse(post) for post in posts]), 200
    except Exception as e:
        return jsonify({'message': str(e), 'field': e.field}), e.code


@app.route('/api/post/<postId>', methods=['GET'])
@login_required
def getPostById(postId):
    try:
        post = Post.query.filter_by(id=postId).first()
        if not post:
            raise PostNotFoundException()
        return jsonify(convertPostToResponse(post)), 200
    except Exception as e:
        return jsonify({'message': str(e), 'field': e.field}), e.code


@app.route('/api/post', methods=['POST'])
@login_required
def createPost():
    try:
        data = request.json
        validate_post_form(data)
        new_post = Post(
                title=data['title'],
                content=data['content'],
                owner=current_user.id,
                )
        if 'image' in data:
            file = base64.b64decode(data['image'])
            filename = f"{uuid.uuid4()}.png"
            # Creates uploads folder if it doesn't exist
            if not os.path.exists('uploads'):
                os.makedirs('uploads')
            with open(f"uploads/{filename}", 'wb') as f:
                f.write(file)
            new_post.image = filename
        db.session.add(new_post)
        db.session.commit()
        return ({'message': 'Post created successfully', 'id': new_post.id}), 201
    except Exception as e:
        return jsonify({'message': str(e), 'field': e.field}), e.code


@app.route('/api/post', methods=['DELETE'])
@login_required
def deletePost():
    try:
        data = request.json
        post = Post.query.filter_by(id=data['id']).first()
        if not post:
            raise PostNotFoundException()
        if post.owner != current_user.id:
            raise PermissionDeniedException()

        # Deletes image if it exists
        if post.image:
            try:
                os.remove(f"uploads/{post.image}")
            except Exception:
                pass

        post.delete()
        db.session.commit()
        return jsonify({'message': 'Post deleted successfully'}), 200
    except Exception as e:
        return jsonify({'message': str(e), 'field': e.field}), e.code


@app.route('/api/post', methods=['PUT'])
@login_required
def updatePost():
    try:
        data = request.json
        validate_post_form(data)
        post = Post.query.filter_by(id=data['id']).first()
        if not post:
            raise PostNotFoundException()
        if post.owner != current_user.id:
            raise PermissionDeniedException()
        post.title = data['title']
        post.content = data['content']
        if 'image' in data:
            file = base64.b64decode(data['image'])
            filename = f"{uuid.uuid4()}.png"
            # Creates uploads folder if it doesn't exist
            if not os.path.exists('uploads'):
                os.makedirs('uploads')
            # Deletes previous image if it exists
            if post.image:
                try:
                    os.remove(f"uploads/{post.image}")
                except Exception:
                    pass
            with open(f"uploads/{filename}", 'wb') as f:
                f.write(file)
            post.image = filename
        db.session.commit()
        return jsonify({'message': 'Post updated successfully', 'id': post.id}), 200
    except Exception as e:
        return jsonify({'message': str(e), 'field': e.field}), e.code


@app.route('/api/post/react/<reactType>/<postId>', methods=['POST'])
@login_required
def reactPost(reactType, postId):
    try:
        if reactType not in ['like', 'dislike']:
            raise InvalidReactionException()

        post = Post.query.filter_by(id=postId).first()
        if not post:
            raise PostNotFoundException()

        reaction = Reaction.query.filter_by(post=postId, user=current_user.id).first()
        if not reaction:
            reaction = Reaction(post=postId, user=current_user.id)

        if reaction.type != reactType:
            reaction.setType(reactType)
            db.session.add(reaction)
        else:
            db.session.delete(reaction)

        db.session.commit()

        return jsonify({'message': 'Reaction added/updated successfully'}), 200
    except Exception as e:
        return jsonify({'message': str(e), 'field': e.field}), e.code

@app.route('/api/post/comment', methods=['POST'])
@login_required
def createComment():
    try:
        data = request.json
        validate_comment_form(data)
        post = Post.query.filter_by(id=data['postId']).first()

        if not post:
            raise PostNotFoundException()

        comment = Comment(
            content=data['content'],
            post=data['postId'],
            owner=current_user.id
        )

        db.session.add(comment)
        db.session.commit()

        return jsonify({'message': 'Comment created successfully'}), 201
    except Exception as e:
        return jsonify({'message': str(e), 'field': e.field}), e.code
    return ''


@app.route('/api/post/comment', methods=['DELETE'])
@login_required
def deleteComment():
    try:
        data = request.json
        comment = Comment.query.filter_by(id=data['id']).first()
        if not comment:
            raise CommentNotFoundException()
        if comment.owner != current_user.id:
            raise PermissionDeniedException()
        comment.delete()
        db.session.commit()
        return jsonify({'message': 'Comment deleted successfully'}), 200
    except Exception as e:
        return jsonify({'message': str(e), 'field': e.field}), e.code


@app.route('/api/post/comment', methods=['PUT'])
@login_required
def updateComment():
    try:
        data = request.json
        validate_update_comment_form(data)
        comment = Comment.query.filter_by(id=data['id']).first()
        if not comment:
            raise Exception('Comment not found')
        if comment.owner != current_user.id:
            raise PermissionDeniedException()
        comment.content = data['content']
        db.session.commit()
        return jsonify({'message': 'Comment updated successfully'}), 200
    except Exception as e:
        return jsonify({'message': str(e), 'field': e.field}), e.code

@app.route('/api/post/comments/<postId>', methods=['GET'])
@login_required
def getComments(postId):
    try:
        comments = Comment.query.filter_by(post=postId, deletedAt=None).order_by(Comment.created.asc()).all()
        return jsonify([{
            'id': comment.id,
            'content': comment.content,
            'created': comment.created,
            'owner': comment.owner,
            'ownerName': User.query.filter_by(id=comment.owner).first().username,
            'currentUserIsOwner': comment.owner == current_user.id
        } for comment in comments]), 200
    except Exception as e:
        return jsonify({'message': str(e), 'field': e.field}), e.code


# Retorna la imagen como archivo binario para poder ser utilizada en un tag img
@app.route('/api/img/user/<username>', methods=['GET'])
def getUserImage(username):
    try:
        user = User.query.filter_by(username=username).first()
        if not user:
            raise UserNotFoundException()
        if not user.image:
            return jsonify({'error': 'User has no image'}), 404
        with open(f"uploads/{user.image}", 'rb') as f:
            image = f.read()
        response = make_response(image)
        response.headers.set('Content-Type', 'image/png')
        return response, 200
    except Exception as e:
        return jsonify({'message': str(e), 'field': e.field}), e.code


# Retorna la imagen como archivo binario para poder ser utilizada en un tag img
@app.route('/api/img/post/<postId>', methods=['GET'])
def getPostImage(postId):
    try:
        post = Post.query.filter_by(id=postId).first()
        if not post:
            raise PostNotFoundException()
        if not post.image:
            return jsonify({'error': 'Post has no image'}), 404
        with open(f"uploads/{post.image}", 'rb') as f:
            image = f.read()
        response = make_response(image)
        response.headers.set('Content-Type', 'image/png')
        return response, 200
    except Exception as e:
        return jsonify({'message': str(e), 'field': e.field}), e.code


def convertPostToResponse(post):
    result = {
        'id': post.id,
        'title': '' if post.deletedAt else post.title,
        'content': 'Deleted post' if post.deletedAt else post.content,
        'created': post.created,
        'deleted': True if post.deletedAt else False,
        'image': True if post.image and not post.deletedAt else False,
        'owner': post.owner,
        'ownerName': User.query.filter_by(id=post.owner).first().username,
        'likes': post.getLikes(),
        'dislikes': post.getDislikes(),
        'comments': Comment.query.filter_by(post=post.id, deletedAt=None).count(),
        'currentUserLikes': Reaction.query.filter_by(post=post.id, user=current_user.id, type='like').count(),
        'currentUserDislikes': Reaction.query.filter_by(post=post.id, user=current_user.id, type='dislike').count(),
        'currentUserIsOwner': post.owner == current_user.id
    }

    return result
