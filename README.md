# ****Electron Desktop Application with Hotspot Shield CLI Interaction****

<aside>
⚠️ Please note that this is a very basic structure for an Electron application that interacts with the Hotspot Shield CLI. Additional functionalities like error handling, user feedback, and styling are not included. Be sure to add those according to your requirements.

Also, consider user's privacy and security while handling their credentials. Always encrypt sensitive data and never store them in plain text.

This guide assumes that you are familiar with Node.js, Electron, and the command line. If you are not, you may need to go through additional resources or tutorials to understand some of the steps and code snippets.

This application is intended to work on a system where the Hotspot Shield CLI is available. The user needs to have the necessary permissions to execute the Hotspot Shield commands. Ensure to check for the availability and the permissions for the Hotspot Shield CLI before trying to execute commands from the application.

</aside>

## **Overview**

We are building a desktop application using Electron that interacts with the Hotspot Shield CLI on Ubuntu. The application will:

1. Enable user login and logout.
2. Periodically check the VPN status.
3. Display a list of all available VPN locations.
4. Allow the user to select a location and start or stop the VPN.

---

## **Pre-requisites**

### **Installing Node.js and npm**

You can download Node.js and npm from the official **[Node.js website](https://nodejs.org/)**. Choose the version suitable for your system and follow the installation instructions. Or you can do using the terminal

```bash
sudo apt update
sudo apt-get install nodejs
sudo apt-get install npm 
```

After installation, you can check if Node.js and npm are installed correctly by opening a terminal window and running:

```bash
node -v
npm -v
```

These commands should display the installed versions of Node.js and npm, respectively.

### **Installing Electron**

Once you have Node.js and npm installed, you can install Electron globally on your system by running:

```bash
sudo npm install -g electron
```

### **Hotspot Shield CLI**

The application will interact with Hotspot Shield via its command-line interface (CLI). Ensure that Hotspot Shield is installed on your system and that you have access to the CLI.

---

## **Setup and Initialization**

Create a new directory for your project, navigate into it and initialize a new Node.js application:

```bash
git clone git@gitlab.com:hotspot-shield-ui/hotspot-shield-ui.git 
cd hotspot-shield-ui
npm install
```

Install Electron as a dev dependency in your project:

```bash
npm install electron --save-dev
```

```bash
electron --version
```

Now, you can start the Electron application by running:

```bash
npm start
```

This command will start the Electron runtime and launch your application.

---

## **Hotspot Shield CLI Commands**

These are the Hotspot Shield CLI commands we will use:

- **`hotspotshield account signin`**: Sign in to Hotspot Shield.
- **`hotspotshield account status`**: View account information and status.
- **`hotspotshield account signout`**: Sign out of Hotspot Shield.
- **`hotspotshield locations`**: Display the list of all available VPN locations.
- **`hotspotshield connect [country code]`**: Connect to a VPN location. Example: **`hotspotshield connect US`**.
- **`hotspotshield disconnect`**: Disconnect or change to another VPN location.
- **`hotspotshield connect`**: Connect to the most recent location.
- **`hotspotshield status`**: Check if the VPN is running.

---

## **Electron Application Structure**

Our Electron application will have the following structure:

```
my-electron-app/
├── package.json
├── main.js
└── src/
    ├── index.html
    ├── login.html
    ├── login.js
    └── index.js
```

---

## **Packaging and Distribution**

<aside>
⚠️ Electron Packager requires Node >= 14.17.5.

</aside>

You can use **`electron-packager`** or **`electron-builder`** to package the Electron application into a distributable format.

To install **`electron-packager`**, run:

```bash
npm install electron-packager --save-dev
```

To package the application, run:

```bash
npx electron-packager .
```

This will create a directory with the packaged application.

To create a distributable format like **`.deb`** for Ubuntu, consider using **`electron-builder`**. After setting up your **`package.json`** correctly, create a **`.deb`** package with the following command:

```bash
npx electron-builder --linux deb
```

this will generate a **`.deb`** file in the **`dist`** directory, which you can distribute to Ubuntu users. They can install it using the package manager.