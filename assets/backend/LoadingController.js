var i = 0;
addEventListener("DOMContentLoaded", (event) => {
  const loadButton = document.getElementById("loadButton"); 
  if (loadButton) {
    loadButton.onclick = LoadLoading;
  }
});

function loadColorBJ() {
  const mainview = document.getElementById("maindupaview");
  const loading = document.getElementById("loading");
  const openview = document.getElementsByClassName("welcome")[0]; 

  if (loading) loading.style.display = "none";
  if (openview) openview.style.display = "none";
  if (mainview) mainview.style.display = "flex";
}

function LoadLoading() {
  const mainview = document.getElementById("maindupaview");
  const openview = document.getElementById("welcome");
  const loading = document.getElementById("loading");
  const elem = document.getElementById("bar");
  if (loading) loading.style.display = "inline";
  if (openview) openview.style.display = "none";
  if (mainview) mainview.style.display = "none";

  if (i === 0) {
    i = 1;
    var width = 10;
    if (elem) {
      var id = setInterval(frame, 20);
      function frame() {
        if (width >= 100) {
          clearInterval(id);
          i = 0;
          setTimeout(loadColorBJ, 500);
          elem.innerHTML = "Załadowano!";
        } else {
          width++;
          elem.style.width = width / 4 + "%";
          elem.innerHTML = width + "%";
        }
      }
    }
  }
}
function LoadWithOpen() {
  const mainview = document.getElementById("maindupaview");
  const openview = document.getElementById("welcome");
  const loading = document.getElementById("loading");
  const elem = document.getElementById("bar");
  if (loading) loading.style.display = "inline";
  if (openview) openview.style.display = "none";
  if (mainview) mainview.style.display = "none";

  if (i === 0) {
    i = 1;
    var width = 10;
    if (elem) {
      var id = setInterval(frame, 20);
      function frame() {
        if (width >= 100) {
          clearInterval(id);
          i = 0;
          setTimeout(loadColorBJWithOpen, 500);
          elem.innerHTML = "Załadowano!";
        } else {
          width++;
          elem.style.width = width / 4 + "%";
          elem.innerHTML = width + "%";
        }
      }
    }
  }
}
async function loadColorBJWithOpen() {
  const mainview = document.getElementById("maindupaview");
  const loading = document.getElementById("loading");
  const openview = document.getElementsByClassName("welcome")[0]; 
 
  if (loading) loading.style.display = "none";
  if (openview) openview.style.display = "none";
  if (mainview) mainview.style.display = "flex";
  const container = document.getElementById('windowContainer6');
  container.style.display = 'block';
  
  
}
function LoadWithSchowek() {
  const mainview = document.getElementById("maindupaview");
  const openview = document.getElementById("welcome");
  const loading = document.getElementById("loading");
  const elem = document.getElementById("bar");
  if (loading) loading.style.display = "inline";
  if (openview) openview.style.display = "none";
  if (mainview) mainview.style.display = "none";

  if (i === 0) {
    i = 1;
    var width = 10;
    if (elem) {
      var id = setInterval(frame, 20);
      function frame() {
        if (width >= 100) {
          clearInterval(id);
          i = 0;
          setTimeout(loadColorBJWithSchowek, 500);
          elem.innerHTML = "Załadowano!";
        } else {
          width++;
          elem.style.width = width / 4 + "%";
          elem.innerHTML = width + "%";
        }
      }
    }
  }
}
async function loadColorBJWithSchowek() {
  const mainview = document.getElementById("maindupaview");
  const loading = document.getElementById("loading");
  const openview = document.getElementsByClassName("welcome")[0]; 
 
  if (loading) loading.style.display = "none";
  if (openview) openview.style.display = "none";
  if (mainview) mainview.style.display = "flex";

  try {
    const items = await navigator.clipboard.read();
    for (const item of items) {
      if (item.types.includes('image/png')) {
        const blob = await item.getType('image/png');
        const img = await blobToImage(blob);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
      }
    }
  } catch (error) {
    console.error("Nie udało się odczytać obrazu ze schowka:", error);
    Notification("Nie udało się odczytać obrazu ze schowka.");
  }
}

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