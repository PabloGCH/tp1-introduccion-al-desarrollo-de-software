from .models import User
from .exceptions import MissingFieldException, UsernameExistsException, EmailAlreadyUsedException, VerifyFieldException

required = {
    "login": [
        'email-username',
        'password'
    ],
    "register": [
        'username',
        'name',
        'surname',
        'email',
        'emailVerify',
        'password',
        'passwordVerify'
    ],
    "post": [
        'title',
        'content'
    ]
}

def validate_login_form(data):
    missing_fields = get_missing_fields(data, 'login')

    if missing_fields:
        raise MissingFieldException(missing_fields)

def validate_register_form(data):

    missing_fields = get_missing_fields(data, 'register')

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

def get_missing_fields(data, form):
    missing_fields = []
    for item in required[form]:
        if item not in data:
            missing_fields.append(item)

    return missing_fields


def validate_post_form(data):
    missing_fields = get_missing_fields(data, 'post')
    if missing_fields:
        raise MissingFieldException(missing_fields)




