const NotificationType = {
    WARNING: "warning",
    ERROR: "error",
    SUCCESS: "success",
    DEFAULT: "default"
};

function hideWindow(number) {
    document.getElementById('windowContainer' + number).style.display = 'none';
}

function showWindow(number) {
    document.getElementById('windowContainer' + number).style.display = 'block';
}

const NOTIF_CONFIGS = {
    warning: {
        color: "#ffa500",
        svg: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="#ffa500" d="M2.725 21q-.275 0-.5-.137t-.35-.363t-.137-.488t.137-.512l9.25-16q.15-.25.388-.375T12 3t.488.125t.387.375l9.25 16q.15.25.138.513t-.138.487t-.35.363t-.5.137zM12 18q.425 0 .713-.288T13 17t-.288-.712T12 16t-.712.288T11 17t.288.713T12 18m0-3q.425 0 .713-.288T13 14v-3q0-.425-.288-.712T12 10t-.712.288T11 11v3q0 .425.288.713T12 15"/></svg>`
    },
    error: {
        color: "#ff0000",
        svg: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="#ff0000" d="M12 17q.425 0 .713-.288T13 16q0-.425-.288-.713T12 15q-.425 0-.713.288T11 16q0 .425.288.713T12 17Zm0 5q-2.075 0-3.9-.788t-3.175-2.137q-1.35-1.35-2.137-3.175T2 12q0-2.075.788-3.9t2.137-3.175q1.35-1.35 3.175-2.137T12 2q2.075 0 3.9.788t3.175 2.137q1.35 1.35 2.138 3.175T22 12q0 2.075-.788 3.9t-2.137 3.175q-1.35 1.35-3.175 2.138T12 22Zm0-9q.425 0 .713-.288T13 12V8q0-.425-.288-.713T12 7q-.425 0-.713.288T11 8v4q0 .425.288.713T12 13Z"/></svg>`
    },
    success: {
        color: "#00ff00",
        svg: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 1024 1024"><path fill="#00ff00" d="M512 64a448 448 0 1 1 0 896a448 448 0 0 1 0-896m-55.808 536.384l-99.52-99.584a38.4 38.4 0 1 0-54.336 54.336l126.72 126.72a38.27 38.27 0 0 0 54.336 0l262.4-262.464a38.4 38.4 0 1 0-54.272-54.336z"/></svg>`
    },
    default: {
        color: "#ffffff",
        svg: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="#fff" d="M12 17q.425 0 .713-.288T13 16v-4q0-.425-.288-.712T12 11q-.425 0-.712.288T11 12v4q0 .425.288.713T12 17m0-8q.425 0 .713-.288T13 8q0-.425-.288-.712T12 7q-.425 0-.712.288T11 8q0 .425.288.713T12 9m0 13q-2.075 0-3.9-.788t-3.175-2.137q-1.35-1.35-2.137-3.175T2 12q0-2.075.788-3.9t2.137-3.175q1.35-1.35 3.175-2.137T12 2q2.075 0 3.9.788t3.175 2.137q1.35 1.35 2.138 3.175T22 12q0 2.075-.788 3.9t-2.137 3.175q-1.35 1.35-3.175 2.138T12 22"/></svg>`
    }
};

function Notification(text, type) {
    const cfg = NOTIF_CONFIGS[type] || NOTIF_CONFIGS.default;
    const container = document.getElementById('rbContainer');
    document.getElementById('notifvalue').innerHTML = text;
    document.getElementById('svgContainer').innerHTML = cfg.svg;
    container.style.display = 'flex';
    container.style.color = cfg.color;
    setTimeout(() => { container.style.display = 'none'; }, 3000);
}

function sendError(message) {
    const container = document.getElementById('windowContainer18');
    document.getElementById('bladinfo').textContent = message;
    container.style.display = 'block';
}

function loadStylesheet(href) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = href;
    document.head.appendChild(link);
}

function unloadStylesheet(href) {
    document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
        if (link.getAttribute("href") && link.getAttribute("href").includes(href)) {
            link.remove();
        }
    });
}

function mobileGui(enabled) {
    document.getElementById("navbardupa").style.display = enabled ? "none" : "block";
    document.getElementById("guiMobilneButton").style.display = enabled ? "flex" : "none";
}

function dupaMato() {
    loadStylesheet("assets/styles/matostyle.css");
}

function initUI() {
    function detectMobile() { return window.innerWidth <= 768; }

    function updateStyles() {
        if (detectMobile()) {
            loadStylesheet("assets/styles/mobilestyle.css");
            mobileGui(true);
        } else {
            unloadStylesheet("assets/styles/mobilestyle.css");
            loadStylesheet("assets/styles/style.css");
            mobileGui(false);
        }
    }

    const markdownEl = document.getElementById("dupnydiv");
    if (markdownEl) {
        markdownEl.innerHTML = marked.parse(markdownEl.innerText);
    }

    updateStyles();
    window.addEventListener("resize", updateStyles);

    document.querySelectorAll('.tooltip').forEach(el => {
        el.addEventListener('mouseenter', function () {
            const rect = this.getBoundingClientRect();
            this.style.setProperty('--tooltip-top', `${rect.top + rect.height / 2}px`);
            this.style.setProperty('--tooltip-left', `${rect.right + 10}px`);
        });
    });
}

document.addEventListener('components-ready', initUI);
