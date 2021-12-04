import * as path from 'path';
import * as fs from 'fs/promises';
import {
    PersonalInformation,
    Session,
    Chat,
    ChatMessages,
    Message,
    MessageMedia,
    ServiceMessage,
} from './types';

export class TelegramExport {

    private folder?: string;
    private personal?: PersonalInformation;
    private sessions: Session[] = [];
    private chats: Chat[] = [];
    private messages?: ChatMessages;

    public path(...args: any[]): string {
        if (!this.folder) return '';
        return path.resolve(this.folder, ...args);
    }

    public listChats(): Chat[] {
        return this.chats;
    }

    public listMessages(chatId: number): Message[] {
        if (!chatId || !this.messages) return [];
        return this.messages[chatId];
    }

    public messageCount(chatId: number): number {
        if (!chatId || !this.messages) return 0;
        return this.messages[chatId].length;
    }

    public listSessions(): Session[] {
        return this.sessions;
    }

    public get sessionCount(): number {
        return this.sessions.length;
    }

    public get userId(): number | undefined {
        if (!this.personal) return;
        return this.personal.userId;
    }

    public get userName(): string | undefined {
        if (!this.personal) return;
        return this.personal.username;
    }

    public get phoneNumber(): string | undefined {
        if (!this.personal) return;
        return this.personal.phoneNumber;
    }

    public get firstName(): string | undefined {
        if (!this.personal) return;
        return this.personal.firstName;
    }

    public get lastName(): string | undefined {
        if (!this.personal) return;
        return this.personal.lastName;
    }

    public get fullName(): string | undefined {
        if (!this.personal) return;
        if (!this.personal.firstName) return this.personal.lastName;
        if (!this.personal.lastName) return this.personal.firstName;
        return `${this.personal.firstName} ${this.personal.lastName}`;
    }

    public get profilePicture(): string | undefined {
        if (!this.personal) return;
        return this.personal.profilePicture;
    }

    public async open(folder: string): Promise<boolean> {
        try {
            const tgx = JSON.parse(
                await fs.readFile(path.resolve(folder, 'result.json'), 'utf-8')
            );
            this.folder = folder;

            const personal: PersonalInformation = {
                userId: tgx.personal_information.user_id,
                username: tgx.personal_information.username,
                firstName: tgx.personal_information.first_name,
                lastName: tgx.personal_information.last_name,
                phoneNumber: tgx.personal_information.phone_number,
                profilePicture: this.path(tgx.profile_pictures.pop().photo),
            };

            const sessions = [];
            for (const tgxSession of tgx.sessions.list) {
                sessions.push({
                    created: new Date(tgxSession.created),
                    platform: tgxSession.platform,
                    deviceModel: tgxSession.device_model,
                    systemVersion: tgxSession.system_version,
                    applicationName: tgxSession.application_name,
                    applicationVersion: tgxSession.application_version,
                    lastActive: new Date(tgxSession.last_active),
                    lastIP: tgxSession.last_ip,
                    lastCountry: tgxSession.last_country,
                    lastRegion: tgxSession.last_region,
                });
            }

            const chats = [];
            const messages: ChatMessages = {};
            for (const tgxChat of tgx.chats.list) {
                chats.push({
                    id: tgxChat.id,
                    name: tgxChat.name,
                    type: tgxChat.type,
                    icon: null,
                });
                messages[tgxChat.id] = [];
                for (const tgxMessage of tgxChat.messages) {
                    try {
                        const message: Message = {
                            id: tgxMessage.id,
                            type: tgxMessage.type,
                            date: new Date(tgxMessage.date),
                            from: {
                                id: tgxMessage.from_id,
                                name: tgxMessage.from,
                            },
                            text: tgxMessage.text,
                            forwardedFrom: tgxMessage.forwarded_from,
                        };

                        if (tgxMessage.type === 'service') {
                            const service: ServiceMessage = {
                                action: tgxMessage.action,
                                actor: {
                                    id: tgxMessage.actor_id,
                                    name: tgxMessage.actor,
                                },
                            };
                            Object.assign(message, {
                                service,
                            });
                        }

                        if (tgxMessage.media_type) {
                            const media: MessageMedia = {
                                type: tgxMessage.media_type,
                                stickerEmoji: tgxMessage.sticker_emoji,
                                width: tgxMessage.width,
                                height: tgxMessage.height,
                                file: tgxMessage.file
                                    ? this.path(tgxMessage.file)
                                    : undefined,
                            };
                            Object.assign(message, {
                                type: 'media',
                                media,
                            });
                        }
                        else if (tgxMessage.file) {
                            Object.assign(message, {
                                type: 'media',
                                media: {
                                    type: 'file',
                                    mediaType: tgxMessage.mime_type,
                                    file: this.path(tgxMessage.file),
                                },
                            });
                        }
                        else if (tgxMessage.photo) {
                            Object.assign(message, {
                                type:
                                    tgxMessage.type === 'service'
                                        ? tgxMessage.type
                                        : 'media',
                                media: {
                                    type: 'photo',
                                    file: this.path(tgxMessage.photo),
                                    width: tgxMessage.width,
                                    height: tgxMessage.height,
                                },
                            });
                        }

                        messages[tgxChat.id].push(message);
                    }
                    catch (err) {
                        console.warn(`Message parse error: ${err}`);
                    }
                }
            }

            this.personal = personal;
            this.sessions = sessions;
            this.chats = chats;
            this.messages = messages;
        }
        catch (err) {
            console.error(`Export parse error: ${err}`);
            return false;
        }
        return true;
    }

}
