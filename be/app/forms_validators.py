from .models import User
from .exceptions import MissingFieldException, UsernameExistsException, EmailAlreadyUsedException, VerifyFieldException, LoginFailedException

required = {
     "login": [
        {'field': 'username', 'label': 'Nombre de usuario'},
        {'field': 'password', 'label': 'Contraseña'}
    ],
    "register": [
        {'field': 'username', 'label': 'Nombre de usuario'},
        {'field': 'name', 'label': 'Nombre'},
        {'field': 'surname', 'label': 'Apellido'},
        {'field': 'email', 'label': 'Correo electrónico'},
        {'field': 'emailVerify', 'label': 'Verificación de Correo electrónico'},
        {'field': 'password', 'label': 'Contraseña'},
        {'field': 'passwordVerify', 'label': 'Verificación de contraseña'}
    ]
}

def validate_login_form(data):
    missing_fields = get_missing_fields(data, 'login')

    if missing_fields:
        raise MissingFieldException(missing_fields)

    username = data['username']

    user = User.query.filter_by(username=username).first()

    if not user or user.check_password(data['password']) is False:
        raise LoginFailedException()

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
    print(data, form)
    for item in required[form]:
        if item['field'] not in data:
            missing_fields.append(item['label'])

    return missing_fields
