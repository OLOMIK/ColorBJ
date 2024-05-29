console.log("załadowano ui.js");

// backend by gasnic https://github.com/OLOMIK
function hideWindow(number) {
    const container = document.getElementById('windowContainer'+number);
    container.style.display = 'none';
}
function showWindow(number) {
    const container = document.getElementById('windowContainer'+number);
    container.style.display = 'block';

}
async function Notification(text){
    const container = document.getElementById('rbContainer');
    let zapistekstu = document.getElementById('notifvalue');
    zapistekstu.innerHTML=text;
    container.style.display='block'
    setTimeout(function(){container.style.display='none'}, 3000)
}
function sendError(message){
    const container = document.getElementById('windowContainer18');
    container.style.display = 'block';
    container.innerHTML = message;
}
