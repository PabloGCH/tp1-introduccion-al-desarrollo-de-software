

let convertPostToHTMLObjects = (data) => {
    let postCard = document.createElement('a');
    postCard.classList.add('post', 'surface', 'shadow', 'rounded', 'border', 'border-color', 'p-2', 'mb-2')
    postCard.href = '/pages/post/' + data.id;

    //SECCION DE TITULO
    let postCardTitleBox = document.createElement('div');
    postCardTitleBox.classList.add('post-title-box', 'd-flex', 'justify-content-between', 'align-items-center', 'mb-2', 'border-bottom', 'border-color');
    let title = document.createElement('h2');
    title.innerText = data.title;
    let creationInformation = document.createElement('div');
    creationInformation.classList.add('d-flex', 'flex-column');
    let owner = document.createElement('a');
    owner.classList.add('owner-link');
    owner.href = '/pages/profile/' + data.owner;
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
    let content = document.createElement('p');
    content.classList.add('pt-2');
    content.innerText = data.content;
    postCardContent.appendChild(img);
    postCardContent.appendChild(content);

    //AGREGAR SECCIONES A LA CARD
    postCard.appendChild(postCardTitleBox);
    postCard.appendChild(postCardContent);
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


