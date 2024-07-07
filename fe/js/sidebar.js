

const sidebar = () => {
  const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
  const templateLinks = document.getElementById("sidebar-links");
  const headerAvatar = document.getElementById("header-avatar");
  const sidebarAvatar = document.getElementById("sidebar-avatar");

  const currentUrl = window.location.pathname;
  const currentUrlWithParams =
    window.location.pathname + window.location.search;

  const sidebarLinks = [
    {
      text: "Posts",
      url: "/",
      icon: "fa-solid fa-newspaper",
    },
    {
      text: "New Post",
      url: "/pages/new-post",
      icon: "fa-solid fa-plus",
    },
    {
      text: "My Profile",
      url: "/pages/profile?username=" + currentUser.username,
      icon: "fa-solid fa-user",
    },
    {
      text: "Exit",
      id: "logout-button",
      icon: "fa-solid fa-right-from-bracket",
    },
  ];
  
  let profileContainer = document.getElementById('sidebar-profile-info');
  let nameAndLastName = document.createElement('div');
  nameAndLastName.classList.add('w-100', 'text-center', 'fullname');
  nameAndLastName.innerText = currentUser.name + ' ' + currentUser.surname;
  let username = document.createElement('div');
  username.classList.add('w-100', 'text-center', 'username');
  username.innerText = currentUser.username;
  username.setAttribute('id', 'profile-username');
  profileContainer.appendChild(nameAndLastName);
  profileContainer.appendChild(username);


  sidebarLinks.forEach((link, i) => {
    let li = document.createElement("li");
    let a = document.createElement("a");
    let icon = document.createElement("i");
    icon.classList.add("fas", ...link.icon.split(" "));
    li.appendChild(icon);

    li.classList.add(
      "nav-item",
      "w-100",
      "d-flex",
      "flex-row",
      "align-items-center",
      "ps-3",
    );
    if (i < sidebarLinks.length - 1) {
      li.classList.add("border-bottom", "border-color");
    }
    li.appendChild(a);
    a.classList.add("nav-link", "d-block", "w-100", "h-100");
    a.innerText = link.text;
    if (link.url) {
      a.href = link.url;
    }
    if (link.id) {
      a.id = link.id;
    }
    if (currentUrl === link.url || currentUrlWithParams === link.url) {
      li.classList.add("active");
    }
    templateLinks.appendChild(li);
  });

  headerAvatar.src = config.backend + config.endpoints.getUserImage.url + '/' + currentUser.username;
  headerAvatar.onerror = () => {
    headerAvatar.src = "../img/placeholder-profile-picture.png";
  };
  sidebarAvatar.src = config.backend + config.endpoints.getUserImage.url + '/' + currentUser.username;
  sidebarAvatar.onerror = () => {
    sidebarAvatar.src = "../img/placeholder-profile-picture.png";
  };

  //EVENTO GLOBAL PARA REFRESCAR AVATARES
  //=============================================================================
  const refreshSidebarAndHeaderAvatar = () => {
    console.log("refreshing avatars");
    headerAvatar.src = config.backend + config.endpoints.getUserImage.url + '/' + currentUser.username + "?" + new Date().getTime();
    sidebarAvatar.src = config.backend + config.endpoints.getUserImage.url + '/' + currentUser.username + "?" + new Date().getTime();
  }
  Object.assign(window, { refreshSidebarAndHeaderAvatar });
};
sidebar();


