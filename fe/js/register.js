const registerForm = document.getElementById('register-form');

const register = (e) => {
    e.preventDefault();

    let data = {
        email: e.target['email'].value,
        emailVerify: e.target['email-verify'].value,
        password: e.target['password'].value,
        passwordVerify: e.target['password-verify'].value,
        name: e.target['name'].value,
        surname: e.target['surname'].value,
        username: e.target['username'].value,
    };

    let requestConfig = {
        method: config.endpoints.register.method,
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
    };

    fetch(config.backend + config.endpoints.register.url, requestConfig)
        .then(responseHandler)
        .catch(unknownErrorHandler);
};

registerForm.addEventListener('submit', register);

const responseHandler = (response) => {
    if (response.ok) {
        response.json().then(registerHandler);
    } else {
        response.json().then(registerErrorHandler);
    }
}

const registerHandler = (data) => {
    sessionStorage.setItem(window.sessionStorageKeys['userCreated'], 1);
    window.location.href = '/pages/login';
};

const registerErrorHandler = (error) => {
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
};

const unknownErrorHandler = (error) => {
    errorToast('Error desconocido');
}
