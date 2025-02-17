function definePlugin(name, version, description, author){

}
function loadScript() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const scriptContent = e.target.result;
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.text = scriptContent;
            document.body.appendChild(script);
            Notification("Załadowano skrypt.", "success")
        };
        reader.readAsText(file);
    } else {
        Notification("Nie udało się załadować skryptu.", "error")
    }
}