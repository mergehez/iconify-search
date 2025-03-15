<script setup lang="ts">
import {onUnmounted, ref} from "vue";
import {api} from "./utils/api.ts";
import {TIcon, TIconSetWithIconData, TSearchResultWithIconData} from "./utils/types.ts";
import {twMerge} from "tailwind-merge";
import {useFavSets} from "./utils/useFavSets.ts";
import IconInfo from "./components/IconInfo.vue";
import InputText from "./components/InputText.vue";
import {Button, Toast} from "primevue";
import IconBox from "./components/IconBox.vue";
import ModalFavSets from "./components/ModalFavSets.vue";
import {useIconView} from "./utils/useIconView.ts";
import ModalFavIcons from "./components/ModalFavIcons.vue";

const query = ref('load')
const res = ref<TSearchResultWithIconData>()
const activeSetId = ref<string>()

async function search() {
    if (!query.value) return
    res.value = await api.search(query.value)
}

const setScrollContainer = ref<HTMLElement>();

function setActiveSetId(id: string) {
    if (activeSetId.value === id) {
        activeSetId.value = undefined
        return
    }
    activeSetId.value = id
    const el = document.getElementById(`${id}-_first`)
    if (el) {
        // scroll if not visible in setScrollContainer
        const rect = el.getBoundingClientRect()
        const containerRect = setScrollContainer.value!.getBoundingClientRect()
        if (rect.top < containerRect.top || rect.bottom > containerRect.bottom) {
            setScrollContainer.value!.scrollTo({
                top: el.offsetTop - containerRect.top,
                behavior: 'smooth'
            })
        }
    }
}

const favSets = useFavSets()
// const favIcons = useFavIcons()
const showFavSetsModal = ref(false)
const showFavIconsModal = ref(false)
onUnmounted(() => {
    setTimeout(() => {
        search()
    }, 200)
})

const selection = ref<{
    icon: TIcon,
    collection: TIconSetWithIconData,
}>()
const iconView = useIconView();

function selectIcon(icon: TIcon) {
    if (selection.value?.icon === icon) {
        iconView.clearIcon()
        return
    }
    iconView.options.animation = '-';
    if(icon.body.includes('<animateTransform attributeName="transform" ')) {
        const parsed = new DOMParser().parseFromString(icon.body, 'image/svg+xml')
        const animate = parsed.querySelector('animateTransform')
        if(!animate){
            return;
        }
        animate.parentNode!.removeChild(animate);
        icon.bodyWithTransform = icon.body
        icon.body = parsed.documentElement.outerHTML
        iconView.options.animation = 'animate-spin';
        // example:
        // <svg ...>
        //    <path ...>
        //      <animateTransform attributeName="transform" attributeType="XML" dur="560ms" from="0,12,12" repeatCount="indefinite" to="360,12,12" type="rotate"/>
        //    </path>
        // </svg>
        // icon.transform = {
        //     attributeName: animate.getAttribute('attributeName'),
        //     dur: animate.getAttribute('dur'),
        //     from: animate.getAttribute('from'),
        //     repeatCount: animate.getAttribute('repeatCount'),
        //     to: animate.getAttribute('to'),
        //     type: animate.getAttribute('type'),
        // }
        //
        // // convert to css: <animateTransform attributeName="transform" attributeType="XML" dur="560ms" from="0,12,12" repeatCount="indefinite" to="360,12,12" type="rotate"/>
        // const css=  'transform: rotate(0deg); transition: transform 560ms linear;'
    }
    // selection.value = {
    //     icon,
    //     collection: res.value!.collections.find(c => c.data.icons.includes(icon))!
    // }
    iconView.setIcon(icon, res.value!.collections.find(c => c.data.icons.includes(icon))!)
    console.log(selection.value)
}
</script>

<template>
    <div class="w-screen h-screen flex flex-col gap-4 items-center bg-neutral-900 text-stone-300 overflow-auto py-5 relative">
        <form @submit.prevent="search" class="flex gap-2">
            <InputText placeholder="search..." v-model="query"/>
            <Button type="submit" severity="secondary" size="small">Search</Button>
            <span>{{ res?.total }}</span>
        </form>
        <div class="absolute right-4 top-3 flex gap-2">
            <Button severity="info" size="small" @click="showFavIconsModal = true">fav icons</Button>
            <Button severity="info" size="small" @click="showFavSetsModal = true">fav sets</Button>
        </div>

        <template v-if="res">
            <div class="flex flex-wrap items-start overflow-auto gap-1 border-b border-neutral-600 pb-2 px-5">
                <template v-for="(c) in res.collections" :key="c.id">
                    <button
                        @click="setActiveSetId(c.id)"
                        class=" px-2 rounded-md leading-tight py-0.5"
                        :class="twMerge('bg-neutral-800 border border-neutral-700 hover:bg-neutral-700',
                            favSets.has(c.id) ? 'bg-orange-900 hover:bg-orange-800' : '',
                            activeSetId === c.id ? 'bg-green-800 hover:bg-green-700' : '',
                        )"
                    >{{ c.id }}
                    </button>
                </template>
            </div>
            <div ref="setScrollContainer" class="flex flex-wrap items-start overflow-y-auto  flex-1 icons overflow-x-hidden px-5">
                <template v-for="(c, index) in res.collections" :key="c.id">
                    <IconBox
                        v-for="(icon) in c.data.icons" :key="icon.id"
                        :icon="icon"
                        :collection="c"
                        :activeSetId="activeSetId"
                        :index="index"
                        :active="selection?.icon === icon"
                        @click="selectIcon(icon)"
                        v-tooltip="{
                            value: `${c.id}:${icon.id}\n<b class='whitespace-nowrap'>${c.name}</b>`,
                            autoHide: false,
                            fitContent: true,
                            escape: false,
                            showDelay: 300,
                        }"
                    />
                </template>
            </div>
            <IconInfo />
        </template>
        <ModalFavSets
            v-model="showFavSetsModal"
            @saved="search"
        />
        <ModalFavIcons
            v-model="showFavIconsModal"
        />
        <Toast/>
    </div>
</template>