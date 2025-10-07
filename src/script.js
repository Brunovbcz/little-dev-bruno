// Quando o botão de menu é clicado 🖱️
function menuButton() {
    let sideBar = document.querySelector('aside');
    let menusBackground = document.querySelector('.menus-background');
    let title = document.querySelector('#title');
    let menuBtn = document.querySelector('#menu-btn')
    let textLabel = document.querySelectorAll('#text-label')

    if (title) title.classList.toggle('open')
    if (sideBar) sideBar.classList.toggle('open')
    if (menusBackground) menusBackground.classList.toggle('open')
    if (menuBtn) menuBtn.classList.toggle('open')
    if (textLabel) textLabel.forEach(function(t) {t.classList.toggle('open')})
}