console.log("załadowano skrypty odpowiedzialne za canvas");

var canvas, ctx;
var painting = false;
var rubberMode = false;
var blockSize = 5;
var currentBackgroundColor = "#111111";
var kolor = "#5e5e5e";
var posListening = false;
var pastePosListening = false;
var shapePosListening = false;
var colorPosListening = false;
var pastePosY;
var pastePosX;
var offscreenCanvas = document.createElement('canvas');
var offscreenCtx = offscreenCanvas.getContext('2d');
var points = [];
var ulepszanieLinii = false;
var disabled = false;
var layers = [];
var currentLayerIndex = 0;
var layersPanelVisability = false;
var history = [];
var historyIndex = -1;
var selectedColor;

function saveHistory() {
    if (historyIndex < history.length - 1) {
        history = history.slice(0, historyIndex + 1);
    }

    const layersState = layers.map(layer => {
        const layerCanvas = document.createElement('canvas');
        layerCanvas.width = layer.width;
        layerCanvas.height = layer.height;
        layerCanvas.getContext('2d').drawImage(layer, 0, 0);
        return layerCanvas;
    });

    history.push(layersState);
    historyIndex++;
}

function undo() {
    if (historyIndex > 0) {
        historyIndex--;
        restoreHistory();
    }
}

function redo() {
    if (historyIndex < history.length - 1) {
        historyIndex++;
        restoreHistory();
    }
}

function restoreHistory() {
    const layersState = history[historyIndex];
    layers = layersState.map(layerState => {
        const layerCanvas = document.createElement('canvas');
        layerCanvas.width = layerState.width;
        layerCanvas.height = layerState.height;
        layerCanvas.getContext('2d').drawImage(layerState, 0, 0);
        return layerCanvas;
    });
    currentLayerIndex = layers.length - 1;
    updateLayersList();
    renderLayers();
}


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
    addLayer(); 
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
    renderLayers();
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
        var [x, y] = getMousePos(event);
        var layerCtx = layers[currentLayerIndex].getContext('2d');
        layerCtx.strokeStyle = rubberMode ? currentBackgroundColor : kolor;
        layerCtx.lineWidth = blockSize;
        layerCtx.lineCap = 'round';
        layerCtx.beginPath();
        layerCtx.moveTo(lastX, lastY);
        layerCtx.lineTo(x, y);
        layerCtx.stroke();
        [lastX, lastY] = [x, y];
        renderLayers();
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
    const layerCtx = layers[currentLayerIndex].getContext('2d');
    const kolorInput = document.getElementById("colorSel").value;
    ustawkolor(kolorInput);
    layerCtx.fillStyle = kolorInput;
    layerCtx.fillRect(0, 0, canvas.width, canvas.height);
    renderLayers();
    document.getElementById('windowContainer5').style.display = 'none';
    Notification("Wypełniono pole robocze nowym kolorem.", "success");
}

function clearSzachownica() {
    const layerCtx = layers[currentLayerIndex].getContext('2d');
    layerCtx.fillStyle = currentBackgroundColor;
    layerCtx.fillRect(0, 0, canvas.width, canvas.height);
    renderLayers();
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
function dupa1(){
    colorPosListening = true;
    Notification("Rozpoczęto wybieranie koloru", NotificationType.SUCCESS);
}
function openImage(event) {
    const layerCtx = layers[currentLayerIndex].getContext('2d');
    const input = event.target;
    const reader = new FileReader();
    reader.onload = function() {
        const dataURL = reader.result;
        const image = new Image();
        image.onload = function() {
            layerCtx.clearRect(0, 0, canvas.width, canvas.height);
            customSize2(image.width, image.height);
            layerCtx.drawImage(image, 0, 0, canvas.width, canvas.height);
            renderLayers();
            Notification("Otwarto nowy obraz.");
        };
        image.src = dataURL;
    };
    reader.readAsDataURL(input.files[0]);
}

function drawTextOnCanvas(text, x, y, font, color) {
    const layerCtx = layers[currentLayerIndex].getContext('2d');
    layerCtx.font = font || 'Arial';
    layerCtx.fillStyle = color || 'black';
    layerCtx.fillText(text, x, y);
    renderLayers();
}

document.getElementById('applyColors').addEventListener('click', function() {
    applyColors();
});

function applyColors() {
    const layerCtx = layers[currentLayerIndex].getContext('2d');
    const rValue = document.getElementById('rvalue').value;
    const gValue = document.getElementById('gvalue').value;
    const bValue = document.getElementById('bvalue').value;
    const gammaValue = document.getElementById('gammaValue').value;

    const imageData = layerCtx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        data[i] = 255 * Math.pow((data[i] / 255) + parseInt(rValue) / 255, 1 / gammaValue);
        data[i + 1] = 255 * Math.pow((data[i + 1] / 255) + parseInt(gValue) / 255, 1 / gammaValue);
        data[i + 2] = 255 * Math.pow((data[i + 2] / 255) + parseInt(bValue) / 255, 1 / gammaValue);
    }

    layerCtx.putImageData(imageData, 0, 0);
    renderLayers();
    Notification("Zmieniono kolory obrazu.")
}

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




