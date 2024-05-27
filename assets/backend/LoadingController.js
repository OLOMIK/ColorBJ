var i = 0;
addEventListener("DOMContentLoaded", (event) => {
    if (i == 0) {
        i = 1;
        var elem = document.getElementById("bar");
        var width = 10;
        var id = setInterval(frame, 10);
        function frame() {
          if (width >= 100) {
            clearInterval(id);
            i = 0;
            loadColorBJ();
          } else {
            width++;
            elem.style.width = width /5 + "%";
            elem.innerHTML = width + "%";
          }
        }
      }
});
function loadColorBJ(){
    const mainview = document.getElementById("maindupaview");
    const loading = document.getElementById("loading");
    loading.style.display = "none";
    mainview.style.display = "flex";

}