var devolucoes = []

function loadDevolucoes(returns) {
    const retunrsBackground = document.querySelector('.returns-background')
    retunrsBackground.innerHTML = ''
    
    returns.forEach(r => {
        retunrsBackground.innerHTML += `
        <div class="return-background">
            <label class="title-label">Nome do Solicitante:</label>
            <label class="res-label" id="solicitante">sla</label>
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

document.addEventListener('DOMContentLoaded', async (e) => {
    devolucoes = await getDevolucoes()
    loadDevolucoes(devolucoes)
})