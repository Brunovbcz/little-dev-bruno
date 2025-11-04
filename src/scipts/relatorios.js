const button = document.querySelector('.generate')
const search = document.querySelector('#search')

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

async function getReadyReservations() {
    const devolucoes = await getReturns()
    const reservas = await getReservations()

    let readyReservations = []

    devolucoes.forEach(dev => {
        reservas.forEach(res => {
            if (dev.id_reserva !== res.id) readyReservations.push(res)
        })
    });

    return readyReservations
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

async function getRelatorios() {
    try {
        const response = await fetch('/relatorios-data')
        const data = await response.json()

        if (response.ok && data.success ) {
            return data.relatorios
        }
    } catch (err) {
        console.error(err)
    }
}


async function loadRelatorios() {
    const relatorios = await getRelatorios()
    const background = document.querySelector('.relatorios-background')

    background.innerHTML = ''

    relatorios.forEach(rel => {
        background.innerHTML += `
            <div class="relatorio-background">
                <label class="date">${toDate(rel.data_relatorio)}</label>
                <button class="download-btn" id="${rel.id}">Baixar</button>
            </div>
        `
    })

    document.querySelectorAll('.download-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = btn.getAttribute('id')
            window.open(`/relatorios/${id}/download`, "_blank")
        })
    })
}

// Baixar pdf
button.addEventListener('click', async (e) => {
    const reservas = await getReadyReservations()
    const devolucoes = await getReturns()
    const equipamentos = await getEquipments()

    function getEquipName(id) {
        id = Number(id)
        const eq = equipamentos.find(e => Number(e.id) === id)
        return eq ? eq.nome_equipamento : "Indefinido"
    }

    async function getReserva(id) {
        let reservs = await getReservations()
        return reservs.find(r => r.id === id)
    }

    function isHoje(dateStr) {
        if (!dateStr) return false
        const d = new Date(dateStr)
        const hoje = new Date()

        return (
            d.getFullYear() === hoje.getFullYear() &&
            d.getMonth() === hoje.getMonth() &&
            d.getDate() === hoje.getDate()
        )
    }

    const emprestimos = reservas
        .filter(r => isHoje(r.datahora_reserva))
        .map(r => ({
            solicitante: r.nome_solicitante,
            equipamento: getEquipName(r.id_equipamento),
            dataInicial: toDatetime(r.datahora_reserva),
            dataDevolucao: toDatetime(r.datahora_devolucao),
            observacao: r.observacao
        }))

    const devolucoesPDF = await Promise.all(
    devolucoes
        .filter(dev => isHoje(dev.data_devolucao))
        .map(async dev => {
        const reservaLinkada = await getReserva(dev.id_reserva)
        console.log(reservaLinkada)
        return {
            solicitante: reservaLinkada.nome_solicitante,
            devolutor: dev.nome_devolutor,
            dataDevolucao: toDatetime(dev.data_devolucao),
            condicao: dev.condicao
        }
        })
    )

    const { jsPDF } = window.jspdf
    const doc = new jsPDF()

    doc.addImage("images/Logos - Sistema Fiep RGB_COR_SENAI.png", "PNG", 10, 10, 80, 21)

    doc.autoTable({
        startY: 60,
        head: [["Solicitante", "Equipamento", "Data Inicial", "Data de Devolução", "Observação"]],
        body: emprestimos.map(l => [
            l.solicitante,
            l.equipamento,
            l.dataInicial,
            l.dataDevolucao,
            l.observacao
        ])
    })

    let y = doc.lastAutoTable.finalY + 10

    doc.autoTable({
        startY: y,
        head: [["Solicitante", "Devolutor", "Data de Devolução", "Condição"]],
        body: devolucoesPDF.map(l => [
            l.solicitante,
            l.devolutor,
            l.dataDevolucao,
            l.condicao
        ])
    })

    const pdfBlob = doc.output("blob")

    const date = toMySqlDatetime(new Date())
    const file = new File([pdfBlob], `Relatorio_${Date.now()}.pdf`, { type: "application/pdf" })

    const formData = new FormData()
    formData.append("data", date)
    formData.append("file", file)

    try {
        const response = await fetch("/relatorios", {
            method: "POST",
            body: formData
        })

        const data = await response.json()

        if (response.ok && data.success) {
            loadRelatorios()
        }
    } catch (err) {
        console.error(err)
    }
})

document.addEventListener('DOMContentLoaded', (e) => {
    loadRelatorios()
})

search.addEventListener('input', (e) => {
    const term = search.value.toLowerCase()

    document.querySelectorAll('.relatorio-background').forEach(res => {
        let text = res.innerText.toLowerCase()

        if(text.includes(term)) {
            res.style.display = 'flex'
        } else {
            res.style.display = 'none'
        }
    })
})