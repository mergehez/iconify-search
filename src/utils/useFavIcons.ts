import {defineStore} from "pinia";
import {ref} from "vue";
import {TFavIcon, TIcon, TIconSetWithIconData} from "./types.ts";

const key = 'fav-icons'
export const useFavIcons = defineStore(key, () => {
    function getIcons() {
        const fromStorage = localStorage.getItem(key)
        let favIcons: TFavIcon[];
        if (fromStorage) {
            try {
                favIcons = JSON.parse(fromStorage)
            } catch (_) {
                favIcons = []
            }
        } else {
            favIcons = []
        }
        localStorage.setItem(key, JSON.stringify(favIcons))
        return favIcons
    }

    const icons = ref<TFavIcon[]>(getIcons())

    function add(icon: TIcon|undefined, collection: TIconSetWithIconData|undefined) {
        if(!icon || !collection)
            return
        if (icons.value.some(t => t.icon.id === icon.id))
            return

        icons.value.push({
            collection: {
                id: collection.id,
                height: collection.data.height,
                width: collection.data.width
            },
            icon
        })
        updateStorage()
    }

    function remove(icon: TIcon|undefined) {
        if(!icon)
            return
        icons.value = icons.value.filter(s => s.icon.id != icon.id)
        updateStorage()
    }

    function has(icon: TIcon) {
        return icons.value.some(t => t.icon.id === icon.id)
    }

    function indexOf(icon: TIcon) {
        return icons.value.findIndex(t => t.icon.id === icon.id)
    }

    function toggle(icon: TIcon, collection: TIconSetWithIconData) {
        if (has(icon)) {
            remove(icon)
        } else {
            add(icon, collection)
        }
        updateStorage()
    }

    function resetFromStorage() {
        icons.value = getIcons();
        return icons.value
    }

    function updateStorage() {
        localStorage.setItem(key, JSON.stringify(icons.value))
    }

    return {
        icons,
        add,
        remove,
        has,
        indexOf,
        toggle,
        resetFromStorage,
        updateStorage
    }
});