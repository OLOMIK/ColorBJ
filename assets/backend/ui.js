console.log("załadowano ui.js");

// backend by gasnic https://github.com/OLOMIK
function showWindow1() {
    const container = document.getElementById('windowContainer');
    container.style.display = 'block';
}

function hideWindow1() {
    const container = document.getElementById('windowContainer');
    container.style.display = 'none';
}

function showWindow2() {
    const container = document.getElementById('windowContainer2');
    container.style.display = 'block';
}

function hideWindow2() {
    const container = document.getElementById('windowContainer2');
    container.style.display = 'none';
}

function showWindow3() {
    const container = document.getElementById('windowContainer3');
    container.style.display = 'block';
}

function hideWindow3() {
    const container = document.getElementById('windowContainer3');
    container.style.display = 'none';
}
function showWindow4() {
    const container = document.getElementById('windowContainer4');
    container.style.display = 'block';
}

function hideWindow4() {
    const container = document.getElementById('windowContainer4');
    container.style.display = 'none';
}

function showWindow5() {
    const container = document.getElementById('windowContainer5');
    container.style.display = 'block';
}

function hideWindow5() {
    const container = document.getElementById('windowContainer5');
    container.style.display = 'none';
}

function showWindow6() {
    const container = document.getElementById('windowContainer6');
    container.style.display = 'block';
}

function hideWindow6() {
    const container = document.getElementById('windowContainer6');
    container.style.display = 'none';
}

function showWindow7() {
    const container = document.getElementById('windowContainer7');
    container.style.display = 'block';
}

function hideWindow7() {
    const container = document.getElementById('windowContainer7');
    container.style.display = 'none';
}

function showWindow8() {
    const container = document.getElementById('windowContainer8');
    container.style.display = 'block';
}

function hideWindow8() {
    const container = document.getElementById('windowContainer8');
    container.style.display = 'none';
}

function showWindow9() {
    const container = document.getElementById('windowContainer9');
    container.style.display = 'block';
}

function hideWindow9() {
    const container = document.getElementById('windowContainer9');
    container.style.display = 'none';
}
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