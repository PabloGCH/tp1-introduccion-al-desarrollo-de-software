window.config = {
    "backend": "http://localhost:5000/",
    "endpoints": {
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
    }
}

window.sessionStorageKeys = {
    "currentUser": "currentUser"
}