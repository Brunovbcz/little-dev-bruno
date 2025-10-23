const eqCadastrados = document.querySelector('#eq-cadastrados')

document.addEventListener('DOMContentLoaded', async (e) => {
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
})