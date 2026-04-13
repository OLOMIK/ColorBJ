async function loadComponent(id, path) {
    const res = await fetch(path);
    const html = await res.text();
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
}

function loadScript(src) {
    return new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = src;
        s.onload = resolve;
        s.onerror = reject;
        document.body.appendChild(s);
    });
}

async function loadAllComponents() {
    await Promise.all([
        loadComponent('app-welcome',      'assets/components/welcome.html'),
        loadComponent('app-loading',      'assets/components/loading.html'),
        loadComponent('app-editor',       'assets/components/editor.html'),
        loadComponent('app-notification', 'assets/components/notification.html'),
        loadComponent('app-modals',       'assets/components/modals.html'),
    ]);

    await loadScript('assets/js/CanvasController.js');
    await loadScript('assets/js/ui.js');

    document.dispatchEvent(new Event('components-ready'));
}

loadAllComponents();
