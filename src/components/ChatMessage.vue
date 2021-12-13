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
            <v-card-text>
                <v-alert v-if="quote" border="left" colored-border>
                    <v-card elevation="0">
                        <v-card-text style="margin: 0; padding: 0">
                            <h4 style="font-weight: bold;">
                                {{ quote.from.name }}
                                @
                                {{ quote.date.toLocaleString() }}
                            </h4>
                            <tgx-text
                                v-if="quote.type === 'message'"
                                :text="quote.text"
                            />
                            <tgx-media
                                v-else-if="quote.type === 'media'"
                                :media="quote.media"
                            />
                            <template v-else-if="quote.type === 'service'">
                                <span class="actor">
                                    {{
                                        quote.service.actor.name ||
                                            'Deleted Account'
                                    }}
                                </span>
                                &nbsp;
                                <span class="action">{{
                                    quote.service.action
                                }}</span>
                                &nbsp;@&nbsp;
                                <span class="date">
                                    {{ quote.date.toLocaleString() }}
                                </span>
                            </template>
                        </v-card-text>
                    </v-card>
                </v-alert>
                <tgx-text
                    v-if="message.type === 'message'"
                    :text="message.text"
                />
                <tgx-media
                    v-else-if="message.type === 'media'"
                    :media="message.media"
                />
                <v-alert v-else type="error">
                    Unsupported message type [{{ message.type }}]
                </v-alert>
            </v-card-text>
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
}
</style>

<script lang="ts">
import { Message } from '@/tgxviewer/types';
import { Component, Prop, Vue } from 'vue-property-decorator';
import TgxMedia from './Media.vue';
import TgxText from './Text.vue';

@Component({
    components: {
        TgxMedia,
        TgxText,
    },
})
export default class ChatMessage extends Vue {

    @Prop({ required: true })
    message!: Message;

    @Prop({ default: undefined })
    quote?: Message;

    get isService(): boolean {
        return this.message.type === 'service';
    }

    get fromTag(): string {
        if (!this.message.from.name) return '';
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

}
</script>
