const editProfile = () => {
  //VARIABLES
  const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
  const nameInput = document.getElementById("name");
  const surnameInput = document.getElementById("surname");
  const imageInput = document.getElementById("image");
  const saveProfileButton = document.getElementById("save-profile");
  const savePasswordButton = document.getElementById("save-password");
  
  //FUNCTIONS
  const refresh = (data) => {
    nameInput.value = data.name;
    surnameInput.value = data.surname;
    imageInput.value = data.image;
    if(data.image){
        let container = document.getElementById('image-preview');
        let img= document.createElement('img');
        img.src = config.backend + config.endpoints.getPostImage.url + '/' + data.id;
        img.classList.add('rounded', 'border', 'border-color', 'post-img', 'me-md-2');
        img.addEventListener('error', imgLoadError);
        container.appendChild(img);
    }
  };

  const editProfile = (e) => {

  };

  const changePassword = (e) => {

  };
  
  //INIT
  refresh(currentUser);
};



editProfile();
