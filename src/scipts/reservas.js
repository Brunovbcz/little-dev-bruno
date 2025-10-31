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
    
async function loadReservations(reservations){
    const reservationsBackground = document.querySelector('.reservations-background')
    reservationsBackground.innerHTML = ''
    const equipamentos = await getEquipments();

    const devolucoes = await getReturns();
    const reservas = await getReservations();

    if (!reservas || !devolucoes) return;
    const idsDevolvidos = devolucoes.map(dev => dev.id_reserva || dev.id);

    const reservasAtivas = reservas.filter(res => !idsDevolvidos.includes(res.id));

    
    reservasAtivas.forEach(reserv => {
        if (reserv.observacao === '') reserv.observacao = 'Sem Observações'
        
        const nome_equip = equipamentos.equipamentosProntos.filter(eq =>{
            return reserv.id_equipamento === eq.id
        });

        reservationsBackground.innerHTML += `
            <div class="reservation-background" id="${reserv.id}">
                <div class="line1">
                    <div class="waring-msg">
                        <label>O prazo de devolução do equipamento expirou. Por favor, confirme se o solicitante já efetuou a devolução.</label>
                    </div>
                    <img class="alert-img" src="images/warning.png">
                    <button class="confirm-reservation" id="${reserv.id}" onclick="toggleConfirmReservation(${reserv.id})">Confirmar</button>
                </div>
                <label class="title-label">Solicitante:</label>
                <label class="res-label" id="solicitante">${reserv.nome_solicitante}</label>
                <label class="title-label">Equipamento:</label>
                <label class="res-label" id="equipamento">${nome_equip[0].nome}</label>
                <label class="title-label">Data Inicial:</label>
                <label class="res-label" id="initial-date">${toDatetime(reserv.datahora_reserva)}</label>
                <label class="title-label">Data de Devolução:</label>
                <label class="res-label" id="final-date">${toDatetime(reserv.datahora_devolucao)}</label>
                <label class="title-label">Observação:</label>
                <label class="res-label" id="observacao">${reserv.observacao}</label>
            </div>
        `
    })

    // Hover na imagem p aparecer o alerta

    document.querySelectorAll('.alert-img').forEach(a => {
        a.addEventListener('mouseenter', (e) => {
            a.parentElement.querySelector('.waring-msg').classList.add('visible')
        })
        a.addEventListener('mouseleave', (e) => {
            a.parentElement.querySelector('.waring-msg').classList.remove('visible')
        })
    })
    
}

function enableLine1(id) {
    document.querySelectorAll('.reservation-background').forEach(reservation => {
        if (reservation.querySelector('.line1').querySelector('img').classList.contains('visible')) return

        if (reservation.id === String(id)) reservation.querySelector('.line1').querySelector('img').classList.add('visible')
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

async function getReturns() {
    try {
        const response = await fetch('/devolucoes-data')
        const data = await response.json()

        if (response.ok && data.success ) {
            return data.devolucoes
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
    const background = document.querySelector('#reservation-background')
    background.classList.toggle('visible')

    const datalist = document.querySelector('.eq-list')

    datalist.innerHTML = '<option>Selecione um equipamento</option>'

    equipmentsNames.forEach((obj) => {
        const option = document.createElement('option')
        option.textContent = obj.name
        option.setAttribute('id', obj.id)
        datalist.appendChild(option)
    })
}

async function toggleConfirmReservation(id) {
    const background = document.querySelector('#confirm-reservation-background')
    background.classList.toggle('visible')  
    background.querySelector('form').setAttribute('idd', id)

    const devolucoes = await getReturns();
    const reservas = await getReservations();

    if (!reservas || !devolucoes) return;
    const idsDevolvidos = devolucoes.map(dev => dev.id_reserva || dev.id);

    const reservasAtivas = reservas.filter(res => !idsDevolvidos.includes(res.id));

    await loadReservations(reservasAtivas);
    verifyExpiredReservations();
}

document.addEventListener('DOMContentLoaded', async () => {
    loadEquipments();
    const devolucoes = await getReturns();
    const reservas = await getReservations();

    if (!reservas || !devolucoes) return;
    const idsDevolvidos = devolucoes.map(dev => dev.id_reserva || dev.id);

    const reservasAtivas = reservas.filter(res => !idsDevolvidos.includes(res.id));

    await loadReservations(reservasAtivas);
    verifyExpiredReservations();
});

// verifica os input e envia p servidor fazer os baguio
document.querySelector('#add-form').addEventListener('submit', async (e) => {
    e.preventDefault()
    
    let name = nameInput.value.trim()
    let optionVal = eqInput.options[eqInput.selectedIndex].text.trim()
    let initialDatetime = toMySqlDatetime(new Date())
    let finalDatetime = toMySqlDatetime(dateInput.value)
    let obs = obsInput.value.trim()
    
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
            await loadReservations(data.reservas)
            toggleAddReservation()
        }
    } catch (err) {
        console.error(err)
    }
})

//Envia p servidor adicionar a devolução do equipamento
document.querySelector('#confirm-form').addEventListener('submit', async (e) => {
    e.preventDefault()

    let name = document.querySelector('#confirm-form').querySelector('#name').value.trim()
    let condicao = document.querySelector('#confirm-form').querySelector('#cond').value.trim()
    let dataDelo = toMySqlDatetime(new Date())

    let id = document.querySelector('#confirm-form').getAttribute('idd')

    if (!name || !condicao) {
        alert('Preencha os Campos')
        return
    }

    toggleConfirmReservation()

    //try catch p n da ruim no sistema
    try {
        await fetch('/devolucoes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({id, name, dataDelo, condicao})
        })

    } catch(err) {
        console.log(err)
    }
})

// Verifica a cada 1s o q ta vencido la nas reserva
setInterval(async () => {
    verifyExpiredReservations()
}, 1000)