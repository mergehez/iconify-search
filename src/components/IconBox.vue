<script setup lang="ts">
import {TIcon, TIconSetWithIconData} from "../utils/types.ts";
import {watch} from "vue";
import {iconToSvgHtml} from "../utils/useIconView.ts";

const props = defineProps<{
    index: number,
    icon: TIcon,
    collection: TIconSetWithIconData,
    activeSetId?: string,
    active?: boolean,
    color?: string,
}>()
const svgHtml = defineModel<string>('svgHtml', {
    required: false
})
defineEmits<{
    click: [icon: TIcon]
}>();

function generateSvgHtml(p: typeof props) {
    const body = p.icon.body.replace(/"currentColor"/g, '"' + (p.color ?? 'currentColor') + '"')
    return `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" :viewBox="toViewBox(icon)">${body}</svg>`
}

if (!svgHtml.value) {
    svgHtml.value = generateSvgHtml(props)
}

watch(() => props.color, () => {
    svgHtml.value = generateSvgHtml(props)
})
</script>

<template>
    <button
        class="icw"
        :id="`${collection.id}-${icon.first ? '_first' : icon.id}`"
        :class="{
            'opacity-10' : activeSetId && activeSetId != collection.id,
            'active' : active,
        }"
        @click.prevent="$emit('click', icon)"
    >
        <!--@click.prevent="copyToClipboard(icon)"-->
        <span v-if="index > 0 && icon.first" class="vr"></span>
        <div v-html="iconToSvgHtml(icon, collection, {color})"></div>

        <span v-if="collection.id == 'fluent'" class="absolute top-1 right-1 text-2xs leading-none opacity-30">{{ icon.height ?? collection.data.height }}</span>
        <!--<span v-if="showCopied" class="absolute text-center text-xs leading-none text-green-50 py-1.5 px-1 bg-green-600 rounded-md">Copied!</span>-->
    </button>
</template>

<style>
.icw {
    @apply text-5xl grid place-items-center relative p-2 ;
    @apply outline -outline-offset-4 outline-transparent hover:outline-green-500;
    @apply transition-[outline-color] duration-150;
}

.icw.active {
    @apply outline-green-500;
}

.icw:not(:hover) > .vr {
    @apply absolute -left-1 border-l-4 border-neutral-700 h-4 self-center;
    margin-left: 2px;
}

.tt {
    @apply bg-neutral-600 text-neutral-100 border border-neutral-500 p-1 rounded-md;
    @apply text-xs whitespace-nowrap;
    @apply transition-all duration-1000;
}

</style>