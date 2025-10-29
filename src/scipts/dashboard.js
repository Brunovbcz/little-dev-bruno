const eqCadastrados = document.querySelector('#eq-cadastrados')
const totalReservas = document.querySelector('#total-reservas')
const reservasExpiradas = document.querySelector('#reservas-expiradas')
const reservasDentroPrazo = document.querySelector('#reservas-dentro-prazo')

document.addEventListener('DOMContentLoaded', async (e) => {
    //Equipamentos

    try {
        const response = await fetch('/equipamentos-data')
        const data = await response.json()

        if (response.ok && data.success) {
            let counter = 0

            data.equipamentosProntos.forEach((e) => {
                counter++
            })
            eqCadastrados.textContent = counter
        }
    } catch(err) {
        console.error(err)
    }

    // Reservas

    try {
        const response = await fetch('/reservas-data')
        const data = await response.json()

        if (response.ok && data.success) {
            let counter = 0
            let c2 = 0
            let c3 = 0

            data.reservas.forEach((r) => {
                counter++

                if (new Date().getTime() > new Date(r.datahora_devolucao).getTime()) {
                    c2++  
                } else {
                    c3++
                }
            })
            totalReservas.textContent = counter
            reservasExpiradas.textContent = c2
            reservasDentroPrazo.textContent = c3

        }
    } catch(err) {
        console.error(err)
    }
})