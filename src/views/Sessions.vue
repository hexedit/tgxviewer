<template>
    <div class="sessions-view">
        <v-toolbar elevation="2" color="primary" class="white--text" dense>
            <v-toolbar-title>
                Sessions
            </v-toolbar-title>
        </v-toolbar>
        <session-entry
            v-for="session of sessions"
            :key="session.created.valueOf()"
            :session="session"
        />
    </div>
</template>

<script lang="ts">
import SessionEntry from '@/components/SessionEntry.vue';
import { Session } from '@/tgxviewer/types';
import { Component, Vue } from 'vue-property-decorator';

@Component({
    components: {
        SessionEntry,
    },
})
export default class SessionsView extends Vue {

    get sessions(): Session[] {
        return this.$store.state.sessions;
    }

}
</script>
