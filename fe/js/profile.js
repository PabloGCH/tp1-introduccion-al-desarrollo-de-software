let createPostTypesButtons = () => {
    let buttonsArray = [
        {
            icon: 'fa fa-newspaper align-content-center me-2',
            text: 'Last Posts',
            id: 'last-posts',
            clases: 'd-flex flex-row align-items-center justify-content-center w-100 pt-2 pb-2 active ps-2 pe-2',
        },
        {
            icon: 'fa fa-thumbs-up align-content-center me-2',
            text: 'Likes',
            id: 'like',
            clases: 'd-flex flex-row align-items-center justify-content-center w-100 pt-2 pb-2 border-start border-end border-color ps-2 pe-2',
        },
        {
            icon: 'fa fa-thumbs-down align-content-center me-2',
            text: 'Dislikes',
            id: 'dislike',
            clases: 'd-flex flex-row align-items-center justify-content-center w-100 pt-2 pb-2 ps-2 pe-2',
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

        let text = document.createElement('span');
        text.innerHTML = item.text;

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

        let profileInfo = document.createElement('div');
        profileInfo.classList.add('d-flex', 'flex-column', 'align-items-center', 'justify-content-center');

        let nameAndUsernameContent = document.createElement('div');
        nameAndUsernameContent.classList.add('d-flex', 'flex-column', 'align-items-center', 'text-nowrap','w-100');

        let nameAndLastName = document.createElement('div');
        nameAndLastName.classList.add('w-100', 'text-center');
        nameAndLastName.innerText = user.name + ' ' + user.surname;

        let username = document.createElement('div');
        username.classList.add('w-100', 'text-center');
        username.innerText = user.username;
        username.setAttribute('id', 'profile-username');

        nameAndUsernameContent.appendChild(nameAndLastName);
        nameAndUsernameContent.appendChild(username);

        let image = document.createElement('img');
        image.classList.add('avatar', 'me-2', 'ms-2');


        imageUrl = config.backend + config.endpoints.getUserImage.url + '/' + user.username;
        image.src = imageUrl;

        image.onerror = () => {
          image.src = '../img/placeholder-profile-picture.png';
        };

        profileInfo.appendChild(image);
        profileInfo.appendChild(nameAndUsernameContent);
        profileContainer.appendChild(profileInfo);
        profileContainer.classList.remove('d-none');

        if (currentUser.username === user.username) {
          let editButtonContainer = document.createElement('div');
          editButtonContainer.classList.add('d-flex', 'flex-column', 'align-items-center', 'w-100');
          let editButton = document.createElement('a');
          editButton.classList.add('btn', 'btn-success', 'mt-2');
          editButtonIcon = document.createElement('i');
          editButtonIcon.classList.add('fa', 'fa-pen', 'me-2');
          editButton.appendChild(editButtonIcon);
          editButton.innerHTML += 'Edit Profile';
          editButton.addEventListener('click', () => {
              window.location.href = '/pages/edit-profile?username=' + user.username;
          });
          editButtonContainer.appendChild(editButton);
          profileContainer.appendChild(editButtonContainer);
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
