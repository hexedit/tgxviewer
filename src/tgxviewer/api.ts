import { Chat, Message, Session } from './types';

export interface OpenFolderResult {
    path: string;
    userId: number;
    userName: string;
    fullName: string;
    profilePicture: string;
    chats: Array<Chat>;
}

export interface IElectronAPI {
    openFolder: () => Promise<OpenFolderResult | undefined>;
    sessionCount: () => Promise<number>;
    listSessions: () => Promise<Session[]>;
    messageCount: (chatId: number) => Promise<number>;
    listMessages: (chatId: number) => Promise<Message[]>;
}
