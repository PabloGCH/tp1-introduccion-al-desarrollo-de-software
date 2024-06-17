const logoutButton = document.getElementById('logout-button');

const logout = (e) => {
    e.preventDefault();

    let requestConfig = {
        "method": config.endpoints.logout.method,
        "body": JSON.stringify({}),
        "headers": { "Content-Type": "application/json" },
        "credentials": 'include'
    }

    fetch(config.backend + config.endpoints.logout.url, requestConfig)
        .then(response => response.json())
        .finally(logoutHandler)
};

logoutButton.addEventListener('click', logout);

const logoutHandler = () => {
    sessionStorage.removeItem(window.sessionStorageKeys["currentUser"]);
    window.location.href = '/pages/login';
}