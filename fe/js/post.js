let isPostDetail = window.location.href.includes('/pages/post?postId=');

let createPostHeader = (data) => {
    let container = document.createElement('div');
    container.classList.add('post-header', 'd-flex', 'flex-column', 'flex-md-row', 'justify-content-between', 'mb-2', 'border-bottom', 'border-color', 'py-1');

    let title = document.createElement('h2');
    title.innerText = data.title;

    let creationInformation = document.createElement('div');
    creationInformation.classList.add('d-flex', 'flex-column');

    let owner = document.createElement('a');
    owner.classList.add('owner-link');
    owner.href = '/pages/profile?username=' + data.ownerName;
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
    container.classList.add('post-content', 'd-flex', 'flex-column');
    if(!isPostDetail){
        container.classList.add('flex-md-row');
    }

    if(data.image){
        let img= document.createElement('img');
        img.src = config.backend + config.endpoints.getPostImage.url + '/' + data.id;
        img.classList.add('rounded', 'border', 'border-color', 'post-img', 'me-md-2');
        if(isPostDetail) {
          img.classList.add('post-img-detail');
        }
        img.addEventListener('error', imgLoadError);
        container.appendChild(img);
    }

    let content = document.createElement('div');
    content.classList.add('pt-2', 'w-100');
    content.innerHTML= data.content;

    container.prepend(content);

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


    let commentButton = document.createElement('button');
    commentButton.classList.add('btn', 'btn-empty', 'border', 'border-color', 'rounded', 'post-comment-counter');
    let commentIcon = document.createElement('i');
    commentIcon.classList.add('fa', 'fa-comment', 'me-2');
    let spanComments = document.createElement('span');
    spanComments.innerText = data.comments
    commentButton.appendChild(commentIcon);
    commentButton.appendChild(spanComments);


    let editButton = document.createElement('button');
    let deleteButton = document.createElement('button');
    if(data.currentUserIsOwner){
        editButton.classList.add('btn', 'btn-empty', 'border', 'border-color', 'rounded', 'ms-auto');
        let editIcon = document.createElement('i');
        editIcon.classList.add('fa', 'fa-edit');
        editButton.appendChild(editIcon);
        editButton.addEventListener('click', (e) => {
            e.preventDefault()
            window.location.href = '/pages/edit-post?postId=' + data.id;
        });

        deleteButton.classList.add('btn', 'btn-empty', 'border', 'border-color', 'rounded', 'ms-2', 'text-danger');
        let deleteIcon = document.createElement('i');
        deleteIcon.classList.add('fa', 'fa-trash');
        deleteButton.appendChild(deleteIcon);
        deleteButton.addEventListener('click', (e) => {
            e.preventDefault()
            confirmWarning('', 'Are you sure you want to delete this post?').then((value) => {
              if(value.isConfirmed){
                deletePost(data.id);
              }
            });
        });

    }

    content.appendChild(likeButton);
    content.appendChild(dislikeButton);
    content.appendChild(commentButton);
    if(data.currentUserIsOwner){
        content.appendChild(editButton);
        content.appendChild(deleteButton);
    }

    return content;
}

let convertPostToHTMLObjects = (data) => {
    let postCard = document.createElement('div');
    postCard.classList.add('post', 'relative', 'surface', 'shadow', 'rounded', 'border', 'border-color', 'p-2', 'mb-2')
    postCard.id='post-'+data.id;
    
    if(!isPostDetail){
        postCard.classList.add('cursor-pointer');
        let redirect = document.createElement('a');
        redirect.classList.add('absolute','inset-0')
        redirect.href = '/pages/post?postId=' + data.id;
        postCard.appendChild(redirect);
    }

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
    container.append(postCard);
}

let updatePostButtons = (data, postId) => {
    let postCard = document.getElementById('post-'+postId);

    if (postCard){
        let postButtons = createPostButtons(data);
        let oldButtons = postCard.getElementsByClassName('post-buttons')[0];

        postCard.replaceChild(postButtons, oldButtons);
    }
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
        .catch(UnknownErrorHandler);
}

let deletePost = (postId) => {
    let requestConfig = {
        method: config.endpoints.deletePost.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({id: postId}),
        credentials: 'include'
    };

    fetch(config.backend + config.endpoints.deletePost.url, requestConfig)
        .then(response => {
            if (response.ok) {
                let postCard = document.getElementById('post-'+postId);
                postCard.remove();
                successToast('Post eliminado');
                if(isPostDetail){
                    window.location.href = '/';
                }
                addNoPostsMessage();
            } else {
                response.json().then(ErrorHandler);
            }
        })
        .catch(UnknownErrorHandler);
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

    return fetch(config.backend + config.endpoints.getPosts.url, requestConfig)
}

let getPostOfUsername = (username = '', filter = 'last-posts') => {
    if(username){

        let urlFilter = '/' + username;
        if(filter){
            urlFilter += '/' + filter;
        }

        let requestConfig = {
            method: config.endpoints.getPosts.method,
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        };

        return fetch(config.backend + config.endpoints.getPosts.url + urlFilter, requestConfig)
    }
}

const addNoPostsMessage = () => {
  let container = document.getElementById('main-section-content');
  if(container.childElementCount > 0){
    return;
  }
  let noPosts = document.createElement('h3');
  noPosts.classList.add('d-flex', 'align-items-center', 'justify-content-center', 'surface', 'rounded', 'p-2', 'shadow', 'border', 'border-color');
  noPosts.innerText = 'No posts found';
  let sadIcon = document.createElement('i');
  sadIcon.classList.add('fa', 'fa-frown', 'me-2');
  let magnifyingGlassIcon = document.createElement('i');
  magnifyingGlassIcon.classList.add('fa', 'fa-search', 'me-2');
  noPosts.prepend(sadIcon);
  noPosts.prepend(magnifyingGlassIcon);
  container.appendChild(noPosts);
}

const responsePostsHandler = (response) => {
    if (response.ok) {
        response.json().then((data) => {
                if (typeof data === 'object' && !Array.isArray(data)){
                    data = [data];
                }
                let posts = data || [];
                posts.forEach(post => {
                    createPost(post);
                });
                addNoPostsMessage();
            });
        } else {
            response.json().then(ErrorHandler);
        }
    }

let currentLocation = window.location.href;

if (currentLocation.includes('/pages/post')) {
    let urlParams = new URLSearchParams(window.location.search);
    let postId = urlParams.get('postId');
    getPostWithID(postId).then(responsePostsHandler)
    .catch(UnknownErrorHandler);
} else if (currentLocation.includes('/pages/profile')) {
    let urlParams = new URLSearchParams(window.location.search);
    let username = urlParams.get('username');
    getPostOfUsername(username).then(responsePostsHandler)
    .catch(UnknownErrorHandler);
} else {
    getLastPosts().then(responsePostsHandler)
    .catch(UnknownErrorHandler);
}
