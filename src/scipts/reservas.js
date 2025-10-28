var equipmentsNames = []

const nameInput = document.querySelector('#name')
const eqInput = document.querySelector('.eq-list')
const dateInput = document.querySelector('#limit-date')
const obsInput = document.querySelector('#obs')

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

document.addEventListener('DOMContentLoaded', async (e) => {
    let equipments = await getEquipments()
    
    if (!equipments.equipamentosProntos) return
    equipments.equipamentosProntos.forEach((eq) => {
        equipmentsNames.push(eq.nome)
    })
})


function toggleAddReservation() {
    const background = document.querySelector('.all-add-background')
    background.classList.toggle('visible')

    const datalist = document.querySelector('.eq-list')

    equipmentsNames.forEach(name => {
        const option = document.createElement('option')
        option.textContent = name
        datalist.appendChild(option)
    })
}

document.querySelector('.add-reservation-form').addEventListener('submit', (e) => {
    e.preventDefault()
    
    let nameVal = nameInput.value
    let optionVal = eqInput.options[eqInput.selectedIndex].text
    let date = new Date()
    let finalDate = dateInput.value
    let obsVal = obsInput.value

    console.log(nameVal, optionVal, date, finalDate, obsVal)
})