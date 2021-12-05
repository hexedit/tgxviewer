<template>
    <v-app>
        <v-app-bar app color="primary" dark>
            <div class="d-flex align-center">
                <v-toolbar-title>{{ title }}</v-toolbar-title>
            </div>

            <v-spacer></v-spacer>

            <v-btn icon @click="openFolder">
                <v-icon>mdi-folder-open</v-icon>
            </v-btn>
        </v-app-bar>

        <v-navigation-drawer app permanent width="30%" v-if="isLoaded">
            <template slot="prepend">
                <v-list-item three-line>
                    <v-list-item-avatar>
                        <img :src="profilePicture" />
                    </v-list-item-avatar>
                    <v-list-item-content>
                        <v-list-item-title>
                            {{ username }}
                        </v-list-item-title>
                        <v-list-item-subtitle>
                            {{ fullname }}
                        </v-list-item-subtitle>
                        <v-list-item-subtitle>
                            <a :href="path" target="_blank">
                                {{ path }}
                            </a>
                        </v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
                <v-divider />
                <v-list-item dense :to="{ name: 'Sessions' }">
                    <v-list-item-icon>
                        <v-icon>mdi-monitor-multiple</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>Sessions</v-list-item-title>
                    <v-list-item-action-text>
                        {{ sessionsCount }}
                    </v-list-item-action-text>
                </v-list-item>
                <v-list-item
                    dense
                    v-if="savedMessages"
                    :to="{
                        name: 'Chat',
                        params: { id: savedMessages.id },
                    }"
                >
                    <v-list-item-icon>
                        <v-icon>mdi-content-save</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>Saved Messages</v-list-item-title>
                    <v-list-item-action-text>
                        {{ savedMessages.count }}
                    </v-list-item-action-text>
                </v-list-item>
                <v-divider />
            </template>
            <v-list dense>
                <v-list-item
                    v-for="chat of chats"
                    :key="chat.id"
                    :to="{
                        name: 'Chat',
                        params: { id: chat.id },
                    }"
                >
                    <v-list-item-avatar>
                        <v-icon>{{ chat.icon }}</v-icon>
                    </v-list-item-avatar>
                    <v-list-item-title>{{ chat.name }}</v-list-item-title>
                    <v-list-item-action-text>
                        {{ chat.count }}
                    </v-list-item-action-text>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>

        <v-main>
            <router-view />
        </v-main>
    </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Chat } from './tgxviewer/types';

@Component
export default class App extends Vue {

    title = document.title;

    get isLoaded(): boolean {
        return this.$store.state.userId !== null;
    }

    get path(): string {
        return this.$store.state.path;
    }

    get profilePicture(): string {
        return this.$store.state.profilePicture;
    }

    get username(): string {
        return this.$store.state.userName;
    }

    get fullname(): string {
        return this.$store.state.fullName;
    }

    get chats(): Chat[] {
        return (this.$store.state.chats as Chat[])
            .filter((chat) => chat.type !== 'saved_messages')
            .map<Chat>((chat) => {
                let icon = 'mdi-chat';
                if (!chat.name) {
                    icon = 'mdi-alert-octagon';
                }
                else if (chat.type.includes('personal')) {
                    icon = 'mdi-account';
                }
                else if (chat.type.includes('channel')) {
                    icon = 'mdi-access-point';
                }
                else if (chat.type.includes('group')) {
                    icon = 'mdi-account-multiple';
                }
                return {
                    id: chat.id,
                    name: chat.name || 'Deleted Account',
                    type: chat.type,
                    icon,
                    count: chat.count,
                };
            });
    }

    get sessionsCount(): number {
        return this.$store.state.sessions.length;
    }

    get savedMessages(): Chat | undefined {
        return (this.$store.state.chats as Chat[]).find(
            (chat) => chat.type === 'saved_messages'
        );
    }

    openFolder(): void {
        this.$store.dispatch('openFolder');
    }

}
</script>
