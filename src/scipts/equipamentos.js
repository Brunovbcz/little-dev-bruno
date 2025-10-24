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

    if (document.querySelector('.line #name') || document.querySelector('.line #desc')) {
        document.querySelector('.line #name').value = ''
        document.querySelector('.line #desc').value = ''    
    }
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
            alert('Algo deu errado.')
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

    const formData = new FormData();

    formData.append('name', name) ;
    formData.append('desc', desc) ;

    let a = confirm('Você deseja aplicar as mudanças?');
    if (a) {

        if (desc.trim() === '' || name.trim() === '') {
            alert('Preencha os Campos');
            return;
        }
        let id = selectedEquipment.id

        try {
            
            await fetch(`http://localhost:8080/equipamentos/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({name, desc})
            });

            let data = await getEquipments()
            loadEquipments(data.equipamentosProntos)

            toggleEditMenu()

        } catch (error) {
            console.error('Erro ao editar o produto:', error);
        }

    } else toggleEditMenu(); return
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