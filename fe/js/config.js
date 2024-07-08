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
        "getUserImage": {
          "url": "api/img/user",
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
        "getProfile": {
            "url": "api/profile",
            "method": "GET"
        },
        "editProfile": {
            "url": "api/profile",
            "method": "PUT"
        },
        "changePassword": {
            "url": "api/change-password",
            "method": "PUT"
        },
        "reactToPost": {
            "url": "api/post/react",
            "method": "POST"
        },
        "comment": {
            "url": "api/post/comment",
            "method": "POST"
        },
        "comments": {
            "url": "api/post/comments",
            "method": "GET"
        }
    }
}

window.sessionStorageKeys = {
    "currentUser": "currentUser",
    "userCreated": "userCreated"
}

window.backendErrors = {
    "MissingFieldException":"There are missing fields.",
    "VerifyFieldException":"Fields do not match.",
    "UsernameExistsException":"Username already in use.",
    "EmailAlreadyUsedException":"Email already in use.",
    "LoginFailedException":"Username, email or password incorrect.",
    "PermissionDeniedException":"Permission denied.",
    "InvalidFilterException":"Invalid filter.",
    "WrongPasswordException":"Wrong password.",
}




