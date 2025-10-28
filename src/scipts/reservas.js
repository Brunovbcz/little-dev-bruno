var equipmentsNames = []

const nameInput = document.querySelector('#name')
const eqInput = document.querySelector('.eq-list')
const dateInput = document.querySelector('#limit-date')
const obsInput = document.querySelector('#obs')

function loadReservations(reservations){
    const reservationsBackground = document.querySelector('.reservations-background')
    reservationsBackground.innerHTML = ''
    console.log(reservations)
    reservations.forEach(reserv => {
        reservationsBackground.innerHTML += `
            <div class="reservation-background">
                <div class="line1">
                    <img src="images/warning.png">
                    <button class="confirm-reservation">Confirmar</button>
                </div>
                <label class="title-label">Solicitante:</label>
                <label class="res-label" id="solicitante">aa</label>
                <label class="title-label">Equipamento:</label>
                <label class="res-label" id="equipamento">a</label>
                <label class="title-label">Data Inicial:</label>
                <label class="res-label" id="dateDevolucao">a</label>
                <label class="title-label">Data de Devolução:</label>
                <label class="res-label" id="sala">a</label>
                <label class="title-label">Observação</label>
                <label class="res-label" id="observacao">a</label>
            </div>
        `
    })
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

async function loadEquipments() {
    let equipments = await getEquipments()
    
    if (!equipments.equipamentosProntos) return
    equipments.equipamentosProntos.forEach((eq) => {
        let name = eq.nome
        let id = eq.id

        equipmentsNames.push({name, id})
    })
}

document.addEventListener('DOMContentLoaded', async (e) => {
    loadEquipments()
})

function toggleAddReservation() {
    const background = document.querySelector('.all-add-background')
    background.classList.toggle('visible')

    const datalist = document.querySelector('.eq-list')

    equipmentsNames.forEach((obj) => {
        const option = document.createElement('option')
        option.textContent = obj.name
        option.setAttribute('id', obj.id)
        datalist.appendChild(option)
    })
    console.log(equipmentsNames)
}

document.querySelector('.add-reservation-form').addEventListener('submit', async (e) => {
    e.preventDefault()
    
    let name = nameInput.value.trim()
    let optionVal = eqInput.options[eqInput.selectedIndex].text.trim()
    let initialDatetime = toMySqlDatetime(new Date())
    let finalDatetime = toMySqlDatetime(dateInput.value)
    let obs = obsInput.value.trim()
    console.log(initialDatetime, finalDatetime)
    if (!obs) obs = ''

    let id = eqInput.options[eqInput.selectedIndex].getAttribute('id')

    if (!name || optionVal === 'Selecione um equipamento' || !initialDatetime || !finalDatetime) {
        alert('Preencha os Campos')
        return
    } 
    
    try {
        const response = await fetch('/reservas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({name, id, initialDatetime, finalDatetime, obs})
        })

        const data = await response.json()

        if (response.ok && data.success) {
            console.log(data)
            loadReservations(data.result)
        }
    } catch (err) {
        console.error(err)
    }
})