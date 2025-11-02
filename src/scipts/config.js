const theme = document.querySelector('#tema')
const dalt = document.querySelector('#dalt-mode')

var colors = { 
    cor_escura: '#111D4A',
    cor_primaria: '#192A6B',
    cor_secundaria: '#02428F',
    cor_fundo: '#A4A4A4',
    cor_laranja: '#E25A14',
    cor_borda: '#D0D0D0',
    fundo: 'white',
    text: 'Claro',
    dalt_text: 'Desligado'
}

var darkTheme = {
    cor_escura: '#111D4A',
    cor_primaria: '#111D4A',
    cor_secundaria: 'white',
    cor_fundo: '#7a7a7aff',
    cor_laranja: '#E25A14',
    cor_borda: '#D0D0D0',
    fundo: 'rgb(31,31,31)',
    text: 'Escuro',
    menu_icon: 'dark',
    dalt_text: 'Desligado'
}

var deutanDefault =  {
    cor_escura:     '#001E49',
    cor_primaria:   '#002C6A',
    cor_secundaria: '#003F8E',
    cor_fundo:      '#A4A4A4',
    cor_laranja:    '#A39107',
    cor_borda:      '#D0D0D0',
    fundo:          '#FFFFFF',
    text: 'Claro',
    dalt_text: 'Ligado'
}

var deutanDark = {
    cor_escura:     '#001E49',
    cor_primaria:   '#001E49',
    cor_secundaria: '#FFFFFF',
    cor_fundo:      '#7A7A7A',
    cor_laranja:    '#A39107',
    cor_borda:      '#D0D0D0',
    fundo:          '#1F1F1F',
    text: 'Escuro',
    menu_icon: 'dark',
    dalt_text: 'Ligado'
}

let temaClaro
let daltonismo

document.addEventListener('DOMContentLoaded', (e) => {
    if (theme.querySelector('.val').textContent === 'Claro') {
        temaClaro = true
    } else {
        temaClaro = false
    }

    if (dalt.querySelector('.val').textContent === 'Desligado') {
        daltonismo = false
    } else {
        daltonismo = true
    }
})


function wrapTheme() {
    if (temaClaro) {
        theme.querySelector('.val').textContent = 'Escuro'
        temaClaro = false

        if (daltonismo) {
            setSettings(deutanDark)
        } else {
            setSettings(darkTheme)
        }
       
    } else {
        theme.querySelector('.val').textContent = 'Claro'
        temaClaro = true
        
        if (daltonismo) {
            setSettings(deutanDefault)
        } else {
            setSettings(colors)
        }
    }
    loadSettings()
}

function wrapColorBlindness() {
    if (!daltonismo) {
        dalt.querySelector('.val').textContent = 'Ligado'
        daltonismo = true

        if (temaClaro) {
            setSettings(deutanDefault) 
        } else {
            setSettings(deutanDark)
        }
    } else {
        dalt.querySelector('.val').textContent = 'Desligado'
        daltonismo = false

        if (temaClaro) {
            setSettings(colors) 
        } else {
            setSettings(darkTheme)
        }
    }

    loadSettings()
}

// Color blindness
dalt.querySelector('#left').addEventListener('click', (e) => {
    wrapColorBlindness()
})
dalt.querySelector('#right').addEventListener('click', (e) => {
    wrapColorBlindness()
})

// Theme
theme.querySelector('#left').addEventListener('click', (e) => {
    wrapTheme()
})
theme.querySelector('#right').addEventListener('click', (e) => {
    wrapTheme()
})