// Import the ipcRenderer module from Electron, to enable communication between renderer and main process
const { ipcRenderer } = require('electron');

// Get buttons from the HTML document
const startButton = document.getElementById('start-button');
const stopButton = document.getElementById('stop-button');
const logoutButton = document.getElementById('logout-button');

console.log("Buttons retrieved from the HTML document");

// Function that sends a request to refresh the connection status
function refresh() {
    console.log("Sending a request to refresh the connection status...");
    ipcRenderer.send('request-connection-status');
}

// Set an interval to refresh the connection status every 5 seconds
setInterval(() => {
    console.log("5 seconds have passed, refreshing the connection status...");
    refresh();
}, 5000);

// On window load, send requests to get locations data and account status, and refresh connection status
window.onload = function () {
    console.log("Window loaded, sending requests for locations data and account status, and refreshing connection status...");
    ipcRenderer.send('request-locations-data');
    ipcRenderer.send('request-account-status');
    refresh();
};

// Event listener for response from main process with locations data
ipcRenderer.on('response-locations-data', (event, arg) => {
    console.log("Response received from main process with locations data: ", arg);
    let select = document.getElementById('locations-select');

    // Add options for each location to the select dropdown
    arg.forEach(location => {
        let option = document.createElement('option');
        option.value = location.code;
        option.text = location.name;
        select.add(option);
    });
    console.log("Added location to select dropdown: ", arg);
});

// Event listener for response from main process with connection status
ipcRenderer.on('response-connection-status', (event, arg) => {
    console.log("Response received from main process with connection status: ", arg);
    let cnxStatusBlock = document.getElementById('status-info');
    cnxStatusBlock.innerHTML = "<p>" + arg + "</p>";
    console.log("Updated connection status block with: ", arg);
});

// Event listener for response from main process with account status
ipcRenderer.on('response-account-status', (event, arg) => {
    console.log("Response received from main process with account status: ", arg);
    let accountStatusBlock = document.getElementById('account-info');
    accountStatusBlock.innerHTML = "<p>" + arg + "</p>";
    console.log("Updated account status block with: ", arg);
});

// Add event listeners to buttons to send start, stop, and logout commands to main process when clicked
startButton.addEventListener('click', () => {
    let location = document.getElementById('locations-select').value;
    console.log("Start button clicked, sending start command with location: ", location);
    ipcRenderer.send('start', { location });
});

stopButton.addEventListener('click', () => {
    console.log("Stop button clicked, sending stop command");
    ipcRenderer.send('stop');
});

logoutButton.addEventListener('click', () => {
    console.log("Logout button clicked, sending logout command");
    ipcRenderer.send('logout');
});