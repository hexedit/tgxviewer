<template>
    <div type="message-text">
        <template v-for="(p, px) of parts">
            <a
                v-if="p.link"
                :key="px"
                :class="p.type"
                :href="p.link.url"
                :target="p.link.external ? '_blank' : undefined"
            >
                {{ p.text }}
            </a>
            <pre v-else-if="p.type === 'pre'" :key="px">
                {{ p.text }}
            </pre>
            <code v-else-if="p.type === 'code'" :key="px">
                {{ p.text }}
            </code>
            <span v-else :key="px" :class="p.type" v-html="p.text" />
        </template>
    </div>
</template>

<style lang="scss">
.message-text {
    .bold {
        font-weight: bold;
    }
}
</style>

<script lang="ts">
import { TextPart } from '@/tgxviewer/types';
import { Component, Prop, Vue } from 'vue-property-decorator';

interface Part {
    type: string;
    text: string;
    link?: {
        url: string;
        external?: boolean;
    };
}

@Component
export default class TgxMessage extends Vue {

    @Prop({ required: true })
    text!: string | TextPart[];

    get parts(): Part[] {
        const parts: TextPart[] =
            typeof this.text === 'string' ? [this.text] : this.text;
        const ret: Part[] = [];
        for (const part of parts) {
            if (typeof part === 'string') {
                ret.push({
                    type: 'text',
                    text: part.replace(/[\r\n]+/g, '<br>'),
                });
            }
            else {
                const parsed: Part = {
                    type: part.type,
                    text: part.text,
                };
                switch (part.type) {

                    case 'link': {
                        parsed.link = {
                            url: part.text,
                            external: true,
                        };
                        break;
                    }

                    case 'email': {
                        parsed.link = {
                            url: `mailto:${part.text}`,
                        };
                        break;
                    }

                    case 'mention': {
                        parsed.text = part.text.substring(1);
                        parsed.link = {
                            url: `https://t.me/${parsed.text}`,
                            external: true,
                        };
                        break;
                    }

                    case 'text_link':
                    case 'mention_name':
                    case 'phone':
                    case 'hashtag':
                    case 'bot_command': {
                        parsed.link = {
                            url: '#!',
                        };
                        break;
                    }

                }
                ret.push(parsed);
            }
        }
        return ret;
    }

}
</script>
