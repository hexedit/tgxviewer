<template>
    <v-card shaped elevation="1" class="session-entry">
        <v-card-title>
            <v-icon>{{ icon }}</v-icon>
            <span class="date">
                {{ session.created.toLocaleString() }}
            </span>
        </v-card-title>
        <v-card-subtitle>
            {{ session.platform }}
            {{ session.deviceModel }}
            ({{ session.systemVersion }})
        </v-card-subtitle>
        <v-card-text>
            <div>
                {{ session.applicationName }}
                {{ session.applicationVersion }}
            </div>
            <dl>
                <dt>Last active:</dt>
                <dd>{{ session.lastActive.toLocaleString() }}</dd>
                <dt>Last IP:</dt>
                <dd>{{ session.lastIP }}</dd>
                <dt>Last location:</dt>
                <dd>
                    {{ session.lastCountry }}
                    {{ session.lastRegion }}
                </dd>
            </dl>
        </v-card-text>
    </v-card>
</template>

<style lang="scss">
.session-entry {
    margin: 0.5em;
    margin-bottom: 0;

    &:last-child {
        margin-bottom: 1em;
    }

    .date {
        margin-left: .5em;
    }

    dt {
        display: inline;
        font-style: italic;
    }

    dd {
        display: inline;
        font-weight: bold;
        margin-left: .5em;

        &::after {
            display: block;
            content: '';
        }
    }
}
</style>

<script lang="ts">
import { Session } from '@/tgxviewer/types';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class SessionEntry extends Vue {

    @Prop({ required: true })
    session!: Session;

    get icon(): string {
        if (this.session.deviceModel.startsWith('PC')) {
            return 'mdi-monitor';
        }
        if (this.session.platform.startsWith('Android')) {
            return 'mdi-android';
        }
        return 'mdi-cellphone';
    }

}
</script>
