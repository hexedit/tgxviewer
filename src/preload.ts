// #region imports

import { contextBridge, ipcRenderer as ipc } from 'electron';
import { IElectronAPI, OpenFolderResult } from './tgxviewer/api';
import { Message, Session } from './tgxviewer/types';

// #endregion imports

const api: IElectronAPI = {
    async openFolder(): Promise<OpenFolderResult | undefined> {
        return ipc.invoke('tgexport:open');
    },
    async sessionCount(): Promise<number> {
        return ipc.invoke('tgexport:session-count');
    },
    async listSessions(): Promise<Session[]> {
        return ipc.invoke('tgexport:list-sessions');
    },
    async messageCount(chatId: number): Promise<number> {
        return ipc.invoke('tgexport:message-count', chatId);
    },
    async listMessages(chatId: number): Promise<Message[]> {
        return ipc.invoke('tgexport:list-messages', chatId);
    },
};

contextBridge.exposeInMainWorld('api', api);
