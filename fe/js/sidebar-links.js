const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
const templateLinks = document.getElementById('sidebar-links');

const sidebarLinks = [{
  text: 'Posts',
  url: '/',
}, {
  text: 'Profile',
  url: '/pages/profile/' + currentUser.username
},{
  text: 'Exit',
  id: 'logout-button',
}];

sidebarLinks.forEach((link, i) => {
  let li = document.createElement('li');
  let a = document.createElement('a');
  li.classList.add('nav-item', 'w-100');
  if(i < sidebarLinks.length - 1) {
    li.classList.add('border-bottom', 'border-color');
  }
  li.appendChild(a);
  a.classList.add('nav-link', 'text-white', 'd-block', 'w-100', 'h-100');
  a.innerText = link.text;
  if(link.url){
    a.href = link.url;
  }
  if(link.id){
    a.id = link.id;
  }
  templateLinks.appendChild(li);
});
