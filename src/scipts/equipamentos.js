function loadEquipments(data) {
    const equipmentsBackground = document.querySelector('.equipments-background')
    equipmentsBackground.innerHTML = ''

    data.equipamentosProntos.forEach((equipment) => {
        const eqBackground = document.createElement('div')
        const eqName = document.createElement('label')
        const img = document.createElement('img')
        const button = document.createElement('button')

        eqName.classList.add('eq-name')
        eqBackground.classList.add('eq-background')
        button.classList.add('edit-equipment-btn')

        eqName.textContent = equipment.nome
        img.src = equipment.src
        button.textContent = 'Editar'

        equipmentsBackground.appendChild(eqBackground)
        eqBackground.appendChild(eqName)
        eqBackground.appendChild(img)
        eqBackground.appendChild(button)

        button.addEventListener('click', () => {
            toggleEquipmentMenu('Editar')
        })
    })
}

// Função para abrir menu de adicionar equipamento
function toggleEquipmentMenu(str) {
    let background = document.querySelector('.all-background')
    background.classList.toggle('visible')
    background.querySelector('h2').textContent = str
}

document.addEventListener('DOMContentLoaded', async (e) => {
    try {
        const response = await fetch('/equipamentos-data')
        const data = await response.json()

        if (response.ok && data.success) {
            console.log(data)
            loadEquipments(data)
        }
    } catch(err) {
        console.error(err)
    }
})

// Verifica os input e envia p servidor
document.getElementById('forms').addEventListener('submit', async function(e) {
    e.preventDefault()
    let name = document.querySelector('#name').value
    let desc = document.querySelector('#desc').value
    let img = document.querySelector('#file-input')

    if (img === '' || desc === '' || name === '') {
        alert('Preencha os Campos')
        return;  
    } 

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
                loadEquipments(data)
            }
        } catch (err) {
            console.error(err)
        }
    }
    toggleEquipmentMenu('Adicionar')
})