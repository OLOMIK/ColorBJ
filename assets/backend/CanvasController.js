console.log("załadowano backend");

var canvas, ctx;
var painting = false;
var rubberMode = false;
var blockSize = 5;
var currentBackgroundColor = "#111111";
var kolor = "#5e5e5e";
var posListening = false;
var pastePosListening = false;
var shapePosListening = false;
var pastePosY;
var pastePosX;
var offscreenCanvas = document.createElement('canvas');
var offscreenCtx = offscreenCanvas.getContext('2d');
var points = [];
var ulepszanieLinii = false;
var disabled = false;

function togglePoprawianieLinii() {
    var walucja = document.getElementById("liniepoprawianedupnie").checked;
    console.log("" + walucja);
    ulepszanieLinii = walucja;
    Notification("Ustawiono poprawianie linii");
}

function setCanvasSize() {
    offscreenCanvas.width = canvas.width;
    offscreenCanvas.height = canvas.height;
    offscreenCtx.drawImage(canvas, 0, 0);

  
    var canvasWidth = window.innerWidth < 768 ? window.innerWidth - 70 : 1200;
    var canvasHeight = window.innerHeight < 768 ? window.innerHeight - 100 : 800;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

   
    ctx.fillStyle = currentBackgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(offscreenCanvas, 0, 0, offscreenCanvas.width, offscreenCanvas.height, 0, 0, canvas.width, canvas.height);
}
function updateCursor() {
    const kanwasik = document.getElementById("niepaintCanvas");
    
    if(disabled){
        kanwasik.style.cursor = "cross";
        return;
    }else{
        const cursorCanvas = document.createElement('canvas');
        cursorCanvas.width = blockSize * 2;
        cursorCanvas.height = blockSize * 2;
        const cursorCtx = cursorCanvas.getContext('2d');
    
        cursorCtx.beginPath();
        cursorCtx.arc(blockSize, blockSize, blockSize, 0, Math.PI * 2);
        cursorCtx.fillStyle = kolor;
        cursorCtx.fill();
    
        const dataURL = cursorCanvas.toDataURL();
        canvas.style.cursor = `url(${dataURL}) ${blockSize} ${blockSize}, auto`;
    }

}   
function customCanvasSize() {
    offscreenCanvas.width = canvas.width;
    offscreenCanvas.height = canvas.height;
    offscreenCtx.drawImage(canvas, 0, 0);

    canvas.width = document.getElementById("dlugoscinput").value;
    canvas.height = document.getElementById("szerokoscinput").value;
    ctx.fillStyle = currentBackgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.drawImage(offscreenCanvas, 0, 0, offscreenCanvas.width, offscreenCanvas.height, 0, 0, canvas.width, canvas.height);
    Notification("Zmieniono rozmiary pola roboczego.");
}


function customSize2(w, h) {
    offscreenCanvas.width = canvas.width;
    offscreenCanvas.height = canvas.height;
    offscreenCtx.drawImage(canvas, 0, 0);

    canvas.width = w;
    canvas.height = h;
    ctx.fillStyle = currentBackgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.drawImage(offscreenCanvas, 0, 0, offscreenCanvas.width, offscreenCanvas.height, 0, 0, canvas.width, canvas.height);
}

function setBlockSize(size) {
    blockSize = size;
    updateCursor();
}

document.getElementById("wyb").addEventListener('change', function() {
    ustawkolor(this.value);
});


function setupCanvas() {
    canvas = document.getElementById('niepaintCanvas');
    if (!canvas) {
        console.error('Nie znaleziono elementu canvas!');
        return;
    }
    ctx = canvas.getContext('2d');
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);
    canvas.addEventListener('mousedown', startPainting);
    canvas.addEventListener('mousemove', paint);
    canvas.addEventListener('mouseup', stopPainting);
    canvas.addEventListener('mouseleave', stopPainting);
    canvas.addEventListener('touchstart', startPainting, { passive: false });
    canvas.addEventListener('touchmove', touchPaint, { passive: false });
    canvas.addEventListener('touchend', stopPainting, { passive: false });
    updateCursor();
}

function ustawkolor(color) {
    kolor = color == '#000000' ? '#5e5e5e' : color;
    painting = false;
    updateCursor();
}

