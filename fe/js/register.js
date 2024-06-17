
const registerForm = document.getElementById('register-form');

const register = (e) => {
  e.preventDefault(); //Evita que se recargue la página al enviar el formulario

  let email = e.target['email'].value;
  let emailVerify = e.target['email-verify'].value;
  let password = e.target['password'].value;
  let passwordVerify = e.target['password-verify'].value;
  let name = e.target['name'].value;
  let surname = e.target['surname'].value;
  let username = e.target['username'].value;

  // TODO

  errorToast('User already exists');
}

registerForm.addEventListener('submit', register);



