const editProfile = () => {
  //VARIABLES
  //=============================================================================

  const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
  const nameInput = document.getElementById("name");
  const surnameInput = document.getElementById("surname");
  const imageInput = document.getElementById("image");
  const editProfileForm = document.getElementById("edit-profile-form");
  const changePasswordForm = document.getElementById("change-password-form");
  let loading = false;

  //FUNCTIONS
  //=============================================================================

  const refresh = (data) => {
    nameInput.value = data.name;
    surnameInput.value = data.surname;
    imageInput.value = data.image;
    if (data.image) {
      let container = document.getElementById("image-preview");
      let img = document.createElement("img");
      img.src =
        config.backend + config.endpoints.getPostImage.url + "/" + data.id;
      img.classList.add(
        "rounded",
        "border",
        "border-color",
        "post-img",
        "me-md-2",
      );
      img.addEventListener("error", imgLoadError);
      container.appendChild(img);
    }
  };

  const editResponseHandler = (data) => {
    return (response) => {
      loading = false;
      if (response.ok) {
        currentUser.name = data.name;
        currentUser.surname = data.surname;
        sessionStorage.setItem("currentUser", JSON.stringify(currentUser));
        successToast("Profile updated successfully.");
      } else {
        response.json().then(ErrorHandler);
      }
    };
  };

  const changePasswordResponseHandler = (response) => {
    loading = false;
    if (response.ok) {
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
      //body.image = e.target["image"].value;
    }
    let requestConfig = {
      method: config.endpoints.editProfile.method,
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    };
    console.log(requestConfig);
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
  refresh(currentUser);
};

editProfile();
