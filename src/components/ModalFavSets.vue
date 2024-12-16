<script setup lang="ts">
import {Button, Dialog, InputText} from "primevue";
import {api} from "../utils/api.ts";
import {useFavSets} from "../utils/useFavSets.ts";
import {TIconSet} from "../utils/types.ts";
import {computed, ref} from "vue";
import {vAutoAnimate} from "@formkit/auto-animate";
import {VueDraggable} from 'vue-draggable-plus'

const visible = defineModel<boolean>()
const emit = defineEmits<{
    saved: []
}>();


const favs = useFavSets()
const allSets = ref<Record<string, TIconSet>>();
api.getIconSets().then(sets => allSets.value = sets)

const query = ref('')
const showIds = ref(true)
const sortedAllSetKeys = computed(() => {
    if (!allSets.value) return []
    return Object.entries(allSets.value)
        .map(([key, value]) => ({key, name: value.name}))
        .sort((a, b) => {
            const favA = favs.has(a.key), favB = favs.has(b.key)
            if (favA && !favB) return -1
            if (!favA && favB) return 1
            if (showIds.value) return a.key.localeCompare(b.key);
            return a.name.localeCompare(b.name);
        })
})

function move(id: string, toFavs = true) {
    if (toFavs) favs.add(id)
    else favs.remove(id)
}

function close() {
    favs.resetFromStorage()
    visible.value = false
}

function save() {
    favs.updateStorage()
    visible.value = false
    emit('saved')
}
</script>

<template>
    <Dialog v-model:visible="visible" modal header="Edit Profile"
            :content-style="{ width: '75vw', maxHeight: '80vh' }"
            content-class="overflow-y-auto h-full flex flex-col px-0 pb-0"
            @close="close"
            @after-hide="favs.resetFromStorage"

    >
        <template #header>
            <div class="inline-flex items-center justify-center gap-2">
                <span class="font-bold whitespace-nowrap">Favorite Sets</span>
            </div>
        </template>

        <template v-if="allSets">
            <div class="flex gap-2 items-start h-full">
                <div class="overflow-y-auto flex flex-col gap-1 pl-4 h-full" style="max-height: 70vh">
                    <Button severity="secondary" class="py-2" :label="showIds ? 'Show Names' : 'Show Keys'" @click="showIds = !showIds"/>
                    <div class="flex-1 overflow-auto scrollbar-thinner">
                        <VueDraggable
                            ref="refAnimationContainer"
                            v-model="favs.sets"
                            ghost-class="opacity-20"
                            :delay="200"
                            :delay-on-touch-only="true"
                        >
                            <!--@change="onChangeRight"-->
                            <div v-for="(t, index) in favs.sets" :key="t">
                                <div
                                    class="flex items-center bg-surface-800 border-b border-r border-surface-700 select-none text-sm line-clamp-1 truncate cursor-pointer"
                                    :class="{
                                        'border-t border-l': index==0,
                                        'max-w-36': showIds,
                                        'max-w-56': !showIds
                                    }">
                                    <i class="icon icon-[ic--round-drag-indicator] ml-1.5"></i>
                                    <button @click="move(t, false)" class="p-1.5 flex-1 text-left group relative truncate" :title="t + ' ('+ allSets[t].name+')'">
                                        {{ index + 1 }}. {{ showIds ? t : allSets[t].name }}
                                    </button>
                                </div>
                            </div>
                        </VueDraggable>
                    </div>
                </div>
                <div class="flex flex-col flex-1  h-full overflow-y-auto" style="max-height: 70vh" v-auto-animate>
                    <div class="w-full mb-1 pr-2 flex items-center gap-1">
                        <InputText v-model="query" size="small" class="flex-1" placeholder="search sets..."/>
                    </div>
                    <div class="flex flex-wrap gap-1 flex-1 overflow-auto scrollbar-thinner pr-4">
                        <div
                            v-for="s in sortedAllSetKeys.filter(t => !favs.has(t.key) && (!query || (`${t.key} ${t.name}`.toLowerCase().includes(query.toLowerCase()))))"
                            :key="s.key">
                            <Button
                                size="small"
                                :label="showIds ? s.key : s.name" :severity="favs.has(s.key) ? 'success' : 'secondary'"
                                @click="move(s.key, true)"/>
                        </div>
                    </div>
                </div>
            </div>
        </template>
        <template v-else>
            <div>Getting sets via API...</div>
        </template>
        <template #footer>
            <template v-if="allSets">
                <div class="flex justify-end gap-2 pt-3">
                    <Button label="Cancel" text severity="secondary" @click="close" autofocus/>
                    <Button label="Save" outlined severity="success" @click="save" autofocus/>
                </div>
            </template>
        </template>
    </Dialog>
</template>