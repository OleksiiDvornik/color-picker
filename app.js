const columns = document.querySelectorAll('.column');

document.addEventListener('keydown', event => {
    if (event.code.toLowerCase() === 'space') {
        event.preventDefault();
        setRandomColors();
    }
})

document.addEventListener('click', event => {
    const type = event.target.dataset.type;
    if (type === 'lock') {
        const element = event.target.tagName.toLowerCase() === 'i'
            ? event.target
            : event.target.children[0];
        element.classList.toggle('fa-lock-open'); 
        element.classList.toggle('fa-lock'); 
    } else if (type === 'copy') {
        copyToClipboard(event.target.textContent);
        event.target.classList.add('active');
        setTimeout(() => {
            event.target.classList.remove('active');
        }, 1200)
    }
})

function generateRandomColor() {
    const hexCodes = '0123456789ABCDEF';
    let color = '';
    for (let i = 0; i < 6; i++) {
        color += hexCodes[Math.floor(Math.random() * hexCodes.length)];
    }
    return `#${color}`;
}

function copyToClipboard(text) {
    return navigator.clipboard.writeText(text);
}

function setRandomColors(isInit) { 
    const colors = isInit ? getColorsFromHash() : [];
    
    columns.forEach((column, index) => {
        const isLocked = column.querySelector('i').classList.contains('fa-lock');
        const text = column.querySelector('h2');
        const button = column.querySelector('button');

        if (isLocked) {
            colors.push(text.textContent);
            return
        }

        const color = isInit 
            ? colors[index] 
                ? colors[index] 
                : generateRandomColor() 
            : generateRandomColor(); 

        if (!isInit) {   
            colors.push(color);
        }

        text.textContent = color;
        column.style.background = color;

        setTextColor(text, color);
        setTextColor(button, color);
        updateColorsHash(colors);
    })
}

function setTextColor(element, color) {
    const luminance = chroma(color).luminance();
    element.style.color = luminance > 0.5 ? 'black' : 'white';
}

function updateColorsHash(colors = []) {
    document.location.hash = colors.map(color => color.toString().substring(1)).join('-');
}

function getColorsFromHash() {
    if (document.location.hash.length > 1) {
       return document.location.hash.substring(1).split('-').map(color => `#${color}`);
    }
    return []
} 
 
setRandomColors(true);
