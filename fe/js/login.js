const loginForm = document.getElementById('login-form');

const login = (e) => {
    e.preventDefault();

    let data = {
        "email-username": e.target['email-username'].value,
        "password": e.target['password'].value
    }

    let requestConfig = {
        "method": config.endpoints.login.method,
        "body": JSON.stringify(data),
        "headers": { "Content-Type": "application/json" },
        "credentials": 'include'
    }

    fetch(config.backend + config.endpoints.login.url, requestConfig)
        .then(responseHandler)
        .catch(unknownErrorHandler)
};

loginForm.addEventListener('submit', login);

const responseHandler = (response) => {
    if (response.ok) {
        response.json().then(loginHandler);
    } else {
        response.json().then(loginErrorHandler);
    }
}

const loginHandler = (data) => {
    const currentUser = JSON.stringify(data.user);
    sessionStorage.setItem(window.sessionStorageKeys["currentUser"], currentUser);
    window.location.href = '/';
}

const loginErrorHandler = (error) => {
    if(error.message){
        errorToast(window.backendErrors[error.message]);
    }
    if(error.field){
        error.field.forEach(field => {
            let input = document.getElementById(field);
            input.classList.add('is-invalid');
            let inputValidate = document.getElementById(field+"-verify");
            if(inputValidate){
                inputValidate.classList.add('is-invalid');
            }
        });
    }
}

const unknownErrorHandler = (error) => {
    errorToast('Error desconocido');
}