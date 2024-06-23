
function verify() {
  let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));

  if(!currentUser){
    window.location.href = '/pages/login';
  }
}
verify();
