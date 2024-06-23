

let createPostHeader = (data) => {
    let container = document.createElement('div');
    container.classList.add('post-header', 'd-flex', 'flex-column', 'flex-md-row', 'justify-content-between', 'mb-2', 'border-bottom', 'border-color', 'py-1');

    let title = document.createElement('h2');
    title.innerText = data.title;

    let creationInformation = document.createElement('div');
    creationInformation.classList.add('d-flex', 'flex-column');

    let owner = document.createElement('a');
    owner.classList.add('owner-link');
    owner.href = '/pages/profile/' + data.ownerName;
    owner.innerText = '@' + data.ownerName;

    let creationDate = document.createElement('span');
    creationDate.innerText = 'Created at: ' + new Date(data.created).toLocaleString();
    creationDate.classList.add('small');

    creationInformation.appendChild(owner);
    creationInformation.appendChild(creationDate);

    container.appendChild(title);
    container.appendChild(creationInformation);
    return container;
}

let createPostContent = (data) => {
    let container = document.createElement('div');
    container.classList.add('post-content', 'd-flex', 'flex-column', 'flex-md-row');

    if(data.image){
        let img= document.createElement('img');
        img.src = config.backend + config.endpoints.getPostImage.url + '/' + data.id;
        img.classList.add('rounded', 'border', 'border-color', 'post-img', 'me-md-2');
        img.addEventListener('error', imgLoadError);
        container.appendChild(img);
    }

    let content = document.createElement('div');
    content.classList.add('pt-2', 'w-100');
    content.innerHTML= data.content;

    container.appendChild(content);

    return container
}

let createPostButtons = (data) => {
    let content = document.createElement('div');
    content.classList.add('post-buttons','d-flex', 'flex-row', 'justify-content-left', 'mt-2', 'pt-2', 'w-100', 'border-top', 'border-color');

    let likeButton = document.createElement('button');
    likeButton.classList.add('btn', 'btn-empty', 'border', 'border-color', 'rounded', 'me-2');
    if (data.currentUserLikes){
        likeButton.classList.add('text-success');
    }

    let likeIcon = document.createElement('i');
    likeIcon.classList.add('fa', 'fa-thumbs-up', 'me-2');

    likeButton.appendChild(likeIcon);
    likeButton.addEventListener('click', (e) => {
        e.preventDefault()
        reactToPost(data.id, 'like');
    });

    let spanLikes = document.createElement('span');
    spanLikes.innerText = data.likes
    likeButton.appendChild(spanLikes);


    let dislikeButton = document.createElement('button');
    dislikeButton.classList.add('btn', 'btn-empty', 'border', 'border-color', 'rounded', 'me-2');
    if (data.currentUserDislikes){
        dislikeButton.classList.add('text-danger');
    }

    let dislikeIcon = document.createElement('i');
    dislikeIcon.classList.add('fa', 'fa-thumbs-down', 'me-2');

    dislikeButton.appendChild(dislikeIcon);
    dislikeButton.addEventListener('click', (e) => {
        e.preventDefault()
        reactToPost(data.id, 'dislike');
    });

    let spanDislikes = document.createElement('span');
    spanDislikes.innerText = data.dislikes
    dislikeButton.appendChild(spanDislikes);


    // let commentButton = document.createElement('button');
    // commentButton.classList.add('btn', 'btn-empty', 'border', 'border-color', 'rounded');
    // let commentIcon = document.createElement('i');
    // commentIcon.classList.add('fa', 'fa-comment', 'me-2');
    // commentButton.appendChild(commentIcon);
    // commentButton.appendChild(document.createTextNode(0));
    // postCardButtons.appendChild(commentButton);


    content.appendChild(likeButton);
    content.appendChild(dislikeButton);
    return content;
}


let convertPostToHTMLObjects = (data) => {
    let postCard = document.createElement('div');
    postCard.classList.add('post', 'surface', 'shadow', 'rounded', 'border', 'border-color', 'p-2', 'mb-2')
    postCard.href = '/pages/post/' + data.id;
    postCard.id='post-'+data.id;

    //SECCION DE TITULO
    let postHeader = createPostHeader(data);

    //SECCION DE CONTENIDO
    let postContent = createPostContent(data);

    //SECCION DE BOTONES
    let postButtons = createPostButtons(data);

    //AGREGAR SECCIONES A LA CARD
    postCard.appendChild(postHeader);
    postCard.appendChild(postContent);
    postCard.appendChild(postButtons);
    return postCard;
}

let createPost = (data) => {
    let postCard = convertPostToHTMLObjects(data);
    let container = document.getElementById('main-section-content')
    container.appendChild(postCard);
}

let updatePostButtons = (data, postId) => {
    let postCard = document.getElementById('post-'+postId);

    if (postCard){
        let postButtons = createPostButtons(data);
        let oldButtons = postCard.getElementsByClassName('post-buttons')[0];

        postCard.replaceChild(postButtons, oldButtons);
    }
}

let getPostErrorHandler = (error) => {
    errorToast('Error desconocido');
}

let reactToPost = (postId, reaction) => {
    let requestConfig = {
        method: config.endpoints.reactToPost.method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
    };

    fetch(config.backend + config.endpoints.reactToPost.url+'/'+reaction+'/'+postId, requestConfig)
        .then(response => {
            getPostWithID(postId).then(response => response.json())
            .then(data => updatePostButtons(data, postId))
        })
        .catch(unknownErrorHandler);
}

const unknownErrorHandler = (error) => {
    errorToast('Error desconocido');
}

const responsePostsHandler = (response) => {
  if (response.ok) {
      response.json().then((data) => {
        let posts = data || [];
        posts.forEach(post => {
            createPost(post);
        });
      });
  } else {
      response.json().then(getPostErrorHandler);
  }
}


let getPostWithID = (postId) => {

    let requestConfig = {
        method: config.endpoints.getPost.method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
    };

    return fetch(config.backend + config.endpoints.getPost.url + '/' + postId, requestConfig)
}

let getLastPosts = () => {
    let requestConfig = {
        method: config.endpoints.getPosts.method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
    };

    fetch(config.backend + config.endpoints.getPosts.url, requestConfig)
        .then(responsePostsHandler)
        .catch(unknownErrorHandler);
}

getLastPosts();
