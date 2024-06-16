const notyf = new Notyf({
  duration: 3000,
  ripple: true,
  position: {
    x: 'right',
    y: 'top',
  }
});

function successToast(message) {
  notyf.success(message);
}

function errorToast(message) {
  notyf.error(message);
}
