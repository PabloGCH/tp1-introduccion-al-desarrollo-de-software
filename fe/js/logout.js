const logoutButton = document.getElementById('logout-button');

const logout = (e) => {
    e.preventDefault();

    confirmWarning(
        '',
        'Are you sure you want to logout?',
    ).then((result) => {
      if (result.isConfirmed) {
        let requestConfig = {
            "method": config.endpoints.logout.method,
            "body": JSON.stringify({}),
            "headers": { "Content-Type": "application/json" },
            "credentials": 'include'
        }

        fetch(config.backend + config.endpoints.logout.url, requestConfig)
            .then(response => response.json())
            .finally(logoutHandler)
      }
    });

};

logoutButton.addEventListener('click', logout);

const logoutHandler = () => {
    sessionStorage.removeItem(window.sessionStorageKeys["currentUser"]);
    window.location.href = '/pages/login';
}
