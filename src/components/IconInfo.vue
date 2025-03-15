<script setup lang="ts">

import {computed, ref} from "vue";
import {Button, Popover, Select, Textarea, SelectButton, Checkbox} from "primevue";
import ColorPicker from "@mergehez/vue-color-picker"
import {useToast} from 'primevue/usetoast';
import {animationTypes, useIconView} from "../utils/useIconView.ts";
import TailwindColorPicker from "./TailwindColorPicker.vue";
import {useFavIcons} from "../utils/useFavIcons.ts";

const iconView = useIconView();
const svgInfo = computed(() => iconView.options)
const refColorPopover = ref<InstanceType<typeof Popover>>()
const toast = useToast();

const favIcons = useFavIcons()

function copy(str: string) {
    navigator.clipboard.writeText(str).then(
        () => toast.add({severity: 'success', summary: 'Copied to clipboard!', life: 1000}),
        () => toast.add({severity: 'error', summary: 'Cannot copy to clipboard!', life: 1000})
    );
}

const showTwColorPicker = ref(false)
function onTwColorSelect(key: string, hex: string, shade: number){
    iconView.options.twColor = {key, hex, shade};
    console.log(hex)
}
</script>

<template>
    <div v-if="iconView.icon && iconView.collection" class="flex items-start w-full gap-2 px-5 bg-surface-900 border-t-2 rounded-t-3xl border-surface-600 py-5">
        <div class="flex flex-col gap-2 items-center">
            <div class="text-8xl flex items-center h-auto border border-surface-700 z-[99999]" v-html="iconView.tab == 'css' ? iconView.asSpan : iconView.asSvgHtml"></div>
            <template v-if="iconView.tab == 'css'">
                <component is="style">
                    {{iconView.svgStyleOnTheFly}}
                </component>
            </template>
            <div class="flex gap-1 items-center">
                <Checkbox
                    binary
                    :model-value="favIcons.has(iconView.icon)"
                    @update:model-value="v => v ? favIcons.add(iconView.icon, iconView.collection) : favIcons.remove(iconView.icon)"
                    input-id="fav-checkbox"
                    class="!size-5"
                />
                <label for="fav-checkbox">
                    Fav
                </label>
            </div>
        </div>
        <div class="flex-1 flex flex-col pl-5">
            <div class="flex gap-1 pl-16 mb-4 items-center">
                <span class="opacity-70 pr-2">Copy:</span>
                <button class="text-base font-bold border border-surface-800 px-3 py-2 leading-none rounded-md" @click="copy(iconView.icon.id)">{{ iconView.icon.id }}</button>
                -
                <button class="text-base font-bold border border-surface-800 px-3 py-2 leading-none rounded-md" @click="copy(`${iconView.collection.id}--${iconView.icon.id}`)">{{ iconView.collection.id }}--{{ iconView.icon.id }}</button>
                -
                <button class="text-base font-bold border border-surface-800 px-3 py-2 leading-none rounded-md" @click="copy(`icon-[${iconView.collection.id}--${iconView.icon.id}]`)">icon-[{{ iconView.collection.id }}--{{ iconView.icon.id }}]</button>
                <Button severity="secondary" size="small" @click="iconView.clearIcon()" class="size-8 p-0 ml-auto rounded-full">
                    <i class="icon icon-[ic--round-close] text-lg"></i>
                </Button>
            </div>
            <div class="flex items-stretch">
                <div class="flex flex-col pt-5 items-end">
                    <button class="rounded-l-md border -mr-px z-10 px-3 py-1" @click="iconView.tab = 'css'" :class="iconView.tab == 'css' ? 'border-neutral-500 border-r-neutral-800 bg-neutral-800' : 'border-transparent'">CSS</button>
                    <button class="rounded-l-md border -mr-px z-10 px-3 py-1" @click="iconView.tab = 'svg'" :class="iconView.tab == 'svg' ? 'border-neutral-500 border-r-neutral-800 bg-neutral-800' : 'border-transparent'">SVG</button>
                    <!--<button class="rounded-l-md border -mr-px z-10 px-3 py-1" @click="leftTab = 'cmp'" :class="leftTab == 'cmp' ? 'border-neutral-500 border-r-neutral-800 bg-neutral-800' : 'border-transparent'">Components</button>-->
                </div>
                <div class="flex-1 border border-neutral-500 rounded-md px-4 py-2 flex gap-2">
                    <template v-if="iconView.tab == 'svg'">
                        <div class="grid items-center place-content-start gap-1.5" style="grid-template-columns: auto 1fr">
                            <span>Color: </span>
                            <div class="">
                                <Button class="w-32 bg-surface-950 hover:bg-surface-900 justify-start" :label="svgInfo.color" severity="secondary" size="small" @click="refColorPopover?.toggle($event)"/>
                                <Popover ref="refColorPopover" class="p-0">
                                    <div class="w-full text-center pt-2">
                                        <Button label="current color" severity="info" class="py-0 mb-2" @click="svgInfo.color = 'currentColor'; refColorPopover?.toggle($event)"/>

                                    </div>
                                    <ColorPicker v-model="svgInfo.color"/>
                                </Popover>
                            </div>
                            <span>Size: </span>
                            <div class="">
                                <Select class="w-32" overlay-class="p-select-sm" v-model="svgInfo.size" editable size="small" label-class="py-0 leading-none" :options="['16px', '32px', '64px', '128px', '1em', '1.2em', '2em']"/>
                            </div>
                            <span>Tw-animation: </span>
                            <div class="">
                                <Select class="w-32" overlay-class="p-select-sm" v-model="svgInfo.animation" size="small" label-class="py-0 leading-none" :options="animationTypes as any" option-value="value" option-label="label"/>
                            </div>
                        </div>
                        <div class="flex-1">
                            <Textarea :model-value="iconView.asSvgHtml" @click="copy(iconView.asSvgHtml)" readonly rows="10" class="w-full cursor-context-menu text-surface-100"/>
                        </div>
                    </template>
                    <template v-if="iconView.tab == 'css'">
                        <div class="grid gap-x-3 gap-y-1 w-full items-center" style="grid-template-columns: auto 1fr">
                            <span>Tw-animation: </span>
                            <div>
                                <SelectButton size="small" v-model="svgInfo.animation" :options="animationTypes as any" option-value="value" option-label="label"/>
                            </div>
                            <span>Tw-size: </span>
                            <div>
                                <SelectButton size="small" v-model="svgInfo.twSize" :options="['none', 'text-xs', 'text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl', 'text-3xl', 'text-4xl']"/>
                            </div>
                            <span>Tw-color: </span>
                            <div>
                                <Button class="w-32 bg-surface-950 hover:bg-surface-900 justify-start" :label="svgInfo.twColor ? svgInfo.twColor.key + ' ' + svgInfo.twColor.shade :''" severity="secondary" size="small" @click="showTwColorPicker = true"/>
                            </div>
                            <span>Wrapper: </span>
                            <div>
                                <SelectButton size="small" v-model="svgInfo.wrapper" :options="['none', 'div', 'button']"/>
                                <!--<Checkbox v-model="svgInfo.wrapper" size="large" binary/>-->
                            </div>

                            <div class="col-span-2">
                                <Textarea :model-value="iconView.asSpan" @click="copy(iconView.asSpan)" readonly :rows="svgInfo.wrapper && svgInfo.wrapper != 'none' ? 3 : 1" class="w-full cursor-context-menu text-surface-100"/>
                                <Textarea :model-value="iconView.asI" @click="copy(iconView.asI)" readonly :rows="svgInfo.wrapper && svgInfo.wrapper != 'none' ? 3 : 1" class="w-full cursor-context-menu text-surface-100"/>
                            </div>
                        </div>
                    </template>
                </div>
            </div>
        </div>

        <TailwindColorPicker v-model:visible="showTwColorPicker" @selected="onTwColorSelect" @unselect="svgInfo.twColor = undefined"/>
    </div>
</template>