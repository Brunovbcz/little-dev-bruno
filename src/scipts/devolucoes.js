const searchInput = document.querySelector('#search')

async function loadDevolucoes(returns) {
    const reservas = await getReservas()
    const equipamentos = await getEquipments()
    const retunrsBackground = document.querySelector('.returns-background')
    retunrsBackground.innerHTML = ''

    returns.forEach(r => {
        let nome_eq
        const reserva = reservas.find(res => res.id === r.id_reserva)
        const nome_solicitante = reserva ? reserva.nome_solicitante : 'Desconhecido'
        
        equipamentos.forEach(eq => {
            if (eq.id == r.id_equipamento) {
                nome_eq = eq.nome
            } 
        })
        console.log(nome_eq)
        
        retunrsBackground.innerHTML += `
        <div class="return-background">
            <label class="title-label">Solicitante:</label>
            <label class="res-label" id="solicitante">${stripHTMLTags(nome_solicitante)}</label>
            <label class="title-label">Equipamento:</label>
            <label class="res-label" id="eq">${stripHTMLTags(nome_eq)}</label>
            <label class="title-label">Devolutor:</label>
            <label class="res-label" id="devolutor">${stripHTMLTags(r.nome_devolutor)}</label>
            <label class="title-label">Data de Devolção:</label>
            <label class="res-label" id="data-devolucao">${toDatetime(r.data_devolucao)}</label>
            <label class="title-label">Condição:</label>
            <label class="res-label" id="cond">${stripHTMLTags(r.condicao)}</label>
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

async function getEquipments() {
    try {
        const response = await fetch('/equipamentos-data')
        const data = await response.json()

        if (response.ok && data.success) {
            return data.equipamentosProntos
        }
    } catch(err) {
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

searchInput.addEventListener('input', (e) => {
    const term = searchInput.value.toLowerCase()

    document.querySelectorAll('.return-background').forEach(ret => {
        let text = ret.innerText.toLowerCase()

        if(text.includes(term)) {
            ret.style.display = 'flex'
        } else {
            ret.style.display = 'none'
        }
    })
})