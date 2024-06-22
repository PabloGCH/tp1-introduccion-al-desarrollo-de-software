let convertPostToHTMLObjects = (data) => {
    let postCard = document.createElement('div');
    postCard.classList.add('post', 'surface', 'shadow', 'rounded', 'border', 'border-color', 'p-2', 'mb-2')
    let title = document.createElement('h2');
    title.innerText = data.title;
    let content = document.createElement('div');
    content.innerText = data.content;
    postCard.appendChild(title);
    postCard.appendChild(content);
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


