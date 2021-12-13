<template>
    <tgx-sticker v-if="type === 'sticker'" :media="media" />
    <tgx-image v-else-if="type === 'image'" :media="media" />
    <audio v-else-if="type === 'audio'" :src="media.file" controls />
    <video
        v-else-if="type === 'video'"
        :autoplay="isAnimation"
        :loop="isAnimation"
        :controls="!isAnimation"
        width="400"
        height="300"
    >
        <source :src="media.file" />
    </video>
    <v-btn
        v-else-if="type === 'file'"
        text
        class="file"
        :href="media.file"
        download
    >
        <v-icon>mdi-download</v-icon>
        {{ filename }}
    </v-btn>
    <v-alert v-else border="left" colored-border type="warning">
        Unsupported media type [{{ media.type }}]
    </v-alert>
</template>

<style lang="scss">
.file {
    text-transform: none;
}
</style>

<script lang="ts">
import { MessageMedia } from '@/tgxviewer/types';
import { Component, Prop, Vue } from 'vue-property-decorator';
import TgxImage from './Image.vue';
import TgxSticker from './Sticker.vue';

@Component({
    components: {
        TgxSticker,
        TgxImage,
    },
})
export default class TgxMedia extends Vue {

    @Prop({ required: true })
    media!: MessageMedia;

    get type(): string | undefined {
        switch (this.media.type) {

            case 'sticker':
                return 'sticker';
            case 'photo':
                return 'image';
            case 'voice_message':
            case 'audio_file':
                return 'audio';
            case 'animation':
            case 'video_message':
            case 'video_file':
                return 'video';
            case 'file': {
                if (!this.media.file) break;
                if (
                    this.media.mediaType &&
                    this.media.mediaType.startsWith('image/')
                ) {
                    return 'image';
                }
                return 'file';
            }

        }
    }

    get isAnimation(): boolean {
        return this.media.type === 'animation';
    }

    get filename(): string {
        return this.media.file?.split(/[\\/]/).pop() || '';
    }

}
</script>
