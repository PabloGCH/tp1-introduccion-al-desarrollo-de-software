class MissingFieldException(Exception):
    def __init__(self, missing_fields):
        self.missing_fields = missing_fields
        self.message = f'Falta completar: {", ".join(missing_fields)}'
        super().__init__(self.message)

class VerifyFieldException(Exception):
    def __init__(self, field):
        self.field = field
        self.message = f'Los campos {field} y Verificación de {field} no coinciden'
        super().__init__(self.message)

class UsernameExistsException(Exception):
    def __init__(self, username):
        self.message = f'El nombre de usuario {username} ya existe'
        super().__init__(self.message)

class EmailAlreadyUsedException(Exception):
    def __init__(self, email):
        self.message = f'El correo electrónico {email} ya está en uso'
        super().__init__(self.message)