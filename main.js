// Importing necessary modules from Electron, Node.js and child_process
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { exec, execSync } = require('child_process');

let mainWindow;
let userAlreadyLoggedIn = false;

// Function to create a new browser window and load HTML file based on login status
function createWindow() {
  console.log("Creating a new window...");

  // Creating a new browser window
  mainWindow = new BrowserWindow({
    width: 1100,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  // Checking if user is logged in
  if (checkLogin()) {
    console.log("User is logged in. Loading index.html...");
    // If user is logged in, load the index.html file
    mainWindow.loadFile(path.join(__dirname, 'src/index.html'));
  } else {
    console.log("User is not logged in. Loading login.html...");
    // If user is not logged in, load the login.html file
    mainWindow.loadFile(path.join(__dirname, 'src/login.html'));
  }
}

// When Electron app is ready, create a window
app.whenReady().then(() => {
  console.log("Electron app is ready. Creating a window...");
  createWindow();

  // Recreate window in the app when the dock icon is clicked and no other windows are open.
  app.on('activate', function () {
    console.log("App activated. Checking if window needs to be recreated...");
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit the application when all windows are closed (except on macOS)
app.on('window-all-closed', function () {
  console.log("All windows are closed. Quitting app...");
  if (process.platform !== 'darwin') app.quit();
});

// Event listener for 'login' event from renderer process
ipcMain.on('login', (event, arg) => {
  console.log("Received 'login' event. Attempting to sign in...");
  // Executing Hotspot Shield sign in command
  exec(`echo "${arg.username} ${arg.password}" | hotspotshield account signin`, (error, stdout, stderr) => {
    // Handle wrong login info
    if (stderr.includes("authorization denied: Wrong login info")) {
      console.error(`stderr exec: ${stderr}`);
      mainWindow.webContents.executeJavaScript(`document.getElementById("login-result").innerHTML = 'Wrong Username or Password';`);
      return;
    } else if (stdout.includes("You are signed in as")) {
      // Handle successful login
      console.log("Login successful. Loading index.html...");
      mainWindow.loadFile(path.join(__dirname, 'src/index.html'));
    } else if (stderr.includes("Maximum attempts exceeded")) {
      // Handle maximum attempts exceeded
      console.error(`stderr exec: ${stderr}`);
      mainWindow.webContents.executeJavaScript(`document.getElementById("login-result").innerHTML = 'Maximum attempts exceeded';`);
      return;
    }
  });
});

// Event listeners for requests from renderer process
ipcMain.on('request-connection-status', (event, arg) => {
  console.log("Received 'request-connection-status' event. Refreshing connection status...");
  refreshConnectionStatus(event);
});

ipcMain.on('request-locations-data', (event, arg) => {
  console.log("Received 'request-locations-data' event. Refreshing locations list...");
  refreshLocationsList(event);
});

ipcMain.on('request-account-status', (event, arg) => {
  refreshAccountStatus(event);
});

// Event listener for 'start' event from renderer process
ipcMain.on('start', (event, arg) => {
  // Executing Hotspot Shield connect command
  exec(`hotspotshield connect ${arg.location}`, (error, stdout, stderr) => {
    if (error) {
      event.sender.send('response-connection-status', error.message.replace(/\n/g, '<br>').trim());
    } else {
      console.log('Connection successful to : ' + arg.location);
      refreshConnectionStatus(event);
    }
  });
});

// Event listener for 'stop' event from renderer process
ipcMain.on('stop', (event, arg) => {
  // Executing Hotspot Shield disconnect command
  exec('hotspotshield disconnect', (error, stdout, stderr) => {
    if (error) {
      event.sender.send('response-connection-status', stderr.replace(/\n/g, '<br>').trim());
    } else {
      console.log('VPN Disconnected');
      refreshConnectionStatus(event);
    }
  });
});

// Event listener for 'logout' event from renderer process
ipcMain.on('logout', (event, arg) => {
  // Executing Hotspot Shield sign out command
  exec('hotspotshield account signout', (error, stdout, stderr) => {
    if (error) {
      event.sender.send('response-connection-status', stderr.replace(/\n/g, '<br>').trim());
    } else {
      console.log('VPN Account Logged out');
      mainWindow.loadFile(path.join(__dirname, 'src/login.html'));
    }
  });
});

// Function to refresh the list of available VPN locations
function refreshLocationsList(event) {
  // Executing Hotspot Shield locations command
  exec('hotspotshield locations', (error, stdout, stderr) => {
    if (error) {
      console.error('exec error: ' + error);
      return;
    }

    // Parsing the output of the command
    let locations = stdout.split('\n')
      .slice(2)
      .map(line => {
        let parts = line.split(/\s+/);
        return { code: parts[0], name: parts.slice(1).join(' ') };
      })
      .filter(location => location.code !== '');
    console.log("Loaded all locations");
    event.sender.send('response-locations-data', locations);
  });
}

// Function to refresh the VPN connection status
function refreshConnectionStatus(event) {
  // Executing Hotspot Shield status command
  console.log('Refreshing connection status...');
  exec('hotspotshield status', (error, stdout, stderr) => {
    if (error) {
      console.error('exec error: ' + error);
      event.sender.send('response-connection-status', stderr.replace(/\n/g, '<br>').trim());
      return;
    }
    console.log('Connection status response received:', stdout);
    event.sender.send('response-connection-status', stdout.replace(/\n/g, '<br>').trim());
  });
}

// Function to refresh the account status
function refreshAccountStatus(event) {
  // Executing Hotspot Shield account status command
  console.log('Refreshing account status...');
  exec('hotspotshield account status', (error, stdout, stderr) => {
    if (error) {
      console.error('exec error: ' + error);
      event.sender.send('response-account-status', stderr.replace(/\n/g, '<br>').trim());
      return;
    }
    console.log('Account status response received:', stdout);
    event.sender.send('response-account-status', stdout.replace(/\n/g, '<br>').trim());
  });
}

// Function to check if the user is already logged in
function checkLogin() {
  try {
    // Executing Hotspot Shield account status command synchronously
    console.log('Checking login status...');
    let output = execSync('hotspotshield account status');
    if (output.includes("You are signed in")) {
      console.log("User already signed in");
      userAlreadyLoggedIn = true;
    } else {
      console.log("User not signed in");
      userAlreadyLoggedIn = false;
    }
  } catch (error) {
    console.error('exec error: ' + error);
    console.log("User not signed in");
    userAlreadyLoggedIn = false;
  }

  return userAlreadyLoggedIn;
}