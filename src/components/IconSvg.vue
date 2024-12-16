<script setup lang="ts">
import {TIcon, TIconSetWithIconData} from "../utils/types.ts";
import {computed, watch} from "vue";

const props = withDefaults(defineProps<{
    color?: string,
    size?: string,
    icon: TIcon
    collection: TIconSetWithIconData
}>(), {
    size: '1em',
    color: 'currentColor'
})

const svgHtml = defineModel<string>('svgHtml', {
    required: false
})

const h = computed(() => props.collection?.data.height);
const w = computed(() => props.collection?.data.width);

function toViewBox(icon: TIcon) {
    return `${icon.left ?? 0} ${icon.top ?? 0} ${icon.width ?? w.value ?? 16} ${icon.height ?? h.value ?? 16}`
}

function generateSvgHtml(p: typeof props) {
    const body = p.icon.body.replace(/"currentColor"/g, '"' + (p.color) + '"')
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${p.size}" height="${p.size}" :viewBox="${toViewBox(p.icon)}">\n\t${body}\n</svg>`
}

if (!svgHtml.value) {
    svgHtml.value = generateSvgHtml(props)
}

watch(() => props.color, () => svgHtml.value = generateSvgHtml(props))
watch(() => props.size, () => svgHtml.value = generateSvgHtml(props))
watch(() => props.icon, () => svgHtml.value = generateSvgHtml(props))


const svgBody = computed(() => {
    return props.icon.body.replace(/"currentColor"/g, '"' + (props.color) + '"')
})
</script>

<template>
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" :viewBox="toViewBox(icon)" v-html="svgBody"></svg>
</template>