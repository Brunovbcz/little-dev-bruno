var equipments = []
let selectedEquipment = {}

// Carrega os equipamentos no frontend conforme a data recebida
function loadEquipments(equipamentosProntos) {

    const equipmentsBackground = document.querySelector('.equipments-background')
    equipmentsBackground.innerHTML = ''
    equipments = []

    equipamentosProntos.forEach((equipment) => {
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
    document.querySelector('.custom-button').textContent = 'Escolher Imagem'
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

    document.querySelector('.all-edit-background .custom-button').textContent = 'Escolher Imagem'
}

// Pega os equipamentos cadastrados no servidor
async function getEquipments() {
    try {
        const response = await fetch('/equipamentos-data')
        const data = await response.json()

        if (response.ok && data.success) {
            return data
        }
    } catch(err) {
        console.error(err)
    }
}

// Carregar equipamentos quando abrir a tela
document.addEventListener('DOMContentLoaded', async (e) => {
    let data = await getEquipments()
    loadEquipments(data.equipamentosProntos)
})

// Alterar nome do label quando carregar um arquivo
document.querySelector('#file-input').addEventListener('input', (e) => {
    const file = e.target.files[0]
    const button = document.querySelectorAll('.custom-button')

    button.forEach((btn) => {
        if (file) {
            btn.textContent = file.name
        } else {
            btn.textContent = 'Escolher Imagem'
        } 
    })
    
})

// Verifica os input e envia p servidor para ADICIONAR
document.getElementById('add-form').addEventListener('submit', async function(e) {
    e.preventDefault()

    const name = document.querySelector('.all-add-background #name').value.trim()
    const desc = document.querySelector('.all-add-background #desc').value.trim()
    const fileInput = document.querySelector('.all-add-background #file-input')

    // Verifica se campos obrigatórios foram preenchidos
    if (!name || !desc) {
        alert('Preencha os campos obrigatórios.')
        return
    }

    const formData = new FormData()
    formData.append('name', name)
    formData.append('desc', desc)

    // Só adiciona imagem se o usuário escolheu um arquivo
    if (fileInput.files.length > 0) {
        const file = fileInput.files[0]
        const allowedExtensions = ['jpeg', 'jpg', 'png', 'gif', 'bmp']
        const fileExtension = file.name.split('.').pop().toLowerCase()

        if (!allowedExtensions.includes(fileExtension)) {
            alert('Formato de imagem inválido.')
            return
        }

        formData.append('file-input', file)
    }

    try {
        const response = await fetch('/equipamentos', {
            method: 'POST',
            body: formData
        })

        const data = await response.json()

        if (response.ok && data.success) {
            loadEquipments(data.equipamentosProntos)
        } else {
            alert('Adicione uma imagem para o equipamento.')
        }
    } catch (err) {
        console.error('Erro:', err)
    }

    toggleAddMenu()
})


// Envia p servidor ATUALIZAR
document.querySelector('#edit-form').addEventListener('submit', async (e) => {
    e.preventDefault()

    let name = document.querySelector('.all-edit-background #name').value
    let desc = document.querySelector('.all-edit-background #desc').value
    let img = document.querySelector('.all-edit-background #file-input')
    
    newName = selectedEquipment.nome
    newDesc = selectedEquipment.descricao

    if (name !== newName || desc !== newDesc) {
        let a = confirm('Você deseja aplicar as mudanças?')
        if (a) {

            if (img === '' || desc === '' || name === '') {
                alert('Preencha os Campos')
                return;  
            } 
        
            let fileExtension_img = ['jpeg', 'jpg', 'png', 'gif', 'bmp']; 
            let fileExtension = img.value.split('.').pop().toLowerCase();
            
            if (fileExtension_img.indexOf(fileExtension)) {

                let formData = new FormData(document.querySelector('#edit-form'))
                formData.append('id', selectedEquipment.id)
                
                try {
                    const response = await fetch('/equipamentos', {
                        method: 'PUT',
                        body: formData,
                    })
                    const data = await response.json()
        
                    if (response.ok && data.success) {
                        toggleEditMenu()
                        loadEquipments(data.equipamentosProntos)
                    }
                } catch (err) {
                    console.error(err)
                }
            }

        } else toggleEditMenu(); return
    } else {
        toggleEditMenu()
        return
    }
})

// Envia para o servidor EXCLUIR
document.querySelector('#delete').addEventListener('click', async (e) => {
    e.preventDefault()

    let a = confirm('Você deseja excluir esse equipamento? 💻')
    if (!a) return

    const id = selectedEquipment.id
    
    try {
        const response = await fetch('/equipamentos', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        })
        const data = await response.json()

        if (response.ok && data.success) {
            const newData = await getEquipments()
            loadEquipments(newData.equipamentosProntos)
        }
    } catch (err) {
        console.error(err)
    }

    toggleEditMenu()
})