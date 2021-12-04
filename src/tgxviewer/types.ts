export interface PersonalInformation {
    userId: number;
    username: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    profilePicture: string;
}

export interface Session {
    created: Date;
    platform: string;
    deviceModel: string;
    systemVersion: string;
    applicationName: string;
    applicationVersion: string;
    lastActive: Date;
    lastIP: string;
    lastCountry: string;
    lastRegion: string;
}

export interface Chat {
    id: number;
    name: string;
    type: string;
    icon: string | null;
}

export interface MessageMedia {
    type: string;
    mediaType?: string;
    stickerEmoji?: string;
    width?: number;
    height?: number;
    file?: string;
}

export interface ServiceMessage {
    action: string;
    actor: {
        id: number;
        name: string;
    };
}

export interface Message {
    id: number;
    type: string;
    date: Date;
    from: {
        id: number;
        name: string;
    };
    text: string | Array<any>;
    forwardedFrom?: string;
    media?: MessageMedia;
    service?: ServiceMessage;
}

export type ChatMessages = { [key: number]: Array<Message> };
