

let convertPostToHTMLObjects = (data) => {
    let postCard = document.createElement('a');
    postCard.classList.add('post', 'surface', 'shadow', 'rounded', 'border', 'border-color', 'p-2', 'mb-2')
    postCard.href = '/pages/post/' + data.id;

    //SECCION DE TITULO
    let postCardTitleBox = document.createElement('div');
    postCardTitleBox.classList.add('post-title-box', 'd-flex', 'flex-column', 'flex-md-row', 'justify-content-between', 'mb-2', 'border-bottom', 'border-color', 'py-1');
    let title = document.createElement('h2');
    title.innerText = data.title;
    let creationInformation = document.createElement('div');
    creationInformation.classList.add('d-flex', 'flex-column');
    let owner = document.createElement('a');
    owner.classList.add('owner-link');
    owner.href = '/pages/profile/' + data.ownerName;
    owner.innerText = '@' + data.ownerName;
    creationInformation.appendChild(owner);

    let creationDate = document.createElement('span');
    creationDate.innerText = 'Created at: ' + new Date(data.created).toLocaleString();
    creationDate.classList.add('small');
    creationInformation.appendChild(creationDate);
    

    postCardTitleBox.appendChild(title);
    postCardTitleBox.appendChild(creationInformation);
    
    //SECCION DE CONTENIDO
    let postCardContent = document.createElement('div');
    postCardContent.classList.add('post-content', 'd-flex', 'flex-column', 'flex-md-row');
    let img= document.createElement('img');
    img.src = config.backend + config.endpoints.getPostImage.url + '/' + data.id;
    img.classList.add('rounded', 'border', 'border-color', 'post-img', 'me-md-2');
    img.addEventListener('error', imgLoadError);
    let content = document.createElement('div');
    content.classList.add('pt-2', 'w-100');
    content.innerHTML= data.content;
    postCardContent.appendChild(img);
    postCardContent.appendChild(content);

    //SECCION DE BOTONES
    let postCardButtons = document.createElement('div');
    postCardButtons.classList.add('d-flex', 'flex-row', 'justify-content-center', 'mt-2', 'pt-2', 'w-100', 'border-top', 'border-color');
    let likeButton = document.createElement('button');

    likeButton.classList.add('btn', 'btn-empty', 'border', 'border-color', 'rounded', 'me-2');
    let likeIcon = document.createElement('i');
    likeIcon.classList.add('fa', 'fa-thumbs-up', 'me-2');
    likeButton.appendChild(likeIcon);
    likeButton.appendChild(document.createTextNode(0));
    postCardButtons.appendChild(likeButton);

    let dislikeButton = document.createElement('button');
    dislikeButton.classList.add('btn', 'btn-empty', 'border', 'border-color', 'rounded', 'me-2');
    let dislikeIcon = document.createElement('i');
    dislikeIcon.classList.add('fa', 'fa-thumbs-down', 'me-2');
    dislikeButton.appendChild(dislikeIcon);
    dislikeButton.appendChild(document.createTextNode(0));
    postCardButtons.appendChild(dislikeButton);

    let commentButton = document.createElement('button');
    commentButton.classList.add('btn', 'btn-empty', 'border', 'border-color', 'rounded');
    let commentIcon = document.createElement('i');
    commentIcon.classList.add('fa', 'fa-comment', 'me-2');
    commentButton.appendChild(commentIcon);
    commentButton.appendChild(document.createTextNode(0));
    postCardButtons.appendChild(commentButton);
    

    //AGREGAR SECCIONES A LA CARD
    postCard.appendChild(postCardTitleBox);
    postCard.appendChild(postCardContent);
    postCard.appendChild(postCardButtons);
    return postCard;
}

let createPost = (data) => {
    let postCard = convertPostToHTMLObjects(data);
    let container = document.getElementById('main-section-content')
    container.appendChild(postCard);
}

//for (let index = 0; index < 10; index++) {
//    createPost({'title': 'Hello World', 'content': 'This is my first post. I am so excited to share my thoughts with you.'});
//}

let getPostErrorHandler = (error) => {
    errorToast('Error desconocido');
}


let requestConfig = {
    method: config.endpoints.getPosts.url,
    headers: { 'Content-Type': 'application/json' },
    method: config.endpoints.getPosts.method,
    credentials: 'include'
};

const unknownErrorHandler = (error) => {
    errorToast('Error desconocido');
}

const responseHandler = (response) => {
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


fetch(config.backend + config.endpoints.getPosts.url, requestConfig)
    .then(responseHandler)
    .catch(unknownErrorHandler);


