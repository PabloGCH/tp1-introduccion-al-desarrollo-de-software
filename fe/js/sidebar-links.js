const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
const templateLinks = document.getElementById('sidebar-links');

const sidebarLinks = [{
  text: 'Posts',
  url: '/',
  icon: 'fa-solid fa-newspaper'
}, {
  text: 'Profile',
  url: '/pages/profile/' + currentUser.username,
  icon: 'fa-solid fa-user'
},{
  text: 'Exit',
  id: 'logout-button',
  icon: 'fa-solid fa-right-from-bracket'
}];

sidebarLinks.forEach((link, i) => {
  let li = document.createElement('li');
  let a = document.createElement('a');
  let icon = document.createElement('i');
  icon.classList.add('fas', ...link.icon.split(' '));
  li.appendChild(icon);

  li.classList.add('nav-item', 'w-100', 'd-flex', 'flex-row', 'align-items-center', 'ps-3');
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
