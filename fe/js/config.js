window.config = {
    "backend": "http://localhost:5000/",
    "endpoints": {
        "newPost": {
            "url": "api/post",
            "method": "POST"
        },
        "editPost": {
            "url": "api/post",
            "method": "PUT"
        },
        "deletePost": {
            "url": "api/post",
            "method": "DELETE"
        },
        "getPost": {
            "url": "api/post",
            "method": "GET"
        },
        "getPosts": {
          "url": "api/posts",
          "method": "GET"
        },
        "getPostImage": {
          "url": "api/img/post",
          "method": "GET"
        },
        "login": {
            "url": "api/login",
            "method": "POST"
        },
        "register": {
            "url": "api/register",
            "method": "POST"
        },
        "logout": {
            "url": "api/logout",
            "method": "POST"
        },
        "reactToPost": {
            "url": "api/post/react",
            "method": "POST"
        },
    }
}

window.sessionStorageKeys = {
    "currentUser": "currentUser",
    "userCreated": "userCreated"
}

window.backendErrors = {
    "MissingFieldException":"Falta completar campos obligatorios.",
    "VerifyFieldException":"Los campos no coinciden.",
    "UsernameExistsException":"Usuario actualmente en uso.",
    "EmailAlreadyUsedException":"Email actualmente en uso.",
    "LoginFailedException":"Usuario o contraseña incorrectos.",
    "PermissionDeniedException":"No tienes permisos para realizar esta acción.",
}