function startPainting(event) {
    if(disabled){
        document.style.cursor = "cross";
        
    }else{
        painting = true;
        [lastX, lastY] = getMousePos(event);
        paint(event);
    }

    
}
function stopPainting() {
    
    if(ulepszanieLinii)
        {
        if (!painting) return;
        painting = false;
    
        if (points.length > 1) {
            const simplifiedPoints = simplifyLine(points, 2);
    
            offscreenCanvas.width = canvas.width;
            offscreenCanvas.height = canvas.height;
            offscreenCtx.drawImage(canvas, 0, 0);
    
    
            ctx.strokeStyle = rubberMode ? currentBackgroundColor : kolor;
            ctx.lineWidth = blockSize;
            ctx.lineCap = 'round';
    
            ctx.beginPath();
            ctx.moveTo(simplifiedPoints[0][0], simplifiedPoints[0][1]);
            for (let i = 1; i < simplifiedPoints.length; i++) {
                ctx.lineTo(simplifiedPoints[i][0], simplifiedPoints[i][1]);
            }
            ctx.stroke();
    
            
            offscreenCtx.drawImage(canvas, 0, 0);
        }
    
        points = [];
    }
    else
    {
        painting = false;
    }
    updateCursor();
}





function paint(event) {
    if(disabled){
        return;
    }
    else{
        if (!painting) return;
        if(ulepszanieLinii){
            var [x, y] = getMousePos(event);
            points.push([x, y]);
        
            ctx.strokeStyle = rubberMode ? currentBackgroundColor : kolor;
            ctx.lineWidth = blockSize;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(lastX, lastY);
            ctx.lineTo(x, y);
            ctx.stroke();
            [lastX, lastY] = [x, y];
        }
        else {
            
    
            var [x, y] = getMousePos(event);
        
            ctx.strokeStyle = rubberMode ? currentBackgroundColor : kolor;
            ctx.lineWidth = blockSize;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(lastX, lastY);
            ctx.lineTo(x, y);
            ctx.stroke();
            [lastX, lastY] = [x, y];
        }
    }

    



}



function touchPaint(e) {
    e.preventDefault();
    paint(e.touches[0]);
}

function toggleRubberMode() {
    rubberMode = !rubberMode;
    Notification("Przełączono tryb gumki.");
}

function disableRubberMode() {
    rubberMode = false;
}
function getMousePos(event) {
    var x, y;
    if (event.touches) {
        x = event.touches[0].pageX - canvas.offsetLeft;
        y = event.touches[0].pageY - canvas.offsetTop;
    } else {
        x = event.pageX - canvas.offsetLeft;
        y = event.pageY - canvas.offsetTop;
    }
    return [x, y];
}
function fillSzachownica() {
    
    var kolorInput = document.getElementById("colorSel").value;
    ustawkolor(kolorInput);
    ctx.fillStyle = kolorInput;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    document.getElementById('windowContainer5').style.display = 'none';
    ustawkolor('#5e5e5e');
    Notification("Wypełniono pole robocze nowym kolorem.", "success");
}

function clearSzachownica() {
    ctx.fillStyle = currentBackgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    document.getElementById('windowContainer4').style.display = 'none';
    Notification("Wyczyszczono pole robocze.", "success");
}

function saveImage() {
    var filename = document.getElementById('filenameInput').value.trim();
    var link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL();
    link.click();
    Notification("Zapisano obraz.", "success");
}

function openImage(event) {
    var input = event.target;
    var reader = new FileReader();
    reader.onload = function() {
        var dataURL = reader.result;
        var image = new Image();
        image.onload = function() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            customSize2(image.width, image.height);
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        };
        image.src = dataURL;
        Notification("Otwarto nowy obraz.");
    };
    reader.readAsDataURL(input.files[0]);
}

function drawTextOnCanvas(text, x, y, font, color) {
    ctx.font = font || 'Arial';
    ctx.fillStyle = color || 'black';
    ctx.fillText(text, x, y);
}

document.getElementById('applyColors').addEventListener('click', function() {
    var rValue = document.getElementById('rvalue').value;
    var gValue = document.getElementById('gvalue').value;
    var bValue = document.getElementById('bvalue').value;
    var gammaValue = document.getElementById('gammaValue').value;

    var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var data = imageData.data;

    for (var i = 0; i < data.length; i += 4) {
        data[i] = 255 * Math.pow((data[i] / 255) + parseInt(rValue) / 255, 1 / gammaValue);
        data[i + 1] = 255 * Math.pow((data[i + 1] / 255) + parseInt(gValue) / 255, 1 / gammaValue);
        data[i + 2] = 255 * Math.pow((data[i + 2] / 255) + parseInt(bValue) / 255, 1 / gammaValue);
    }

    ctx.putImageData(imageData, 0, 0);
    Notification("Zmieniono kolory obrazu.")
});

