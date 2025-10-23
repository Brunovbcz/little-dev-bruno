var equipmentsNames = []

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
    
    equipments.equipamentosProntos.forEach((eq) => {
        equipmentsNames.push(eq.nome)
    })
})

function toggleAddReservation() {
    const background = document.querySelector('.all-add-background')
    background.classList.toggle('visible')
}

document.querySelector('.add-reservation-form').addEventListener('submit', (e) => {
    e.preventDefault()
    

})