function getPasswordButtonClickEvent(icon, input) {
  return (e) => {
    e.preventDefault();
    icon.className = icon.className === "fa fa-eye" ? "fa fa-eye-slash" : "fa fa-eye";
    input.type = input.type === "password" ? "text" : "password";
  };
}

const inputContainers = document.querySelectorAll(".show-password");
inputContainers .forEach((inputContainer) => {
  const button = inputContainer.getElementsByTagName("button")[0];
  const buttonIcon = inputContainer.getElementsByTagName("i")[0];
  const input = inputContainer.getElementsByTagName("input")[0];
  const event = getPasswordButtonClickEvent(buttonIcon, input);
  button.addEventListener("click", event);
});






