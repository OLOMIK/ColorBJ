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

document.addEventListener("DOMContentLoaded", function() {
    function loadStylesheet(href) {
        var link = document.createElement("link");
        link.rel = "stylesheet";
        link.type = "text/css";
        link.href = href;
        document.getElementsByTagName("head")[0].appendChild(link);
    }

    function unloadStylesheet(href) {
        var links = document.getElementsByTagName("link");
        for (var i = links.length - 1; i >= 0; i--) {
            if (links[i] && links[i].getAttribute("href") != null && links[i].getAttribute("href").indexOf(href) != -1) {
                links[i].parentNode.removeChild(links[i]);
            }
        }
    }

    function detectMobile() {
        return window.innerWidth <= 768;
    }

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

   
    updateStyles();

    
    window.addEventListener("resize", updateStyles);
});
function mobileGui(enabled) {
    if (enabled) {
        document.getElementById("navbardupa").style.display = "none";
        document.getElementById("guiMobilneButton").style.display = "flex";
    }
    else{
        document.getElementById("navbardupa").style.display = "block";
        document.getElementById("guiMobilneButton").style.display = "none";
    }
}