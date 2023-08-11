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

### **Hotspot Shield CLI**

The application will interact with Hotspot Shield via its command-line interface (CLI). Ensure that Hotspot Shield is installed on your system and that you have access to the CLI.

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

## **Packaging and Distribution**
Installation guide 
Clone the repository then run 
```bash
# To install node dependencies 
npm install 

# To start the application 
npm start
```
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