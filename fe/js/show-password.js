const passwordInput = document.querySelector("#password");
const passwordInputVerify = document.querySelector("#password-verify");

function showPassword(e, isVerify = false) {
  e.preventDefault();

  const buttonIcon = e.currentTarget.getElementsByTagName("i")[0];
  buttonIcon.className = buttonIcon.className === "fa fa-eye" ? "fa fa-eye-slash" : "fa fa-eye";

  if(isVerify)
    passwordInputVerify.type = passwordInputVerify.type === "password" ? "text" : "password";
  else
    passwordInput.type = passwordInput.type === "password" ? "text" : "password";
}

function showPasswordVerify(e) {
  showPassword(e, true);
}
