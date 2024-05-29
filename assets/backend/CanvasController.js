console.log("załadowano backend");

var canvas, ctx;
var painting = false;
var rubberMode = false;
var blockSize = 5;
var currentBackgroundColor = "#111111";
var kolor = "#5e5e5e";
var posListening = false;
var pastePosListening = false;
var pastePosY;
var pastePosX;

function setCanvasSize() {
    canvasWidth = window.innerWidth < 768 ? window.innerWidth - 70 : 1200;
    canvasHeight = window.innerWidth < 768 ? 600 : 800;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    ctx.fillStyle = currentBackgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}
function customCanvasSize(){
    canvas.width = document.getElementById("dlugoscinput").value;
    canvas.height = document.getElementById("szerokoscinput").value;
    ctx.fillStyle = currentBackgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    Notification("Zmieniono rozmiary pola roboczego.")
}
function customSize2(w, h){
    canvas.width = w;
    canvas.height = h;
    ctx.fillStyle = currentBackgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}
function setBlockSize(size) {
    blockSize = size;
}

document.getElementById("wyb").addEventListener('change', function() {
    ustawkolor(this.value);
});

function setupCanvas() {
    canvas = document.getElementById('niepaintCanvas');
    if (!canvas) {
        console.error('Nie znaleziono elementu canvas!');
        console.log("wystąpił błąd podczas ładowania edytora");
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
}

function ustawkolor(color) {
    kolor = color == '#000000' ? '#5e5e5e' : color;
    painting = false;
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

    var x, y;

    if (event.touches) {
        x = event.touches[0].pageX - canvas.offsetLeft;
        y = event.touches[0].pageY - canvas.offsetTop;
    } else {
        x = event.pageX - canvas.offsetLeft;
        y = event.pageY - canvas.offsetTop;
    }

    ctx.fillStyle = rubberMode ? currentBackgroundColor : kolor;
    ctx.fillRect(x, y, blockSize, blockSize);
}

function touchPaint(e) {
    e.preventDefault();
    paint(e);
}

function toggleRubberMode() {
    rubberMode = !rubberMode;
    Notification("Przełączono tryb gumki.");
}

function disableRubberMode() {
    rubberMode = false;
}

function fillSzachownica() {
    
    var kolorInput = document.getElementById("colorSel").value;
    ustawkolor(kolorInput);
    ctx.fillStyle = kolorInput;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    document.getElementById('windowContainer5').style.display = 'none';
    ustawkolor('#5e5e5e');
    Notification("Wypełniono pole robocze nowym kolorem.");
}

function clearSzachownica() {
    ctx.fillStyle = currentBackgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    document.getElementById('windowContainer4').style.display = 'none';
    Notification("Wyczyszczono pole robocze.");
}

function saveImage() {
    var filename = document.getElementById('filenameInput').value.trim();
    var link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL();
    link.click();
    Notification("Zapisano obraz.");
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

document.getElementById('niepaintCanvas').onclick = function(e) {
    if (posListening) {
        stopPainting();
        var rect = e.target.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        document.getElementById("posx").value = x;
        document.getElementById("posy").value = y;
        posListening = false;
        const container = document.getElementById('windowContainer7');
        container.style.display = 'block';
        startPainting();
        
    }
    if (pastePosListening) {
        stopPainting();
        const container = document.getElementById('windowContainer20');
        var rect = e.target.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        document.getElementById("posxx").value = x;
        document.getElementById("posyy").value = y;
        pastePosListening = false;
        container.style.display = 'block';
        startPainting();
        
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
        Notification("Wysłano opinię.");
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
    });
    
    function copyCanvasToClipboard() {
        canvas.toBlob(blob => {
            const item = new ClipboardItem({ 'image/png': blob });
            navigator.clipboard.write([item]).then(() => {
                Notification("Skopiowano zawartość canvasa do schowka.");
            }).catch(err => {
                sendError("Nie udało się skopiować canvasa do schowka<br>Błąd: "+err);
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







window.onload = function() {
    setupCanvas();
    setupDragAndDrop();
};
