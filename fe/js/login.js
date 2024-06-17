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
        .then(response => response.json())
        .then(loginHandler)
        .catch(loginErrorHandler)
};

loginForm.addEventListener('submit', login);

const loginHandler = (data) => {
    const currentUser = JSON.stringify(data.user);
    sessionStorage.setItem(window.sessionStorageKeys["currentUser"], currentUser);
    window.location.href = '/';
}

const loginErrorHandler = (error) => {
    errorToast('Invalid username or password');
}