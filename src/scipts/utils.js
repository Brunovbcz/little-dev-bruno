// Quando o botão de menu é clicado 🖱️
function menuButton() {
    let sideBar = document.querySelector('aside');
    let menusBackground = document.querySelector('.menus-background');
    let title = document.querySelector('#title');
    let menuBtn = document.querySelector('#menu-btn')
    let textLabel = document.querySelectorAll('#text-label')
    let background = document.querySelector('.background')

    if (title) title.classList.toggle('open')
    if (sideBar) sideBar.classList.toggle('open')
    if (menusBackground) menusBackground.classList.toggle('open')
    if (menuBtn) menuBtn.classList.toggle('open')
    if (background) background.classList.toggle('open')
    if (textLabel) textLabel.forEach(function(t) {t.classList.toggle('open')})
}

function toMySqlDatetime(dateString) {
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function toDatetime(dateString) {
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}`;
}