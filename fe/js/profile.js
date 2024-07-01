let createPostTypesButtons = () => {
    let buttonsArray = [
        {
            icon: 'fa fa-newspaper align-content-center me-2',
            text: 'Last Posts',
            id: 'last-posts',
            clases: 'd-flex flex-row align-items-center justify-content-center w-100 pt-2 pb-2 active',
        },
        {
            icon: 'fa fa-thumbs-up align-content-center me-2',
            text: 'Likes',
            id: 'like',
            clases: 'd-flex flex-row align-items-center justify-content-center w-100 pt-2 pb-2 border-start border-end border-color',
        },
        {
            icon: 'fa fa-thumbs-down align-content-center me-2',
            text: 'Dislikes',
            id: 'dislike',
            clases: 'd-flex flex-row align-items-center justify-content-center w-100 pt-2 pb-2',
        },
    ];

    let urlParams = new URLSearchParams(window.location.search);
    let username = urlParams.get('username');

    let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));


    let buttonsContainer = document.getElementById('post-types');

    buttonsArray.forEach((item) => {
        let button = document.createElement('li');
        button.className = item.clases;
        button.setAttribute('id', item.id);

        let icon = document.createElement('i');
        icon.className = item.icon;

        let prefix = ''

        if (currentUser.username == username){
            prefix = 'My '
        }

        let text = document.createElement('span');
        text.innerHTML = prefix + item.text;

        button.appendChild(icon);
        button.appendChild(text);

        buttonsContainer.appendChild(button);

        button.addEventListener('click', () => {
            let active = document.querySelector('#post-types .active');
            active.classList.remove('active');
            button.classList.add('active');
            updatePosts(item.id);
        });
    });
};

let createProfileInfo = (user) => {
    let profileContainer = document.getElementById('profile-info');

    let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));

    if (currentUser.username != user.username){
        let profileInfo = document.createElement('div');
        profileInfo.classList.add('d-flex', 'flex-row', 'align-items-center', 'justify-content-center');

        let nameAndUsernameContent = document.createElement('div');
        nameAndUsernameContent.classList.add('d-flex', 'flex-column', 'align-items-center', 'text-nowrap');

        let nameAndLastName = document.createElement('div');
        nameAndLastName.classList.add('d-flex', 'flex-row', 'align-items-center', 'w-100');
        nameAndLastName.innerText = user.name + ' ' + user.surname;

        let username = document.createElement('div');
        username.classList.add('d-flex', 'flex-row', 'align-items-center', 'w-100');
        username.innerText = user.username;
        username.setAttribute('id', 'profile-username');

        nameAndUsernameContent.appendChild(nameAndLastName);
        nameAndUsernameContent.appendChild(username);

        let image = document.createElement('img');
        image.classList.add('avatar', 'me-2', 'ms-2');

        let imageUrl = '../img/placeholder-profile-picture.png';
        if (user.image){
            imageUrl = config.backend + config.endpoints.getImage.url + '/' + user.image;
        }
        image.src = imageUrl;

        profileInfo.appendChild(nameAndUsernameContent);
        profileInfo.appendChild(image);
        profileContainer.appendChild(profileInfo);
        profileContainer.classList.remove('d-none');
    }
};

let updatePosts = (filter) => {
    let urlParams = new URLSearchParams(window.location.search);
    let username = urlParams.get('username');

    let postContent = document.getElementById('main-section-content');
    postContent.replaceChildren();
    getPostOfUsername(username, filter).then(responsePostsHandler)
    .catch(UnknownErrorHandler);
};

let getProfileInfo = () => {
    let urlParams = new URLSearchParams(window.location.search);
    let username = urlParams.get('username');

    let requestConfig = {
        method: config.endpoints.getProfile.method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
    };

    return fetch(config.backend + config.endpoints.getProfile.url + '/' + username, requestConfig)
}

let getProfileResponseHandler = (response) => {
    if (response.ok) {
        response.json().then(createProfileInfo);
    } else {
        response.json().then(ErrorHandler);
    }
}

createPostTypesButtons();
getProfileInfo().then(getProfileResponseHandler).catch(UnknownErrorHandler);
