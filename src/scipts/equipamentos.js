var equipments = []
let selectedEquipment = {}

function loadEquipments(data) {
    const equipmentsBackground = document.querySelector('.equipments-background')
    equipmentsBackground.innerHTML = ''
    equipments = []

    data.equipamentosProntos.forEach((equipment) => {
        equipments.push(equipment) // Colocar em um "Cache" para uso dos dados

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
            selectedEquipment = equipment
            toggleEditMenu(equipment.nome, equipment.descricao)
        })
    })
}


// Função para alternar menu de adicionar equipamento
function toggleAddMenu() {
    const background = document.querySelector('.all-add-background')
    background.classList.toggle('visible')
}

// Função para alternar menu de editar equipamento
async function toggleEditMenu(name, desc) {
    const background = document.querySelector('.all-edit-background')
    background.classList.toggle('visible')
    
    if (!name && !desc) return

    const nameIn = background.querySelector('#name')
    const descIn = background.querySelector('#desc')

    nameIn.value = name
    descIn.value = desc
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

// Verifica os input e envia p servidor para ADICIONAR
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
    toggleAddMenu()
})

// Envia para o servidor EXCLUIR
document.querySelector('#delete').addEventListener('click', async (e) => {
    e.preventDefault()

    confirm('Você deseja excluir esse equipamento? 💻')

    const id = selectedEquipment.id
    
    try {
        const response = await fetch('/equipamentos', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        })
        const data = await response.json()

        if (response.ok && data.success) {
            loadEquipments(data)
        }
    } catch (err) {
        console.error(err)
    }

    toggleEditMenu()
})