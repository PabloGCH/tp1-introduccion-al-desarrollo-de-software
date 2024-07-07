let urlParams = new URLSearchParams(window.location.search);
let postId = urlParams.get('postId');

let cancelButton = document.getElementById('cancel-button');

cancelButton.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = '/';
});

let form = document.getElementById('edit-post-form');

form.addEventListener('submit', (e) => {
    e.preventDefault();

    let data = {
        'id': postId,
        'title': e.target['title'].value,
        'content': e.target['content'].value
    };

    if (e.target['image64'].value){
        data['image'] = e.target['image64'].value
    }

    let requestConfig = {
        "method": config.endpoints.editPost.method,
        "body": JSON.stringify(data),
        "headers": { "Content-Type": "application/json" },
        "credentials": 'include'
    }

    fetch(config.backend + config.endpoints.editPost.url, requestConfig)
        .then(editResponseHandler)
        .catch(UnknownErrorHandler);
});


let loadBase64InPreview= (base64Img) => {
    let container = document.getElementById('image-preview');
    container.innerHTML = '';
    let img= document.createElement('img');
    img.src = 'data:image/png;base64,' + base64Img;
    img.classList.add('rounded', 'border', 'border-color', 'post-img', 'post-edit-img', 'w-100');
    img.addEventListener('error', imgLoadError);
    container.appendChild(img);
}

let imageInput = document.getElementById('image');

imageInput.addEventListener('change', (e) => {
    let reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);

    reader.onload = (e) => {
        let result = e.target.result;
        let image64 = result.split(',')[1]
        document.getElementById('image64').value = image64;
        loadBase64InPreview(image64);
    }
});


let editResponseHandler = (response) => {
    if (response.ok) {
        response.json().then(editHandler);
    } else {
        response.json().then(ErrorHandler);
    }
}

let editHandler = (data) => {
    window.location.href = '/';
}

let GetPostResponseHandler = (response) => {
    if (response.ok) {
        response.json().then(loadPostDataHandler);
    } else {
        response.json().then(ErrorHandler);
    }
}

let loadPostDataHandler = (data) => {
    document.getElementById('title').value = data.title;
    document.getElementById('content').value = data.content;
    if(data.image){
        let container = document.getElementById('image-preview');
        let img= document.createElement('img');
        img.src = config.backend + config.endpoints.getPostImage.url + '/' + data.id;
        img.classList.add('rounded', 'border', 'border-color', 'post-img', 'post-edit-img', 'w-100');
        img.addEventListener('error', imgLoadError);
        container.appendChild(img);
    }
}

let getPostData = () => {
    let requestConfig = {
        "method": config.endpoints.getPost.method,
        "credentials": 'include'
    }

    fetch(config.backend + config.endpoints.getPost.url + '/' + postId, requestConfig)
        .then(GetPostResponseHandler)
        .catch(UnknownErrorHandler);
}

getPostData();