function dupkadupeczka() {
    drawTextOnCanvas(document.getElementById("tekscior").value, document.getElementById("posx").value, document.getElementById("posy").value, document.getElementById("rozmiar").value + "px " + document.getElementById("fontname").value, document.getElementById("kolor").value);
    document.getElementById('windowContainer7').style.display = 'block';
    Notification("Dodano nowy tekst do pola roboczego.")
}

function setupDragAndDrop() {
    const dropArea = document.getElementById('niepaintCanvas');

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, unhighlight, false);
    });

    function highlight(e) {
        dropArea.classList.add('highlight');
    }

    function unhighlight(e) {
        dropArea.classList.remove('highlight');
    }

    dropArea.addEventListener('drop', handleDrop, false);

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files);
    }

    function handleFiles(files) {
        ([...files]).forEach(uploadFile);
    }

    function uploadFile(file) {
        const reader = new FileReader();
        reader.onload = (function(theFile) {
            return function(e) {
                const img = new Image();
                img.onload = function() {
                    const ctx = dropArea.getContext('2d');
                    ctx.clearRect(0, 0, dropArea.width, dropArea.height);
                    ctx.drawImage(img, 0, 0, dropArea.width, dropArea.height);

                };
                img.src = e.target.result;
                Notification("Załadowano plik na canvas.");
            };
        })(file);

        reader.readAsDataURL(file);
    }
}

function dupa() {
    posListening = true;
}
function startPastePosSelecting(){
    pastePosListening = true;
}
function startShapePosSelecting(){
    shapePosListening = true;
}

document.getElementById('niepaintCanvas').onclick = function(e) {
    if (posListening) {
        disabled = true;
        updateCursor();
        var rect = e.target.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        document.getElementById("posx").value = x;
        document.getElementById("posy").value = y;
        posListening = false;
        const container = document.getElementById('windowContainer7');
        container.style.display = 'block';
        disabled = false;
        updateCursor();
    }
    if (pastePosListening) {
        disabled = true;
        updateCursor();
        const container = document.getElementById('windowContainer20');
        var rect = e.target.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        document.getElementById("posxx").value = x;
        document.getElementById("posyy").value = y;
        pastePosListening = false;
        container.style.display = 'block';
        disabled = false;
        updateCursor();
    }
    if (shapePosListening) {
        disabled = true;
        updateCursor();
        const container = document.getElementById('windowContainer26');
        var rect = e.target.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        document.getElementById("xxx").value = x;
        document.getElementById("yyy").value = y;
        shapePosListening = false;
        container.style.display = 'block';
        disabled = false;
        updateCursor();
    }
}


async function removeBackground() {
    const canvas = document.getElementById('niepaintCanvas');
    const ctx = canvas.getContext('2d');
    const imageBase64 = canvas.toDataURL('image/png').split(',')[1]; 

    const apiKey = 'SG_83a74bc3458a84da';
    const url = 'https://api.segmind.com/v1/bg-removal';

    const data = {
        image: imageBase64,
        method: 'object'
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }

        const blob = await response.blob();
        const urlObject = URL.createObjectURL(blob);

        const resultImage = new Image();
        resultImage.onload = function() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(resultImage, 0, 0, canvas.width, canvas.height);
            URL.revokeObjectURL(urlObject); 
        };
        resultImage.src = urlObject;
        Notification("Usunięto tło z obrazu.");
    } catch (error) {
        const container = document.getElementById('windowContainer18');
        container.style.display = 'block';
        container.innerHTML = "Błąd komunikacji z API usuwania tła. Spróbuj ponownie później."
    }
}
function dataURItoBlob(dataURI) {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
}
async function sendOpinion(){
    let content = document.getElementById("trescinput").value.replace(" ", "+");
    let email = document.getElementById("emailinput").value.replace(" ", "+");
    try{
        let url = `http://site30133.web1.titanaxe.com/addopinion.php?opinia=${content}&email=${email}`;
        console.log(url);
        await fetch(url, { method: 'GET' });
        Notification("Wysłano opinię.", "success");
    } catch (error) {
        const container = document.getElementById('windowContainer18');
        container.style.display = 'block';
        container.innerHTML = "Nie udało się wysłać opinii, bardzo możliwe, że jesteś offline, lub wsparcie dla twojej wersji ColorBJ zostało zakończone.";
    }
}
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('niepaintCanvas');
    const ctx = canvas.getContext('2d');

    document.addEventListener('paste', async (event) => {
        const items = event.clipboardData.items;
        for (const item of items) {
            if (item.type.startsWith('image/')) {
                const blob = item.getAsFile();
                pastedImage = await blobToImage(blob);
                showWindow(20);
            }
        }
    });
    
    document.addEventListener('copy', async (event) => {
        const items = event.clipboardData.items;
        for (const item of items) {
            if (item.type.startsWith('image/')) {
                const blob = item.getAsFile();
                pastedImage = await blobToImage(blob);
                showWindow(20);
            }
        }
    });

    function blobToImage(blob) {
        return new Promise((resolve, reject) => {
            const url = URL.createObjectURL(blob);
            const img = new Image();
            img.onload = () => {
                URL.revokeObjectURL(url);
                resolve(img);
            };
            img.onerror = (err) => {
                URL.revokeObjectURL(url);
                reject(err);
            };
            img.src = url;
        });
    }
    document.addEventListener('keydown', function(event) {
        if (event.ctrlKey && event.key === 'c') {
            copyCanvasToClipboard();
        }
        if (event.ctrlKey && event.key === 'p') {
            event.preventDefault();
            printCanvas();
        }
    });
    
    function copyCanvasToClipboard() {
        canvas.toBlob(blob => {
            const item = new ClipboardItem({ 'image/png': blob });
            navigator.clipboard.write([item]).then(() => {
                Notification("Skopiowano zawartość canvasa do schowka.");
            }).catch(err => {
                sendError("Nie udało się skopiować canvasa do schowka<br>Błąd: "+err, );
                Notification("Wystąpił błąd, sprawdź konsolę javascript.", "error");
            });
        });
    }
    async function ustawSchowek(){
        const items = navigator.clipboard.read();
        for (const item of items) {
            if (item.type.startsWith('image/')) {
                const blob = item.getAsFile();
                const img = await blobToImage(blob);
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            }
        }
    }
});

