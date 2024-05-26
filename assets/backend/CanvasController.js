console.log("załadowano backend");

var canvas, ctx;
var painting = false;
var rubberMode = false;
var blockSize = 5;
var currentBackgroundColor = "#111111";
var kolor = "#5e5e5e";
var posListening = false;

function setCanvasSize() {
    canvasWidth = window.innerWidth < 768 ? window.innerWidth - 70 : 1200;
    canvasHeight = window.innerWidth < 768 ? 600 : 800;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
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
}

function clearSzachownica() {
    ctx.fillStyle = currentBackgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    document.getElementById('windowContainer4').style.display = 'none';
}

function saveImage() {
    var filename = document.getElementById('filenameInput').value.trim();
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
});

function dupkadupeczka() {
    drawTextOnCanvas(document.getElementById("tekscior").value, document.getElementById("posx").value, document.getElementById("posy").value, document.getElementById("rozmiar").value + "px " + document.getElementById("fontname").value, document.getElementById("kolor").value);
    document.getElementById('windowContainer7').style.display = 'block';
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
            };
        })(file);

        reader.readAsDataURL(file);
    }
}

function dupa() {
    posListening = true;
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
}

window.onload = function() {
    setupCanvas();
    setupDragAndDrop();
};
