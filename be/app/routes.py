from flask import current_app as app, request, jsonify
from flask_login import login_user, login_required, logout_user, current_user
from .exceptions import MissingFieldException, UsernameExistsException, EmailAlreadyUsedException, VerifyFieldException, LoginFailedException
from .models import User
from . import db
from . import login_manager

# API
# ================

@app.route('/api/login', methods=['POST'])
def login():
    required = [
        {'field': 'username', 'label': 'Nombre de usuario'},
        {'field': 'password', 'label': 'Contraseña'}
    ]

    missing_fields = []
    try:

        data = request.form.copy()
        for item in required:
            if item['field'] not in data:
                missing_fields.append(item['label'])

        if missing_fields:
            raise MissingFieldException(missing_fields)

        username = data['username']

        user = User.query.filter_by(username=username).first()

        if not user or user.check_password(data['password']) is False:
            raise LoginFailedException('Usuario no encontrado')

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
    required = [
        {'field': 'username', 'label': 'Nombre de usuario'},
        {'field': 'name', 'label': 'Nombre'},
        {'field': 'surname', 'label': 'Apellido'},
        {'field': 'email', 'label': 'Correo electrónico'},
        {'field': 'emailVerify', 'label': 'Verificación de Correo electrónico'},
        {'field': 'password', 'label': 'Contraseña'},
        {'field': 'passwordVerify', 'label': 'Verificación de contraseña'}
    ]

    missing_fields = []
    try:
        data = request.form.copy()
        for item in required:
            if item['field'] not in data:
                missing_fields.append(item['label'])

        if missing_fields:
            raise MissingFieldException(missing_fields)

        username = data['username']
        user_exists = User.query.filter_by(username=username).first()

        if user_exists:
            raise UsernameExistsException(username)

        email = data['email']
        user_exists = User.query.filter_by(email=email).first()

        if user_exists:
            raise EmailAlreadyUsedException(email)

        if data['email'] != data['emailVerify']:
            raise VerifyFieldException('Correo electrónico')

        if data['password'] != data['passwordVerify']:
            raise VerifyFieldException('Contraseña')

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