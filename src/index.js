"use strict";
// @ts-ignore: Idk what happened
const { app, BrowserWindow, Menu, ipcMain, shell, session, globalShortcut, Notification } = require('electron');
const log = require('electron-log');
const path = require('path');
log.info('RBAI starting...');
// Create window
const createWindow = () => {
    // Create the browser window.
    const window = new BrowserWindow({
        width: 800,
        height: 600,
        show: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            sandbox: false
        }
    });
    window.webContents.setBackgroundThrottling(false);
    window.loadURL("https://raaaaft.io");
    window.webContents.openDevTools();
    window.maximize();
    // Deletes menu and makes new menu
    window.removeMenu();
    const menu = Menu.buildFromTemplate([
        {
            label: "Debug",
            submenu: [
                {
                    label: "DevTools",
                    click() {
                        window.webContents.openDevTools();
                    }
                },
                {
                    label: "Reload",
                    click() {
                        window.reload();
                    }
                }
            ]
        },
        {
            label: "Run",
            submenu: [
                {
                    label: "Main",
                    click() {
                        console.log("start");
                    }
                }
            ]
        }
    ]);
    Menu.setApplicationMenu(menu);
    // Opens URLs in browser
    window.webContents.setWindowOpenHandler((details) => {
        shell.openExternal(details.url);
        return { action: 'deny' };
    });
};
app.on('ready', () => {
    createWindow();
});
function quitApp() {
    log.info("App has been quit");
    if (process.platform !== 'darwin') {
        app.quit();
    }
}
app.on('window-all-closed', () => {
    quitApp();
});
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
