<template>
    <div class="chat-view full-height">
        <v-toolbar elevation="2" color="primary" class="white--text" dense>
            <v-toolbar-title>
                {{ chatName }}
            </v-toolbar-title>
        </v-toolbar>
        <chat-message
            v-for="message of messages"
            :key="message.id"
            :message="message"
        />
    </div>
</template>

<script lang="ts">
import ChatMessage from '@/components/ChatMessage.vue';
import { Chat, Message } from '@/tgxviewer/types';
import { Component, Vue, Watch } from 'vue-property-decorator';

@Component({
    components: {
        ChatMessage,
    },
})
export default class ChatView extends Vue {

    messages: Message[] = [];

    get chatId(): number {
        return parseInt(this.$route.params.id);
    }

    get chatName(): string {
        const chat = (this.$store.state.chats as Chat[]).find(
            (chat) => chat.id === this.chatId
        );
        if (chat?.type === 'saved_messages') {
            return 'Saved Messages';
        }
        return chat?.name || '';
    }

    async beforeMount(): Promise<void> {
        this.messages = await window.api.listMessages(this.chatId);
    }

    @Watch('chatId')
    async onChatChanged(): Promise<void> {
        this.messages = [];
        this.messages = await window.api.listMessages(this.chatId);
    }

}
</script>