document.getElementById('wstawiaj').addEventListener('click', () => {
    const x = parseInt(document.getElementById('posxx').value);
    const y = parseInt(document.getElementById('posyy').value);
    if (pastedImage) {
        ctx.drawImage(pastedImage, x, y, pastedImage.width, pastedImage.height);
        pastedImage = null; 
    }
});
function printCanvas() {
    var canvas = document.getElementById('niepaintCanvas');
    var dataUrl = canvas.toDataURL();

    var windowContent = '<!DOCTYPE html>';
    windowContent += '<html>';
    windowContent += '<head><title>ColorBJ - drukowanie</title></head>';
    windowContent += '<body>';
    windowContent += '<img src="' + dataUrl + '">';
    windowContent += '</body>';
    windowContent += '</html>';

    var printWin = window.open('', '', 'width=800,height=600');
    printWin.document.open();
    printWin.document.write(windowContent);
    printWin.document.close();
    printWin.focus();
    printWin.print();
    printWin.close();
}
function drawShape(index) {
    var canvas = document.getElementById('niepaintCanvas');
    var ctx = canvas.getContext("2d");

    if (index < 0 || index >= ksztalty.length) {
        console.error('Invalid shape index');
        return;
    }

    var icon = ksztalty[index].replace("width=\"32\" height=\"32\"", "width=\"128\" height=\"128\"");
    const svgBase64 = `data:image/svg+xml;base64,${btoa(icon)}`;

    const img = new Image();
    img.onload = () => {
        const x = parseInt(document.getElementById("xxx").value, 10);
        const y = parseInt(document.getElementById("yyy").value, 10);

        ctx.drawImage(img, x, y);
        hideWindow(26);
        Notification("Wstawiono wybrany kształt na canvas.")
    };
    img.src = svgBase64;
}
function createButtons() {
    var container = document.getElementById('ksztaltdupy');
    container.innerHTML = '';

    ksztalty.forEach((ksztalt, index) => {
        var button = document.createElement('button');
        button.innerHTML = ksztalt;
        button.classList.add('ksztalt-button');
        button.dataset.index = index;
        button.style.margin = "5px"
        button.addEventListener('click', function() {
            var index = parseInt(this.dataset.index, 10);
            drawShape(index);
        });
        container.appendChild(button);
    });
}
createButtons();

function rysujGradient() {
    var c = document.getElementById("niepaintCanvas");
    var ctx = c.getContext("2d");
    var kolor1 = document.getElementById("kolor1").value;
    var kolor2 = document.getElementById("kolor2").value;

    
    var grd = ctx.createLinearGradient(0, 0, c.width, 0); 
    grd.addColorStop(0, kolor1);
    grd.addColorStop(1, kolor2);

    
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, c.width, c.height);
}


window.onload = function() {
    setupCanvas();
    setupDragAndDrop();
};