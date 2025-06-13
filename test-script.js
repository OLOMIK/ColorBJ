definePlugin("Plugin Testowy", "1.0", "Plugin, który pokazuje możliwości pisania skryptów do ColorBJ", "Olomowo Studio");
Notification("Załadowano podstawowy plugin.", "success");
function toggleTheme() {
    const body = document.querySelector('body');
    body.style.backgroundColor = body.style.backgroundColor === 'white' ? 'black' : 'white';
}
function renderCustomWindow () {
    const customWindow = document.createElement('div');
    customWindow.classList.add('custom-window');
    customWindow.innerHTML = `
    <div class="windowContainer" id="windowContainer120">
        <div class="containerContent">
            <div class="containerHeader">
                <div style="display: flex; justify-items: center;">
                    <svg style="margin-right: 10px;" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                        viewBox="0 0 24 24">
                        <path fill="currentColor"
                            d="M16.519 16.501c.175-.136.334-.295.651-.612l3.957-3.958c.096-.095.052-.26-.075-.305a4.332 4.332 0 0 1-1.644-1.034a4.332 4.332 0 0 1-1.034-1.644c-.045-.127-.21-.171-.305-.075L14.11 12.83c-.317.317-.476.476-.612.651c-.161.207-.3.43-.412.666c-.095.2-.166.414-.308.84l-.184.55l-.292.875l-.273.82a.584.584 0 0 0 .738.738l.82-.273l.875-.292l.55-.184c.426-.142.64-.212.84-.308c.236-.113.46-.25.666-.412m5.849-5.809a2.163 2.163 0 1 0-3.06-3.059l-.126.128a.524.524 0 0 0-.148.465c.02.107.055.265.12.452c.13.375.376.867.839 1.33a3.5 3.5 0 0 0 1.33.839c.188.065.345.1.452.12a.525.525 0 0 0 .465-.148z" />
                        <path fill="currentColor" fill-rule="evenodd"
                            d="M4.172 3.172C3 4.343 3 6.229 3 10v4c0 3.771 0 5.657 1.172 6.828C5.343 22 7.229 22 11 22h2c3.771 0 5.657 0 6.828-1.172C20.981 19.676 21 17.832 21 14.18l-2.818 2.818c-.27.27-.491.491-.74.686a5.107 5.107 0 0 1-.944.583a8.163 8.163 0 0 1-.944.355l-2.312.771a2.083 2.083 0 0 1-2.635-2.635l.274-.82l.475-1.426l.021-.066c.121-.362.22-.658.356-.944c.16-.335.355-.651.583-.943c.195-.25.416-.47.686-.74l4.006-4.007L18.12 6.7l.127-.127A3.651 3.651 0 0 1 20.838 5.5c-.151-1.03-.444-1.763-1.01-2.328C18.657 2 16.771 2 13 2h-2C7.229 2 5.343 2 4.172 3.172M7.25 9A.75.75 0 0 1 8 8.25h6.5a.75.75 0 0 1 0 1.5H8A.75.75 0 0 1 7.25 9m0 4a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 0 1.5H8a.75.75 0 0 1-.75-.75m0 4a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5H8a.75.75 0 0 1-.75-.75"
                            clip-rule="evenodd" />
                    </svg>
                    Skrypt testowy
                </div>
                <div class="close" onclick="hideWindow(120)">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
                        <path fill="currentColor"
                            d="m12 12.708l3.246 3.246q.14.14.344.15q.204.01.364-.15t.16-.354q0-.194-.16-.354L12.708 12l3.246-3.246q.14-.14.15-.344q.01-.204-.15-.364t-.354-.16q-.194 0-.354.16L12 11.292L8.754 8.046q-.14-.14-.344-.15q-.204-.01-.364.15t-.16.354q0 .194.16.354L11.292 12l-3.246 3.246q-.14.14-.15.344q-.01.204.15.364t.354.16q.194 0 .354-.16zM12.003 21q-1.866 0-3.51-.708q-1.643-.709-2.859-1.924q-1.216-1.214-1.925-2.856Q3 13.87 3 12.003q0-1.866.708-3.51q.709-1.643 1.924-2.859q1.214-1.216 2.856-1.925Q10.13 3 11.997 3q1.866 0 3.51.708q1.643.709 2.859 1.924q1.216 1.214 1.925 2.856Q21 10.13 21 11.997q0 1.866-.708 3.51q-.709 1.643-1.924 2.859q-1.214 1.216-2.856 1.925Q13.87 21 12.003 21" />
                    </svg>
                </div>
            </div>
            <div style="margin-left: 10px;">
<center><h2>Witaj w testowym pluginie, możesz zamknąć to okno.</h2></center>
            </div>
        </div>

    </div>
    `;
    document.body.appendChild(customWindow);

}
renderCustomWindow();
toggleTheme();