var colors = { 
    cor_escura: '#111D4A',
    cor_primaria: '#192A6B',
    cor_secundaria: '#02428F',
    cor_fundo: '#A4A4A4',
    cor_laranja: '#E25A14',
    cor_borda: '#D0D0D0',
    fundo: 'white'
}

const theme = document.querySelector('#tema')

function wrapTheme() {
    if (theme.querySelector('.val').textContent === 'Claro') {
        colors.fundo = '#4e4e4eff'
        theme.querySelector('.val').textContent = 'Escuro'
    } else {
        colors.fundo = 'white'
        theme.querySelector('.val').textContent = 'Claro'
    }
    setSettings(colors)
}

theme.querySelector('#left').addEventListener('click', (e) => {
    wrapTheme()
})
theme.querySelector('#right').addEventListener('click', (e) => {
    wrapTheme()
})