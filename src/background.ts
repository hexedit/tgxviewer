'use strict';

// #region imports

import {
    app,
    BrowserWindow,
    dialog,
    ipcMain as ipc,
    protocol,
    shell,
} from 'electron';
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer';
import * as path from 'path';
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib';
import { OpenFolderResult } from './tgxviewer/api';
import { TelegramExport } from './tgxviewer/tgexport';

// #endregion imports

const isDevelopment = process.env.NODE_ENV !== 'production';

// #region Electron Init

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
    { scheme: 'app', privileges: { secure: true, standard: true } },
]);

async function createWindow() {
    // Create the browser window.
    const window = new BrowserWindow({
        width: 1350,
        height: 700,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            sandbox: true,
            preload: path.resolve(__dirname, 'preload.js'),
        },
    });

    if (process.env.WEBPACK_DEV_SERVER_URL) {
        // Load the url of the dev server if in development mode
        await window.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string);
        if (!process.env.IS_TEST) window.webContents.openDevTools();
    }
    else {
        createProtocol('app');
        // Load the index.html when not in development
        window.loadURL('app://./index.html');
    }

    window.webContents.on('new-window', (e, url) => {
        e.preventDefault();
        shell.openExternal(url);
    });
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
    if (isDevelopment && !process.env.IS_TEST) {
        // Install Vue Devtools
        try {
            await installExtension(VUEJS_DEVTOOLS);
        }
        catch (e: any) {
            console.error('Vue Devtools failed to install:', e.toString());
        }
    }
    createWindow();
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
    if (process.platform === 'win32') {
        process.on('message', (data) => {
            if (data === 'graceful-exit') {
                app.quit();
            }
        });
    }
    else {
        process.on('SIGTERM', () => {
            app.quit();
        });
    }
}

// #endregion Electron Init

const tgExport = new TelegramExport();

ipc.handle(
    'tgexport:open',
    async (e): Promise<OpenFolderResult | undefined> => {
        const win = BrowserWindow.fromWebContents(e.sender);
        if (!win) return;
        const dir = await dialog.showOpenDialog(win, {
            properties: ['openDirectory'],
        });
        if (dir.canceled) return;
        if (!(await tgExport.open(dir.filePaths[0]))) return;
        return {
            // assuming the succeeded open fills all values
            // use some empty alternatives to prevent type checking errors
            path: tgExport.path(),
            userId: tgExport.userId || 0,
            userName: tgExport.userName || '',
            fullName: tgExport.fullName || '',
            profilePicture: tgExport.profilePicture || '',
            chats: tgExport.listChats(),
        };
    }
);

ipc.handle('tgexport:session-count', () => {
    return tgExport.sessionCount;
});

ipc.handle('tgexport:message-count', (e, chatId) => {
    return tgExport.messageCount(chatId);
});

ipc.handle('tgexport:list-sessions', () => {
    return tgExport.listSessions();
});

ipc.handle('tgexport:list-messages', (e, chatId) => {
    return tgExport.listMessages(chatId);
});
