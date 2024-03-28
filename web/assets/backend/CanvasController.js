// backend by gasnic https://github.com/OLOMIK

window.onload = setupCanvas;

var painting = false;
var kolor = "#5e5e5e";
var canvas, ctx;
var canvasWidth = 1400;
var canvasHeight = 840;
var blockSize = 5; 
var currentBackgroundColor = "#111111"; 
var rubberMode = false;

document.getElementById("wyb").addEventListener('change', function() {
    ustawkolor(this.value);
});

function setupCanvas() {
    canvas = document.getElementById('niepaintCanvas');
    if (canvas) {
        ctx = canvas.getContext('2d');

        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

       
        ctx.fillStyle = currentBackgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        canvas.addEventListener('mousedown', startPainting);
        canvas.addEventListener('mousemove', paint);
        canvas.addEventListener('mouseup', stopPainting);
        canvas.addEventListener('mouseleave', stopPainting);

        canvas.addEventListener('touchstart', startPainting, {passive: false});
        canvas.addEventListener('touchmove', touchPaint, {passive: false});
        canvas.addEventListener('touchend', stopPainting, {passive: false});
    } else {
        console.error('Nie znaleziono elementu canvas!');
    }
}
function ustawkolor(color){
    if(color == '#000000'){
        kolor = '#5e5e5e'
    }else{
        kolor = color;
        painting = false;
    }
    
}
function startPainting(event) {
    painting = true;
    paint(event);
}

function stopPainting() {
    painting = false;
}

function paint(event) {
    if (!painting) return;

    var x = event.pageX - canvas.offsetLeft;
    var y = event.pageY - canvas.offsetTop;

    if (event.touches) {
        x = event.touches[0].pageX - canvas.offsetLeft;
        y = event.touches[0].pageY - canvas.offsetTop;
    }
    if(rubberMode) {
        ctx.fillStyle = currentBackgroundColor 
        ctx.fillRect(x, y, blockSize, blockSize);
    }else{
        ctx.fillStyle = kolor;
        ctx.fillRect(x, y, blockSize, blockSize);
    }
    


}

function touchPaint(e) {
    e.preventDefault();
    paint(e);
}

function toggleRubberMode() {
    rubberMode = !rubberMode;
    
}
function disableRubberMode() {
    rubberMode = false;
    
    
}
function fillSzachownica() {
    kolor = document.getElementById("colorSel").value;
    var canvas = document.getElementById("niepaintCanvas");
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = kolor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const container = document.getElementById('windowContainer5');
    container.style.display = 'none';
    painting = false;
}
function clearSzachownica() {
    var canvas = document.getElementById("niepaintCanvas");
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = currentBackgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const container = document.getElementById('windowContainer4');
    container.style.display = 'none';
}

function saveImage() {
   var filename = document.getElementById('filenameInput').value.trim();
   var canvas = document.getElementById("niepaintCanvas");
   var link = document.createElement('a');
   link.download = filename;  
   link.href = canvas.toDataURL();
   link.click();
}


  
function openImage(event) {
    var input = event.target;
    var reader = new FileReader();
    reader.onload = function() {
        var dataURL = reader.result;
        var image = new Image();
        image.onload = function() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        };
        image.src = dataURL;
    };
    reader.readAsDataURL(input.files[0]);
}   
function drawTextOnCanvas(text, x, y, font, color) {
    const canvas = document.getElementById('niepaintCanvas');
    const ctx = canvas.getContext('2d');
    
    ctx.font = font || 'Arial';
    ctx.fillStyle = color || 'black';
    ctx.fillText(text, x, y);
}
    

function dupkadupeczka(){
    
    drawTextOnCanvas(document.getElementById("tekscior").value, document.getElementById("posx").value, document.getElementById("posy").value, document.getElementById("rozmiar").value + "px " + document.getElementById("fontname").value , document.getElementById("kolor").value)
    const container = document.getElementById('windowContainer7');
    container.style.display = 'block';
}