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
  
    const devolucaoIds = new Set(devolucoes.map(dev => dev.id_reserva))
  
    const readyReservations = reservas.filter(res => !devolucaoIds.has(res.id))
  
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
    const a = confirm('Só é possivel gerar 1 relatório por dia, deseja continuar?')
    if (!a) return

    const relatorios = await getRelatorios()

    relatorios.forEach(rel => {
        console.log(toDate(rel.data_relatorio), toDate(new Date()))
        if (toDate(rel.data_relatorio) === toDate(new Date())) alert('Você já gerou um relatório hoje'); return
    })

    const allReservas = await getReservations()
    const devolucoes = await getReturns()
    const equipamentos = await getEquipments()

    function getEquipName(id) {
        const eq = equipamentos.find(e => e.id == id)
        return eq.nome
    }

    async function getReserva(id) {
        let reservs = await getReservations()
        return reservs.find(r => r.id === id)
    }

    async function getEquipamento(id) {
        let eqs = await getEquipments()
        return eqs.find(e => e.id === id)
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

    const emprestimos = allReservas
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
        const eqLinkado = await getEquipamento(dev.id_equipamento)
        console.log(reservaLinkada)
        return {
            solicitante: reservaLinkada.nome_solicitante,
            equipamento: eqLinkado.nome,
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
        head: [["Solicitante", "Equipamento", "Devolutor", "Data de Devolução", "Condição"]],
        body: devolucoesPDF.map(l => [
            l.solicitante,
            l.equipamento,
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