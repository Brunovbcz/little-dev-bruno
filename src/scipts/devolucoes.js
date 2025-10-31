async function loadDevolucoes(returns) {
    const reservas = await getReservas()
    const retunrsBackground = document.querySelector('.returns-background')
    retunrsBackground.innerHTML = ''

    returns.forEach(r => {
        const reserva = reservas.find(res => res.id === r.id_reserva)
        const nome_solicitante = reserva ? reserva.nome_solicitante : 'Desconhecido'
        
        retunrsBackground.innerHTML += `
        <div class="return-background">
            <label class="title-label">Nome do Solicitante:</label>
            <label class="res-label" id="solicitante">${nome_solicitante}</label>
            <label class="title-label">Nome do Devolutor:</label>
            <label class="res-label" id="devolutor">${r.nome_devolutor}</label>
            <label class="title-label">Data de Devolção:</label>
            <label class="res-label" id="data-devolucao">${toDatetime(r.data_devolucao)}</label>
            <label class="title-label">Condição:</label>
            <label class="res-label" id="cond">${r.condicao}</label>
        </div>
        `
    })
}

async function getDevolucoes() {
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

async function getReservas() {
    try {
        const response = await fetch('/reservas-data')
        const data = await response.json()

        if (response.ok && data.success ) {
            return data.reservas
        }
    } catch (err) {
        console.error(err)
    }
}

document.addEventListener('DOMContentLoaded', async (e) => {
    loadDevolucoes(await getDevolucoes())
})