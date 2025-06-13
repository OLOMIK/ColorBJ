async function fetchAccountInfo() {
    try {
        const response = await fetch('https://olomowostudio.pl/accinfo.php', {
            method: 'GET',
            credentials: 'include'
        });

        if (!response.ok) {
            if (response.status === 403) {
                document.getElementById('usernamedupa').innerHTML = "Zaloguj się!";
            } else {
                console.error("Błąd przy odbieraniu danych użytkownika z backendu: ", response.status);
            }
            return;
        }

        const data = await response.json();

        if (data && data.username) {
            document.getElementById('usernamedupa').innerHTML = "Witaj, " + data.username;
        } else {
            document.getElementById('usernamedupa').innerHTML = `<a onclick="showWindow(31);">Zaloguj się!</a>`;
        }

    } catch (error) {
        console.error("Błąd: ", error);
        document.getElementById('usernamedupa').innerHTML = "Zaloguj się!";
    }
}
async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);

        const response = await fetch('https://olomowostudio.pl/login.php', {
            method: 'POST',
            headers: { 'X-Requested-With': 'XMLHttpRequest' },
            body: formData,
            credentials: 'include'
        });

        if (!response.ok) {
            document.getElementById('loginError').style.display = 'block';
            return;
        }

        const data = await response.json();
        if (data.success) {
            document.getElementById('loginError').style.display = 'none';
            document.getElementById('usernamedupa').innerHTML = "Witaj, " + data.username;
            hideWindow('31');
        } else {
            document.getElementById('loginError').style.display = 'block';
        }
    } catch (error) {
        console.error("Błąd logowania:", error);
        document.getElementById('loginError').style.display = 'block';
    }
}
document.addEventListener('DOMContentLoaded', fetchAccountInfo);
