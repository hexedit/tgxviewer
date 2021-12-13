<template>
    <v-img
        :src="file"
        :alt="media.stickerEmoji"
        max-width="200"
        max-height="150"
        contain
    />
</template>

<script lang="ts">
import { MessageMedia } from '@/tgxviewer/types';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class TgxSticker extends Vue {

    @Prop({ required: true })
    media!: MessageMedia;

    get file(): string {
        if (!this.media.file) return '';
        if (this.media.file.endsWith('.tgs')) {
            return this.media.file + '_thumb.jpg';
        }
        return this.media.file;
    }

}
</script>
