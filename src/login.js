const { ipcRenderer } = require('electron');
const loginForm = document.getElementById('login-form');
const rememberMeCheckbox = document.getElementById('remember-me');

// Load saved login information if available
window.addEventListener('DOMContentLoaded', () => {
    const savedUsername = localStorage.getItem('username');
    const savedPassword = localStorage.getItem('password');
    const savedRememberMe = localStorage.getItem('rememberMe');

    if (savedUsername && savedPassword) {
        document.getElementById('username').value = savedUsername;
        document.getElementById('password').value = savedPassword;

        if (savedRememberMe === 'true') {
            rememberMeCheckbox.checked = true;
        }
    }
});

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;

    let rememberMe = rememberMeCheckbox.checked;

    // Save login information if remember me is checked
    if (rememberMe) {

      localStorage.setItem('username', username);
      localStorage.setItem('password', password);
      localStorage.setItem('rememberMe', 'true');
    } else {
      localStorage.removeItem('username');
      localStorage.removeItem('password');
      localStorage.setItem('rememberMe', 'false');
    }

    ipcRenderer.send('login', { username, password });
});