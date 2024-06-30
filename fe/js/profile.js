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

let updatePosts = (filter) => {
    let urlParams = new URLSearchParams(window.location.search);
    let username = urlParams.get('username');

    let postContent = document.getElementById('main-section-content');
    postContent.replaceChildren();
    getPostOfUsername(username, filter).then(responsePostsHandler)
    .catch(UnknownErrorHandler);
};

createPostTypesButtons();
