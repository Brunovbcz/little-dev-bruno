const eqCadastrados = document.querySelector('#eq-cadastrados')
const totalReservas = document.querySelector('#total-reservas')
const reservasExpiradas = document.querySelector('#reservas-expiradas')
const reservasDentroPrazo = document.querySelector('#reservas-dentro-prazo')
const totalDevolucoes = document.querySelector('#total-devolucoes')

var devolucoes = []

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

    // Devolucoes

    try {
        const response = await fetch('/devolucoes-data')
        const data = await response.json()

        if (response.ok && data.success ) {
            let counter = 0
            devolucoes = data.devolucoes

            data.devolucoes.forEach((d) => {
                counter++
            })

            totalDevolucoes.textContent = counter
        }
    } catch (err) {
        console.error(err)
    }

    // Reservas

    try {
        const response = await fetch('/reservas-data')
        const data = await response.json()

        if (response.ok && data.success) {
            let totalRes = 0
            let reservasAti = 0
            let reservasExp = 0

            const idsDevolvidos = devolucoes.map(dev => dev.id_reserva || dev.id);
            const reservasAtivas = data.reservas.filter(res => !idsDevolvidos.includes(res.id));

            reservasAtivas.forEach((r) => {
                totalRes++

                if (new Date().getTime() > new Date(r.datahora_devolucao).getTime()) {
                    reservasExp++  
                } else {
                    reservasAti++
                }
            })
            totalReservas.textContent = totalRes
            reservasExpiradas.textContent = reservasExp
            reservasDentroPrazo.textContent = reservasAti

        }
    } catch(err) {
        console.error(err)
    }
})