class CustomErrorException(Exception):
    def __init__(self, message):
        self.message = message
        self.field = []
        self.code = 400
        super().__init__(self.message)

class MissingFieldException(CustomErrorException):
    def __init__(self, missing_fields):
        self.message = 'MissingFieldException'
        self.field = missing_fields
        super().__init__(self.message)

class VerifyFieldException(CustomErrorException):
    def __init__(self, field):
        self.field = field
        self.message = 'VerifyFieldException'
        self.field = [field]
        super().__init__(self.message)

class UsernameExistsException(CustomErrorException):
    def __init__(self, field):
        self.message = 'UsernameExistsException'
        self.field = [field]
        super().__init__(self.message)

class EmailAlreadyUsedException(CustomErrorException):
    def __init__(self, field):
        self.message = 'EmailAlreadyUsedException'
        self.field = [field]
        super().__init__(self.message)

class LoginFailedException(CustomErrorException):
    def __init__(self, fields):
        self.message = 'LoginFailedException'
        self.field = fields
        super().__init__(self.message)

class InvalidReactionException(CustomErrorException):
    def __init__(self):
        self.message = 'InvalidReactionException'
        super().__init__(self.message)

class PermissionDeniedException(CustomErrorException):
    def __init__(self):
        self.message = 'PermissionDeniedException'
        super().__init__(self.message)

class PostNotFoundException(CustomErrorException):
    def __init__(self):
        self.message = 'PostNotFoundException'
        self.code = 404
        super().__init__(self.message)