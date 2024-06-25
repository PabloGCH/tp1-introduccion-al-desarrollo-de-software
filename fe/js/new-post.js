let cancelButton = document.getElementById('cancel-button');

cancelButton.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = '/';
});

let form = document.getElementById('new-post-form');

form.addEventListener('submit', (e) => {
    e.preventDefault();

    let data = {
        'title': e.target['title'].value,
        'content': e.target['content'].value,
        'image': e.target['image64'].value
    };

    let requestConfig = {
        "method": config.endpoints.newPost.method,
        "body": JSON.stringify(data),
        "headers": { "Content-Type": "application/json" },
        "credentials": 'include'
    }

    fetch(config.backend + config.endpoints.newPost.url, requestConfig)
        .then(responseHandler)
        .catch(UnknownErrorHandler);
});

let imageInput = document.getElementById('image');

imageInput.addEventListener('change', (e) => {
    let reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);

    reader.onload = (e) => {
        let result = e.target.result;
        let image64 = result.split(',')[1]
        document.getElementById('image64').value = image64;
    }
});

let responseHandler = (response) => {
    if (response.ok) {
        response.json().then(createHandler);
    } else {
        response.json().then(ErrorHandler);
    }
}

let createHandler = (data) => {
    window.location.href = '/';
}
