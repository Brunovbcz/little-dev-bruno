// Quando o botão de menu é clicado 🖱️
function menuButton() {
    let sideBar = document.querySelector('aside');
    let menusBackground = document.querySelector('.menus-background');
    let title = document.querySelector('#title');
    let menuBtn = document.querySelector('#menu-btn')
    let textLabel = document.querySelectorAll('#text-label')
    let background = document.querySelector('.background')

    if (title) title.classList.toggle('open')
    if (sideBar) sideBar.classList.toggle('open')
    if (menusBackground) menusBackground.classList.toggle('open')
    if (menuBtn) menuBtn.classList.toggle('open')
    if (background) background.classList.toggle('open')
    if (textLabel) textLabel.forEach(function(t) {t.classList.toggle('open')})
}

function toMySqlDatetime(dateString) {
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function toDatetime(dateString) {
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}`;
}

function toDate(dateString) {
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${day}/${month}/${year}`;
}

function setSettings(colors) {
    localStorage.setItem('colors', JSON.stringify(colors))
}

function loadSettings() {
    let colors = JSON.parse(localStorage.getItem('colors'))
    
    if (!colors) return
    
    for (const key in colors) {
        if (colors.hasOwnProperty(key)) {
            const cssVarName = `--${key.replace(/_/g, '-')}`;
            document.documentElement.style.setProperty(cssVarName, colors[key]);
        }
    }

    if (document.querySelector('#tema')) {
        if (document.querySelector('#tema').querySelector('.val')) {
            document.querySelector('#tema').querySelector('.val').textContent = colors.text
        }
    }
    
    if (document.querySelector('#dalt-mode')) {
        if (document.querySelector('#dalt-mode').querySelector('.val')) {
            document.querySelector('#dalt-mode').querySelector('.val').textContent = colors.dalt_text
        }
    }

    if (colors.menu_icon) {
        document.querySelector('#menu-btn').classList.add('dark')
        document.querySelectorAll('.menu-icon').forEach(m => {
            m.classList.add('dark')  
        })

        document.querySelector('footer').querySelector('img').src = 'images/Logos - Sistema Fiep RGB_BRANCO_SENAI.png'
    } else {
        document.querySelector('#menu-btn').classList.remove('dark')
        document.querySelectorAll('.menu-icon').forEach(m => {
            m.classList.remove('dark')  
        })

        document.querySelector('footer').querySelector('img').src = 'images/Logos - Sistema Fiep RGB_COR_SENAI.png'
    }
}

function stripHTMLTags(string) {
    const parseHTML = new DOMParser().parseFromString(string, 'text/html')
    return parseHTML.body.textContent || '';
}

loadSettings()