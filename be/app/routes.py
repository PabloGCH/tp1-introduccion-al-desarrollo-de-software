from flask import current_app as app, request, jsonify
from flask_login import login_user, login_required, logout_user, current_user
from .exceptions import LoginFailedException
from .models import User
from .forms_validators import validate_login_form, validate_register_form
from . import db
from . import login_manager

# API
# ================

@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.form.copy()
        validate_login_form(data)
        username = data['username']

        user = User.query.filter_by(username=username).first()

        if not user or user.check_password(data['password']) is False:
            raise LoginFailedException()

        login_user(user)
        return jsonify({'user': {'username': user.username, 'name': user.name, 'surname': user.surname, 'avatar': user.avatar}}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 400

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
        data = request.form.copy()
        validate_register_form(data)

        new_user = User(username=data['username'], name=data['name'], surname=data['surname'], email=data['email'])
        new_user.set_password(data['password'])
        db.session.add(new_user)
        db.session.commit()

        return jsonify({'message': 'User created successfully'}), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 400


@app.route('/api/profile/<userId>', methods=['GET'])
def getProfile():
    return ''


@app.route('/api/posts', methods=['GET'])
def getPost():
    return ''


@app.route('/api/post', methods=['POST'])
def createPost():
    return ''


@app.route('/api/post', methods=['DELETE'])
def deletePost():
    return ''


@app.route('/api/post', methods=['PUT'])
def updatePost():
    return ''


@app.route('/api/post/comment', methods=['POST'])
def createComment():
    return ''