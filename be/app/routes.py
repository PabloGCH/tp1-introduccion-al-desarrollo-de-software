from flask import current_app as app, request, jsonify
from .exceptions import MissingFieldException, VerifyFieldException, UsernameExistsException, EmailAlreadyUsedException
from .models import User
from . import db

@app.route('/')
def home():
    return 'Home'


@app.route('/login')
def loginView():
    return 'Login'


@app.route('/register')
def registerView():
    return 'Register'


@app.route('/profile')
def profileView():
    return 'Profile'


# API
# ================

@app.route('/api/login', methods=['POST'])
def login():
    return ''


@app.route('/api/register', methods=['POST'])
def register():
    required = [
        {"field": "username", "label": "Nombre de usuario"},
        {"field": "name", "label": "Nombre"},
        {"field": "surname", "label": "Apellido"},
        {"field": "email", "label": "Correo electrónico"},
        {"field": "emailVerify", "label": "Verificación de Correo electrónico"},
        {"field": "password", "label": "Contraseña"},
        {"field": "passwordVerify", "label": "Verificación de contraseña"}
    ]

    missing_fields = []
    try:
        data = request.form.copy()
        for item in required:
            if item["field"] not in data:
                missing_fields.append(item["label"])

        if missing_fields:
            raise MissingFieldException(missing_fields)

        username = data["username"]
        userExists = User.query.filter_by(username=username).first()

        if userExists:
            raise UsernameExistsException(username)

        email = data["email"]
        userExists = User.query.filter_by(email=email).first()

        if userExists:
            raise EmailAlreadyUsedException(email)

        if data["email"] != data["emailVerify"]:
            raise VerifyFieldException("Correo electrónico")

        if data["password"] != data["passwordVerify"]:
            raise VerifyFieldException("Contraseña")

        new_user = User(username=data["username"], name=data["name"], surname=data["surname"], email=data["email"])
        new_user.set_password(data["password"])
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