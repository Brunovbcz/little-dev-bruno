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

// Função para abrir menu de adicionar equipamento
function toggleEquipmentMenu() {
    let background = document.querySelector('.all-background')
    background.classList.toggle('visible')
}

document.querySelector('#add').addEventListener('click', async function(e) {
    e.preventDefault()

    let name = document.querySelector('#name').value
    let desc = document.querySelector('#desc').value
    let img = document.querySelector('#file-input')

    if (img === '' || desc === '' || name === '') return

    let fileExtension_img = ['jpeg', 'jpg', 'png', 'gif', 'bmp']; 
    let fileExtension = img.value.split('.').pop().toLowerCase();
    
    if (fileExtension_img.indexOf(fileExtension)) {
        let formData = new FormData (document.querySelector('.add-equipment-form'))
        
        try {
            await fetch('/equipamentos', {
                method: 'POST',
                body: JSON.stringify({formData}),
                headers: { 'Content-Type': 'application/json' }
            })
        } catch (err) {
            console.error(err)
        }
    }
})
