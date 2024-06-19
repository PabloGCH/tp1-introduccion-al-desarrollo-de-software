class MissingFieldException(Exception):
    def __init__(self, missing_fields):
        self.message = 'MissingFieldException'
        self.field = missing_fields
        super().__init__(self.message)

class VerifyFieldException(Exception):
    def __init__(self, field):
        self.field = field
        self.message = 'VerifyFieldException'
        self.field = [field]
        super().__init__(self.message)

class UsernameExistsException(Exception):
    def __init__(self, field):
        self.message = 'UsernameExistsException'
        self.field = [field]
        super().__init__(self.message)

class EmailAlreadyUsedException(Exception):
    def __init__(self, field):
        self.message = 'EmailAlreadyUsedException'
        self.field = [field]
        super().__init__(self.message)

class LoginFailedException(Exception):
    def __init__(self):
        self.message = 'Usuario o contraseña incorrectos'
        super().__init__(self.message)