const passwordInput = document.querySelector("#password");

function showPassword(e) {
  e.preventDefault();

  const buttonIcon = e.currentTarget.getElementsByTagName("i")[0];
  buttonIcon.className = buttonIcon.className === "fa fa-eye" ? "fa fa-eye-slash" : "fa fa-eye";

  console.log("show password");
  passwordInput.type = passwordInput.type === "password" ? "text" : "password";
}
