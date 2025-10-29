var equipmentsNames = []

const nameInput = document.querySelector('#name')
const eqInput = document.querySelector('.eq-list')
const dateInput = document.querySelector('#limit-date')
const obsInput = document.querySelector('#obs')

function confirmDevolucao(btn) {
    let a = confirm('Deseja confirmar a devolução? Essa ação não poderá ser desfeita')

    if (!a) {
        return
    } else {
        console.log('Já era, agr vai ter q aceitar, id:', btn.id)
    }
}
    
function loadReservations(reservations){
    const reservationsBackground = document.querySelector('.reservations-background')
    reservationsBackground.innerHTML = ''
    
    reservations.forEach(reserv => {
        if (reserv.observacao === '') reserv.observacao = 'Sem Observações'

        reservationsBackground.innerHTML += `
            <div class="reservation-background" id="${reserv.id}">
                <div class="line1">
                    <img class="alert-img" src="images/warning.png">
                        <div class="waring-msg">
                            <label>O prazo de devolução do equipamento expirou. Por favor, confirme se o solicitante já efetuou a devolução.</label>
                        </div>
                    <button class="confirm-reservation" id="${reserv.id}" onclick="confirmDevolucao(this)">Confirmar</button>
                </div>
                <label class="title-label">Solicitante:</label>
                <label class="res-label" id="solicitante">${reserv.nome_solicitante}</label>
                <label class="title-label">Equipamento:</label>
                <label class="res-label" id="equipamento">sla</label>
                <label class="title-label">Data Inicial:</label>
                <label class="res-label" id="initial-date">${toDatetime(reserv.datahora_reserva)}</label>
                <label class="title-label">Data de Devolução:</label>
                <label class="res-label" id="final-date">${toDatetime(reserv.datahora_devolucao)}</label>
                <label class="title-label">Observação:</label>
                <label class="res-label" id="observacao">${reserv.observacao}</label>
            </div>
        `
    })
}

function enableLine1(id) {
    document.querySelectorAll('.reservation-background').forEach(reservation => {
        if (reservation.querySelector('.line1').classList.contains('visible')) return

        if (reservation.id === String(id)) reservation.querySelector('.line1').classList.add('visible')
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

async function getReservations() {
    try {
        const response = await fetch('/reservas-data')
        const data = await response.json()

        if (response.ok && data.success) {
            return data.reservas
        }
    } catch (err) {
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

async function verifyExpiredReservations() {
    let reservations = await getReservations()
    
    reservations.forEach(re => {
        if (new Date().getTime() > new Date(re.datahora_devolucao).getTime()) {
            enableLine1(re.id)
        }
    })
}

// alterna o menu de add uma reserva
function toggleAddReservation() {
    const background = document.querySelector('.all-add-background')
    background.classList.toggle('visible')

    const datalist = document.querySelector('.eq-list')

    datalist.innerHTML = '<option>Selecione um equipamento</option>'

    equipmentsNames.forEach((obj) => {
        const option = document.createElement('option')
        option.textContent = obj.name
        option.setAttribute('id', obj.id)
        datalist.appendChild(option)
    })
    console.log(equipmentsNames)
}

document.addEventListener('DOMContentLoaded', async (e) => {
    loadEquipments()
    loadReservations(await getReservations())
    verifyExpiredReservations()
})

// verifica os input e envia p servidor fazer os baguio
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
    
    // trycath p negocio n parar se der ruim
    try {
        const response = await fetch('/reservas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({name, id, initialDatetime, finalDatetime, obs})
        })

        const data = await response.json()

        if (response.ok && data.success) {
            console.log(data)
            loadReservations(data.reservas)
            toggleAddReservation()
        }
    } catch (err) {
        console.error(err)
    }
})

// Verifica a cada 1s o q ta vencido la nas reserva
setInterval(async () => {
    verifyExpiredReservations()
}, 1000)