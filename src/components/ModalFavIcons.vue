<script setup lang="ts">
import {Button, Dialog} from "primevue";
import {useFavIcons} from "../utils/useFavIcons.ts";
import {iconToSvgHtml} from "../utils/useIconView.ts";
import {TFavIcon} from "../utils/types.ts";
import {useToast} from "primevue/usetoast";

const visible = defineModel<boolean>()

const favs = useFavIcons()

console.log(favs.icons)

function toCol(ic: TFavIcon){
    return {
        id: ic.collection.id,
        data: {
            height: ic.collection.height,
            width: ic.collection.width,
        }
    } as any
}

const toast = useToast();
function copy(str: string) {
    navigator.clipboard.writeText(str).then(
        () => toast.add({severity: 'success', summary: 'Copied to clipboard!', life: 1000}),
        () => toast.add({severity: 'error', summary: 'Cannot copy to clipboard!', life: 1000})
    );
}

function unfav(ic: TFavIcon) {
    favs.remove(ic.icon)
    toast.add({severity: 'success', summary: 'Removed from favorites!', life: 1000})
}
</script>

<template>
    <Dialog v-model:visible="visible" modal header="Edit Profile"
            close-on-escape
            dismissable-mask
            style="min-width: 500px !important; max-width: 90%; max-height: 80vh;"
            content-class="overflow-y-auto h-full flex flex-col px-0"
            @after-hide="favs.resetFromStorage"
    >
        <template #header>
            <div class="inline-flex items-center justify-center gap-2">
                <span class="font-bold whitespace-nowrap">Favorite Icons</span>
            </div>
        </template>

        <template v-if="favs.icons">
            <div class="w-full flex gap-2 items-start h-full pt-5">
                <div class="w-full overflow-y-auto flex flex-col gap-1 px-4 h-full" style="max-height: 70vh">
                    <div class="w-full flex-1 overflow-auto scrollbar-thinner grid gap-2 items-center" style="grid-template-columns: auto 1fr max-content max-content max-content auto">
                        <template v-for="ic in favs.icons" :key="ic.icon.id">
                            <div class="text-4xl flex items-center z-[99999]" v-html="iconToSvgHtml(ic.icon, toCol(ic), {})"></div>
                            <span>{{ ic.collection.id }}</span>
                            <!--<div class="grid gap-2" style="grid-template-columns: repeat(3, max-content)">-->
                                <Button severity="secondary" class="flex-1 text-sm px-2 py-1.5 leading-none" @click="copy(ic.icon.id)">{{ ic.icon.id }}</Button>
                                <Button severity="secondary" class="flex-1 text-sm px-2 py-1.5 leading-none" @click="copy(`${ic.collection.id}--${ic.icon.id}`)">{{ ic.collection.id }}--{{ ic.icon.id }}</Button>
                                <Button severity="secondary" class="flex-1 text-sm px-2 py-1.5 leading-none" @click="copy(`icon-[${ic.collection.id}--${ic.icon.id}]`)">icon-[{{ ic.collection.id }}--{{ ic.icon.id }}]</Button>
                            <!--</div>-->
                            <!--<i></i>-->
                            <Button severity="danger" class="text-sm px-2 py-1.5 leading-none" size="small" @click="unfav(ic)">Unfav</Button>
                        </template>

                    </div>
                    <div v-if="!favs.icons.length" class="text-lg italic mt-3">
                        No favorite icons found...
                    </div>
                </div>
            </div>
        </template>
    </Dialog>
</template>