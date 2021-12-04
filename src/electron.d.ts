import { IElectronAPI } from './tgxviewer/api';

declare global {
    interface Window {
        api: IElectronAPI;
    }
}
