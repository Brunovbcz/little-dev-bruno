document.addEventListener('DOMContentLoaded', (e) => {
    
})

// Verifica os inputs e envia pro servidor
document.getElementById('forms').addEventListener('submit', async function(e) {
    e.preventDefault()
    let name = document.querySelector('#name').value
    let desc = document.querySelector('#desc').value
    let img = document.querySelector('#file-input')

    if (img === '' || desc === '' || name === '') return

    let fileExtension_img = ['jpeg', 'jpg', 'png', 'gif', 'bmp']; 
    let fileExtension = img.value.split('.').pop().toLowerCase();
    
    if (fileExtension_img.indexOf(fileExtension)) {
        
        let formData = new FormData(this)

        try {
            const response = await fetch('/equipamentos', {
                method: 'POST',
                body: formData
            })
            const data = await response.json()

            if (response.ok && data.success) {
                console.log(data)
            }
        } catch (err) {
            console.error(err)
        }
    }
})

// Função para abrir menu de adicionar equipamento
function toggleEquipmentMenu() {
    let background = document.querySelector('.all-background')
    background.classList.toggle('visible')
}