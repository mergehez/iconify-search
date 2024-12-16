<script setup lang="ts">

import {TIcon, TIconSetWithIconData} from "../utils/types.ts";
import {reactive, ref, watchEffect} from "vue";
import {Button, Checkbox, Popover, Select, Textarea} from "primevue";
import ColorPicker from "@mergehez/vue-color-picker"
import IconSvg from "./IconSvg.vue";
import {useToast} from 'primevue/usetoast';

const props = defineProps<{
    icon: TIcon,
    collection: TIconSetWithIconData,
}>()

const emit = defineEmits<{
    close: []
}>();

const leftTab = ref('css')
const svgInfo = reactive({
    color: 'currentColor',
    size: '1em',
    html: undefined as string | undefined,
    twSize: 'none',
    asSpan: '',
    asI: '',
    wrapper: false
})
const refColorPopover = ref<InstanceType<typeof Popover>>()
const toast = useToast();

watchEffect(() => {
    let cls = `icon icon-[${props.collection.id}--${props.icon.id}]`
    const sizeClass = svgInfo.twSize && svgInfo.twSize != 'none' ? ` ${svgInfo.twSize}` : '';
    let ws = '', we = '';
    if (svgInfo.wrapper) {
        ws = sizeClass ? `<div class="${sizeClass.trim()}">\n\t` : `<div>\n\t`
        we = '\n</div>'
    } else {
        cls += sizeClass
    }
    svgInfo.asSpan = ws + `<span class="${cls}"></span>` + we
    svgInfo.asI = ws + `<i class="${cls}"></i>` + we
})

function copy(str: string) {
    navigator.clipboard.writeText(str).then(
        () => toast.add({severity: 'success', summary: 'Copied to clipboard!', life: 1000}),
        () => toast.add({severity: 'error', summary: 'Cannot copy to clipboard!', life: 1000})
    );
}
</script>

<template>
    <div class="flex items-start w-full gap-2 px-5 bg-surface-900 border-t-2 rounded-t-3xl border-surface-600 py-5">
        <div class="text-8xl mr-5 border border-surface-700">
            <!--<IconBox :index="0" :icon="icon" :collection="collection" :color="svgInfo.color" v-model:svg-body="svgInfo.html"/>-->
            <IconSvg
                :icon="icon"
                :collection="collection"
                :color="svgInfo.color"
                :size="svgInfo.size"
                v-model:svg-html="svgInfo.html"/>
        </div>
        <div class="flex-1 flex flex-col">
            <div class="flex gap-4 pl-16 mb-4 items-center">
                <button class="text-lg font-bold border border-surface-800 px-3 py-2 leading-none rounded-md" @click="copy(icon.id)">{{ icon.id }}</button>
                -
                <button class="text-lg font-bold border border-surface-800 px-3 py-2 leading-none rounded-md" @click="copy(`icon-[${collection.id}--${icon.id}]`)">icon-[{{ collection.id }}--{{ icon.id }}]</button>
                <!--close-->
                <Button severity="secondary" size="small" @click="emit('close')" class="size-8 p-0 ml-auto rounded-full">
                    <i class="icon icon-[ic--round-close] text-lg"></i>
                </Button>
            </div>
            <div class="flex items-stretch">
                <div class="flex flex-col pt-5 items-end">
                    <button class="rounded-l-md border -mr-px z-10 px-3 py-1" @click="leftTab = 'css'" :class="leftTab == 'css' ? 'border-neutral-500 border-r-neutral-800 bg-neutral-800' : 'border-transparent'">CSS</button>
                    <button class="rounded-l-md border -mr-px z-10 px-3 py-1" @click="leftTab = 'svg'" :class="leftTab == 'svg' ? 'border-neutral-500 border-r-neutral-800 bg-neutral-800' : 'border-transparent'">SVG</button>
                    <!--<button class="rounded-l-md border -mr-px z-10 px-3 py-1" @click="leftTab = 'cmp'" :class="leftTab == 'cmp' ? 'border-neutral-500 border-r-neutral-800 bg-neutral-800' : 'border-transparent'">Components</button>-->
                </div>
                <div class="flex-1 border border-neutral-500 rounded-md px-4 py-2 flex gao-2">
                    <template v-if="leftTab == 'svg'">
                        <div class="flex flex-col gap-1.5">
                            <div class="flex items-center">
                                <span class="w-16">Color: </span>
                                <Button class="w-32 bg-surface-950 hover:bg-surface-900 justify-start" :label="svgInfo.color" severity="secondary" size="small" @click="refColorPopover?.toggle($event)"/>
                                <!--<Select v-model="svgInfo.size" editable size="small" :options="['16px', '32px', '64px', '128px', '1em', '1.2em', '2em']" />-->
                                <Popover ref="refColorPopover" class="p-0">
                                    <div class="w-full text-center pt-2">
                                        <Button label="current color" severity="info" class="py-0 mb-2" @click="svgInfo.color = 'currentColor'; refColorPopover?.toggle($event)"/>

                                    </div>
                                    <ColorPicker v-model="svgInfo.color"/>
                                </Popover>
                            </div>
                            <div class="flex items-center">
                                <span class="w-16">Size: </span>
                                <Select class="w-32" overlay-class="p-select-sm" v-model="svgInfo.size" editable size="small" label-class="py-0 leading-none" :options="['16px', '32px', '64px', '128px', '1em', '1.2em', '2em']"/>
                            </div>
                        </div>
                        <div class="flex-1">
                            <Textarea :model-value="svgInfo.html" @click="copy(svgInfo.html!)" readonly rows="10" class="w-full cursor-context-menu text-surface-100"/>
                        </div>
                    </template>
                    <template v-if="leftTab == 'css'">
                        <div class="flex flex-col gap-1 w-full">
                            <div class="flex items-center">
                                <span class="w-20">Tw-size: </span>
                                <Select class="w-32" overlay-class="p-select-sm" v-model="svgInfo.twSize" editable size="small" label-class="py-0 leading-none" :options="['none', 'text-xs', 'text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl', 'text-3xl', 'text-4xl']"/>
                            </div>
                            <div class="flex items-center">
                                <span class="w-20">Wrapper: </span>
                                <Checkbox v-model="svgInfo.wrapper" size="large" binary/>
                            </div>
                            <Textarea :model-value="svgInfo.asSpan" @click="copy(svgInfo.asSpan)" readonly :rows="svgInfo.wrapper ? 3 : 1" class="w-full cursor-context-menu text-surface-100"/>
                            <Textarea :model-value="svgInfo.asI" @click="copy(svgInfo.asI)" readonly :rows="svgInfo.wrapper ? 3 : 1" class="w-full cursor-context-menu text-surface-100"/>
                        </div>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>