async function removeBackground() {
    const layerCtx = layers[currentLayerIndex].getContext('2d');
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
            layerCtx.clearRect(0, 0, canvas.width, canvas.height);
            layerCtx.drawImage(resultImage, 0, 0, canvas.width, canvas.height);
            URL.revokeObjectURL(urlObject);
            renderLayers();
            Notification("Usunięto tło z obrazu.");
        };
        resultImage.src = urlObject;
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
    canvas.onclick = function(e) {
    const rect = e.target.getBoundingClientRect();
    const x = Math.floor(e.clientX - rect.left);
    const y = Math.floor(e.clientY - rect.top);

    if (posListening) {
        disabled = true;
        updateCursor();
        document.getElementById("posx").value = x;
        document.getElementById("posy").value = y;
        posListening = false;
        document.getElementById('windowContainer7').style.display = 'block';
        disabled = false;
        updateCursor();
    }

    if (pastePosListening) {
        disabled = true;
        updateCursor();
        document.getElementById("posxx").value = x;
        document.getElementById("posyy").value = y;
        pastePosListening = false;
        document.getElementById('windowContainer20').style.display = 'block';
        disabled = false;
        updateCursor();
    }

    if (shapePosListening) {
        disabled = true;
        updateCursor();
        document.getElementById("xxx").value = x;
        document.getElementById("yyy").value = y;
        shapePosListening = false;
        document.getElementById('windowContainer26').style.display = 'block';
        disabled = false;
        updateCursor();
    }

    if (colorPosListening) {
        disabled = true;
        updateCursor();

        const pixel = ctx.getImageData(x, y, 1, 1).data;
        const r = pixel[0];
        const g = pixel[1];
        const b = pixel[2];

        selectedColor = "#" + [r, g, b]
            .map(v => v.toString(16).padStart(2, "0"))
            .join("");

        console.log('Wybrany kolor HEX:', selectedColor);

        colorPosListening = false;
        disabled = false;
        kolor = selectedColor;
        updateCursor();
    }

};
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
    const layerCtx = layers[currentLayerIndex].getContext('2d');

    if (index < 0 || index >= ksztalty.length) {
        console.error('Invalid shape index');
        return;
    }

    const icon = ksztalty[index].replace("width=\"32\" height=\"32\"", "width=\"128\" height=\"128\"");
    const svgBase64 = `data:image/svg+xml;base64,${btoa(icon)}`;

    const img = new Image();
    img.onload = () => {
        const x = parseInt(document.getElementById("xxx").value, 10);
        const y = parseInt(document.getElementById("yyy").value, 10);

        layerCtx.drawImage(img, x, y);
        hideWindow(26);
        renderLayers();
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
    const layerCtx = layers[currentLayerIndex].getContext('2d');
    const kolor1 = document.getElementById("kolor1").value;
    const kolor2 = document.getElementById("kolor2").value;

    const grd = layerCtx.createLinearGradient(0, 0, canvas.width, 0);
    grd.addColorStop(0, kolor1);
    grd.addColorStop(1, kolor2);

    layerCtx.fillStyle = grd;
    layerCtx.fillRect(0, 0, canvas.width, canvas.height);
    renderLayers();
}

function addLayer() {
    var newLayer = document.createElement('canvas');
    newLayer.width = canvas.width;
    newLayer.height = canvas.height;
    var newLayerCtx = newLayer.getContext('2d');
    newLayerCtx.fillStyle = 'rgba(0, 0, 0, 0)'; 
    newLayerCtx.fillRect(0, 0, newLayer.width, newLayer.height);
    layers.push(newLayer);
    currentLayerIndex = layers.length - 1;
    updateLayersList();
    renderLayers();
}

function removeLayer() {
    if (layers.length > 1) {
        layers.splice(currentLayerIndex, 1);
        currentLayerIndex = Math.max(0, currentLayerIndex - 1);
        updateLayersList();
        renderLayers();
    } else {
        Notification("Nie można usunąć ostatniej warstwy.", "error");
    }
}

function updateLayersList() {
    var layersList = document.getElementById('layersList');
    layersList.innerHTML = '';
    layers.forEach((layer, index) => {
        var layerItem = document.createElement('div');
        layerItem.textContent = `Warstwa ${index + 1}`;
        layerItem.className = 'layer-item';
        layerItem.style.backgroundColor = index === currentLayerIndex ? '#1e1e2e' : '#111111';
        layerItem.onclick = () => {
            currentLayerIndex = index;
            updateLayersList();
            renderLayers();
        };
        layersList.appendChild(layerItem);
    });
}

function renderLayers() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    layers.forEach(layer => {
        ctx.drawImage(layer, 0, 0);
    });
}

function toggleLayersPanel() {
    var layersPanel = document.getElementById('layersPanel');
    if (layersPanelVisability) {
        layersPanel.style.display = 'none';
    }
    else {
        layersPanel.style.display = 'block';
    }
    layersPanelVisability = !layersPanelVisability;
    
}
function generowanko(){
    var prompt = document.getElementById("promptInput").value;
    generator(prompt);
    Notification("Pomyślnie rozpoczęto generowanie obrazu.");   
}
async function generator(prompt) {
    const layerCtx = layers[currentLayerIndex].getContext('2d');
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;

    try {
        const response = await fetch(imageUrl);
        
        if (!response.ok) {
            throw new Error('Błąd pobierania obrazu: ' + response.statusText);
        }

        const blob = await response.blob();
        const urlObject = URL.createObjectURL(blob);

        const resultImage = new Image();
        resultImage.onload = function() {
            layerCtx.clearRect(0, 0, canvas.width, canvas.height);
            layerCtx.drawImage(resultImage, 0, 0, canvas.width, canvas.height);
            URL.revokeObjectURL(urlObject);
            renderLayers();
            Notification("Wygenerowano obraz na podstawie podanego tekstu.", "success");
        };
        resultImage.src = urlObject;
        Notification("Wygenerowano obraz na podstawie podanego tekstu.", "success");
    } catch (error) {
        console.error('Wystąpił błąd:', error);
        Notification("Wystąpił błąd podczas generowania obrazu.", "error"); 
    }
}

window.onload = function() {
    setupCanvas();
    setupDragAndDrop();
};