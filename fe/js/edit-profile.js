const editProfile = () => {
  //VARIABLES
  //=============================================================================

  const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
  const nameInput = document.getElementById("name");
  const surnameInput = document.getElementById("surname");
  const imageInput = document.getElementById("image");
  const oldPasswordInput = document.getElementById("oldPassword");
  const newPasswordInput = document.getElementById("newPassword");
  const newPasswordVerifyInput = document.getElementById("newPasswordVerify");
  const editProfileForm = document.getElementById("edit-profile-form");
  const changePasswordForm = document.getElementById("change-password-form");
  let loading = false;

  //FUNCTIONS
  //=============================================================================
  
  const reloadImg = (base64img) => {
      let container = document.getElementById("image-preview");
      container.innerHTML = "";
      let img = document.createElement("img");
      if (base64img) {
        img.src = "data:image/png;base64," + base64img;
      } else {
        img.src = config.backend + config.endpoints.getUserImage.url + '/' + currentUser.username + "?" + new Date().getTime();
      }
      img.onerror = () => {
        console.log("error loading image");
        img.src = "../img/placeholder-profile-picture.png";
      };
      img.classList.add(
        "border",
        "border-color",
        "avatar"
      );
      container.appendChild(img);
  };

  const refresh = (data) => {
    nameInput.value = data.name;
    surnameInput.value = data.surname;
    imageInput.value = "";
    reloadImg();
  };

  const editResponseHandler = (data) => {
    return (response) => {
      loading = false;
      if (response.ok) {
        currentUser.name = data.name;
        currentUser.surname = data.surname;
        currentUser.image = data.image || null;

        sessionStorage.setItem("currentUser", JSON.stringify(currentUser));
        window.refreshSidebarAndHeaderAvatar();

        refresh(currentUser);
        successToast("Profile updated successfully.");
      } else {
        response.json().then(ErrorHandler);
      }
    };
  };

  const changePasswordResponseHandler = (response) => {
    loading = false;
    if (response.ok) {
      oldPasswordInput.value = "";
      newPasswordInput.value = "";
      newPasswordVerifyInput.value = "";
      successToast("Password changed successfully.");
    } else {
      response.json().then(ErrorHandler);
    }
  };

  const editProfile = (e) => {
    e.preventDefault();
    if (loading) {
      return;
    }
    loading = true;
    let body = {
      name: e.target["name"].value,
      surname: e.target["surname"].value,
    };
    if (e.target["image"].value) {
      body.image = e.target["image64"].value;
    }
    let requestConfig = {
      method: config.endpoints.editProfile.method,
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    };
    fetch(config.backend + config.endpoints.editProfile.url, requestConfig)
      .then(editResponseHandler(body))
      .catch((e) => {
        loading = false;
        ErrorHandler(e);
      });
  };

  const changePassword = (e) => {
    e.preventDefault();
    if (loading) {
      return;
    }
    loading = true;
    let body = {
      oldPassword: e.target["oldPassword"].value,
      newPassword: e.target["newPassword"].value,
      newPasswordVerify: e.target["newPasswordVerify"].value,
    };
    let requestConfig = {
      method: config.endpoints.changePassword.method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      credentials: "include",
    };
    fetch(config.backend + config.endpoints.changePassword.url, requestConfig)
      .then(changePasswordResponseHandler)
      .catch(() => {
        loading = false;
        ErrorHandler(e);
      });
  };

  //INIT
  editProfileForm.addEventListener("submit", editProfile);
  changePasswordForm.addEventListener("submit", changePassword);
  imageInput.addEventListener("change", (e) => {
    let reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);

    reader.onload = (e) => {
      let result = e.target.result;
      let image64 = result.split(",")[1];
      document.getElementById("image64").value = image64;
      reloadImg(image64);
    };
  });

  refresh(currentUser);
};

editProfile();
