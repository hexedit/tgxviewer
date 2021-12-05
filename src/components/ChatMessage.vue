<template>
    <div :class="isService ? 'service-message' : 'chat-message'">
        <template v-if="isService">
            <span class="actor">
                {{ message.service.actor.name || 'Deleted Account' }}
            </span>
            &nbsp;
            <span class="action">{{ message.service.action }}</span>
            &nbsp;@&nbsp;
            <span class="date">
                {{ message.date.toLocaleString() }}
            </span>
        </template>
        <v-card v-else shaped elevation="1">
            <v-card-title>
                <v-avatar size="32" :color="fromColor">
                    <span>{{ fromTag }}</span>
                </v-avatar>
                <span class="from">
                    {{ message.from.name || 'Deleted Account' }}
                </span>
            </v-card-title>
            <v-card-subtitle>
                {{ message.date.toLocaleString() }}
                <span v-if="message.forwardedFrom">
                    &nbsp;:&nbsp;Forwarded from:
                    {{ message.forwardedFrom }}
                </span>
            </v-card-subtitle>
            <v-card-text v-html="messageText" />
        </v-card>
    </div>
</template>

<style lang="scss">
.service-message {
    text-align: center;
    font-style: italic;
    margin-top: 0.5em;

    .actor {
        font-weight: bold;
    }
}

.chat-message {
    margin: 0.5em;
    margin-bottom: 0;

    &:last-child {
        margin-bottom: 1em;
    }

    .from {
        margin-left: 0.5em;
    }

    img {
        max-height: 300px;

        &.sticker {
            max-height: 150px;
        }

        &.preview {
            max-height: 150px;
            display: block;
        }
    }
}
</style>

<script lang="ts">
import { Message } from '@/tgxviewer/types';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class ChatMessage extends Vue {

    @Prop({ required: true })
    message!: Message;

    get isService(): boolean {
        return this.message.type === 'service';
    }

    get fromTag(): string {
        return this.message.from.name[0];
    }

    get fromColor(): string {
        const colors = [
            'red',
            'pink',
            'purple',
            'deep-purple',
            'indigo',
            'blue',
            'light-blue',
            'cyan',
            'teal',
            'green',
            'light-green',
            'lime',
            'amber',
            'orange',
            'deep-orange',
            'brown',
            'blue-grey',
            'grey',
        ];
        return colors[this.message.from.id % colors.length];
    }

    get messageText(): string {
        switch (this.message.type) {

            case 'message':
                return this.makeText(this.message.text);
            case 'media':
                return this.makeMedia(this.message);

        }
        return `<div class="unsupported">Unsupported message type: ${this.message.type}</div>`;
    }

    private makeText(text: string | any[]): string {
        if (!text) return '';

        if (typeof text === 'string') {
            return text;
        }

        let result = '';
        for (const part of text) {
            if (typeof part === 'string') {
                result += part;
            }
            else {
                switch (part.type) {

                    case 'bold':
                        result += `<b>${part.text}</b>`;
                        break;
                    case 'link':
                        result += `<a href="${part.text}" target="_blank">${part.text}</a>`;
                        break;
                    case 'mention':
                        result += `<a href="http://t.me/${part.text.substring(
                            1
                        )}" target="_blank">${part.text.substring(1)}</a>`;
                        break;
                    case 'email':
                        result += `<a href="mailto:${part.text}">${part.text}</a>`;
                        break;
                    case 'pre':
                        result += `<pre>${part.text}</pre>`;
                        break;
                    case 'code':
                        result += `<code>${part.text}</code>`;
                        break;
                    case 'text_link':
                    case 'mention_name':
                    case 'phone':
                    case 'hashtag':
                    case 'bot_command':
                        result += `<a href="#!">${part.text}</a>`;
                        break;
                    default:
                        result += `<div class="unsupported"><code>['${part.text}' == ${part.type}]</code></div>`;

                }
            }
        }
        return result;
    }

    private makeMedia(message: Message) {
        if (!message.media) return '';

        let result = '';
        switch (message.media.type) {

            case 'sticker':
                result = `<img class="sticker" src="${message.media.file}" alt="${message.media.stickerEmoji}">`;
                break;
            case 'photo':
                result = `<img class="materialboxed" src="${message.media.file}" alt="">`;
                break;
            case 'voice_message':
            case 'audio_file':
                result = `<audio src="${message.media.file}" controls></audio>`;
                break;
            case 'animation':
            case 'video_message':
            case 'video_file':
                result = `<video ${
                    message.media.type === 'animation'
                        ? 'autoplay loop'
                        : 'controls'
                } width="400" height="300"><source src="${
                    message.media.file
                }"></video>`;
                break;
            case 'file': {
                if (!message.media.file) break;
                let preview = '';
                if (
                    message.media.mediaType &&
                    message.media.mediaType.startsWith('image/')
                ) {
                    preview = `<img class="preview" src="${
                        message.media.file
                    }" alt="${message.media.file.split(/[\\/]/).pop()}">`;
                }
                result = `<a href="${
                    message.media.file
                }" download>${preview}${message.media.file
                    .split(/[\\/]/)
                    .pop()}</a>`;
                break;
            }
            default:
                result = `<div class="unsupported">[MEDIA TYPE ${message.media.type}]</div>`;

        }
        if (message.text) {
            result = `<div>${result}</div><div>${this.makeText(
                message.text
            )}</div>`;
        }
        return result;
    }

}
</script>
