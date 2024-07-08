const comments = () => {
  const commentSection = document.getElementById('comment-section');
  const commentForm = document.getElementById('new-comment-form');
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get('postId');
  let loading = false;

  const displayNoCommentsMessage = () => {
    if (commentSection.childElementCount > 0) {
      return;
    }
    commentSection.innerHTML = '';
    let noCommentsMessage = document.createElement('h3');
    noCommentsMessage .classList.add('d-flex', 'align-items-center', 'justify-content-center', 'surface', 'rounded', 'p-2', 'shadow', 'border', 'border-color');
    noCommentsMessage .innerText = 'No comments found';
    let sadIcon = document.createElement('i');
    sadIcon.classList.add('fa', 'fa-frown', 'me-2');
    let magnifyingGlassIcon = document.createElement('i');
    magnifyingGlassIcon.classList.add('fa', 'fa-search', 'me-2');
    noCommentsMessage.prepend(sadIcon);
    noCommentsMessage.prepend(magnifyingGlassIcon);
    commentSection.appendChild(noCommentsMessage);
  }

  const loadCommentsHandler = (comments) => {
    comments.forEach(comment => {
      let commentContainer = document.createElement('div');
      commentContainer.id = 'comment-' + comment.id;
      commentContainer.classList.add('d-flex', 'flex-column', 'align-items-start', 'p-2', 'rounded', 'shadow', 'border', 'border-color', 'mb-2', 'surface');

      let commentContent = document.createElement('p');
      commentContent.innerText = comment.content;

      let commentHeader = document.createElement('div');
      commentHeader.classList.add('d-flex', 'flex-row', 'align-items-center', 'w-100');

      let commentAuthorSection = document.createElement('div');
      commentAuthorSection .classList.add('d-flex', 'flex-column', 'w-100');

      let commentAuthorNameAndAvatar = document.createElement('div');
      commentAuthorNameAndAvatar .classList.add('d-flex', 'flex-row', 'align-items-center', 'w-100');

      let commentAuthorAvatar = document.createElement('img');
      commentAuthorAvatar.classList.add('comment-avatar', 'me-2');
      commentAuthorAvatar.src = config.backend + config.endpoints.getUserImage.url + '/' + comment.ownerName;
      commentAuthorAvatar.onerror = () => {
        commentAuthorAvatar.src = "../img/placeholder-profile-picture.png";
      };

      let commentAuthor = document.createElement('a');
      commentAuthor.classList.add('me-5');

      commentAuthor.classList.add('username');
      commentAuthor.href = '/pages/profile?username=' + comment.ownerName;
      commentAuthor.innerText = '@' + comment.ownerName;

      let creationDate = document.createElement('span');
      creationDate.classList.add('small');
      creationDate.innerText = 'Created At: ' +  new Date(comment.created).toLocaleString();

      commentAuthorNameAndAvatar .appendChild(commentAuthorAvatar);
      commentAuthorNameAndAvatar .appendChild(commentAuthor);

      let separator = document.createElement('hr');
      separator.classList.add('w-100', 'mb-3', 'mt-2');
      
      
      commentAuthorSection.appendChild(commentAuthorNameAndAvatar);
      commentAuthorSection.appendChild(creationDate);

      commentHeader.appendChild(commentAuthorSection);

      if(comment.currentUserIsOwner) {
        let deleteButton = document.createElement('button');
        deleteButton.classList.add('btn', 'btn-empty', 'text-danger', 'border', 'border-color', 'rounded');
        let deleteButtonIcon = document.createElement('i');
        deleteButtonIcon.classList.add('fa', 'fa-trash');
        deleteButton.appendChild(deleteButtonIcon);
        commentHeader.appendChild(deleteButton);

        deleteButton.addEventListener('click', () => {
          if (loading) {
            return;
          }

          confirmWarning('', 'Are you sure you want to delete this comment?').then((result) => {
            if (result.isConfirmed) {
              let body = {
                'id': comment.id
              };

              let requestConfig = {
                method: config.endpoints.deleteComment.method,
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(body)
              };

              loading = true;
              fetch(config.backend + config.endpoints.deleteComment.url, requestConfig)
                .then(commentDeleteResponseHandler(comment.id))
                .catch(UnknownErrorHandler);
            }
          });
        });

      }
      

      commentContainer.appendChild(commentHeader);
      commentContainer.appendChild(separator);
      commentContainer.appendChild(commentContent);

      commentSection.appendChild(commentContainer);
    });
    displayNoCommentsMessage();
  }

  const responseCommentsHandler = (scrollToBottom = false) => {
    return (response) => {
      loading = false;
      if (response.ok) {
          response.json().then((comments) => {
            loadCommentsHandler(comments);
            if (scrollToBottom) {
              window.scrollTo(0, document.body.scrollHeight);
            }
          });
      } else {
          response.json().then(ErrorHandler);
      }
    }
  }

  const loadComments = (scrollToBottom = false) => {

    commentSection.innerHTML = '';
    let requestConfig = {
        method: config.endpoints.comments.method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
    };

    loading = true;
    fetch(config.backend + config.endpoints.comments.url + '/' + postId, requestConfig)
      .then(responseCommentsHandler(scrollToBottom))
      .catch(UnknownErrorHandler);
  }

  const commentResponseHandler = (response) => {
    loading = false;
    if (response.ok) {
        response.json().then(() => {
          successToast('Comment created successfully');
          commentForm.reset();
          commentSection.innerHTML = '';
          loadComments(true);
        });
    } else {
        response.json().then(ErrorHandler);
    }
  }

  const commentDeleteResponseHandler = (id) => {
    return (response) => {
      loading = false;
      if (response.ok) {
          response.json().then(() => {
            successToast('Comment deleted successfully');
            let comment = commentSection.querySelector('#comment-' + id);
            if (comment) {
              comment.remove();
            }
          });
      } else {
          response.json().then(ErrorHandler);
      }
    }
  }

  commentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (loading) {
      return;
    }

    let data = {
        'content': e.target['content'].value,
        'postId': postId 
    };

    let requestConfig = {
        "method": config.endpoints.comment.method,
        "body": JSON.stringify(data),
        "headers": { "Content-Type": "application/json" },
        "credentials": 'include'
    }
    
    this.loading = true;
    fetch(config.backend + config.endpoints.comment.url, requestConfig)
        .then(commentResponseHandler)
        .catch(UnknownErrorHandler);
  });

  
  loadComments();
}

comments();


