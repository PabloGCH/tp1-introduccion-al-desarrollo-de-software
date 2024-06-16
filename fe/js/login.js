const loginForm = document.getElementById('login-form');

const login = (e) => {
  e.preventDefault(); //Evita que se recargue la página al enviar el formulario

  let username = e.target['email-username'].value;
  let password = e.target['password'].value;

  // TODO

  errorToast('Invalid username or password');
}

loginForm.addEventListener('submit', login);



