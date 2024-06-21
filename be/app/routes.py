from flask import current_app as app, request, jsonify
from flask_login import login_user, login_required, logout_user, current_user
import base64
import uuid
import os

from .exceptions import LoginFailedException
from .models import (User, Post)
from .forms_validators import (
        validate_login_form,
        validate_register_form,
        validate_post_form
        )
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
        return jsonify({'user': {'username': user.username, 'name': user.name, 'surname': user.surname, 'avatar': user.avatar}}), 200

    except Exception as e:
        return jsonify({'message': str(e), 'field': e.field}), 400

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
        return jsonify({'message': str(e), 'field': e.field}), 400


@app.route('/api/profile/<userId>', methods=['GET'])
def getProfile():
    return ''


@app.route('/api/posts', methods=['GET'])
@login_required
def getPost():
    try:
        posts = Post.query.filter_by(owner=current_user.id).order_by(Post.created.desc()).all()
        return jsonify([{
            'id': post.id,
            'title': post.title,
            'content': post.content,
            'created': post.created
            } for post in posts]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400


@app.route('/api/post/<postId>', methods=['GET'])
@login_required
def getPostById(postId):
    try:
        post = Post.query.filter_by(id=postId).first()
        if not post:
            return jsonify({'error': 'Post not found'}), 404
        return jsonify({
            'id': post.id,
            'title': post.title,
            'content': post.content,
            'created': post.created
            }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400


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
        return ({'message': 'Post created successfully'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400


@app.route('/api/post', methods=['DELETE'])
@login_required
def deletePost():
    try:
        data = request.json
        post = Post.query.filter_by(id=data['id']).first()
        if not post:
            return jsonify({'error': 'Post not found'}), 404
        db.session.delete(post)
        db.session.commit()
        return jsonify({'message': 'Post deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400


@app.route('/api/post', methods=['PUT'])
@login_required
def updatePost():
    try:
        data = request.json
        validate_post_form(data)
        post = Post.query.filter_by(id=data['id']).first()
        if not post:
            return jsonify({'error': 'Post not found'}), 404
        post.title = data['title']
        post.content = data['content']
        db.session.commit()
        return jsonify({'message': 'Post updated successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400


@app.route('/api/post/comment', methods=['POST'])
@login_required
def createComment():
    return ''


@app.route('/api/img/post/<postId>', methods=['GET'])
def getPostImage(postId):
    try:
        post = Post.query.filter_by(id=postId).first()
        if not post:
            return jsonify({'error': 'Post not found'}), 404
        if not post.image:
            return jsonify({'error': 'Post has no image'}), 404
        with open(f"uploads/{post.image}", 'rb') as f:
            image = base64.b64encode(f.read())
        return jsonify({'image': image.decode()}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400
