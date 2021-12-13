<template>
    <div class="tgx-image">
        <slot name="preview">
            <v-img
                class="tgx-image-preview"
                :src="media.file"
                max-width="300"
                max-height="250"
                contain
                @click="overlay = true"
            />
        </slot>
        <v-overlay v-if="overlay" z-index="998" opacity=".97">
            <v-img
                class="tgx-image-full"
                width="100vw"
                height="100vh"
                contain
                :src="media.file"
                @click="overlay = false"
            />
            <v-toolbar
                class="tgx-image-toolbar"
                color="transparent"
                elevation="0"
            >
                <v-toolbar-title>{{ filename }}</v-toolbar-title>
                <v-spacer />
                <v-btn icon tile :href="media.file" download>
                    <v-icon>mdi-download</v-icon>
                </v-btn>
                <v-btn icon tile @click="overlay = false">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>
        </v-overlay>
    </div>
</template>

<style lang="scss">
.tgx-image-preview {
    cursor: zoom-in;
}
.tgx-image-full {
    cursor: zoom-out;
}
.tgx-image-toolbar {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    mix-blend-mode: difference;
}
</style>

<script lang="ts">
import { MessageMedia } from '@/tgxviewer/types';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class TgxImage extends Vue {

    @Prop({ required: true })
    media!: MessageMedia;

    overlay = false;

    get filename(): string {
        return this.media.file?.split(/[\\/]/).pop() || '';
    }

}
</script>
