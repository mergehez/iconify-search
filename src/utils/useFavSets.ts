import {defineStore} from "pinia";
import {ref} from "vue";

const defaultFavSets = ['mdi', 'ic', 'mingcute', 'fluent', 'fa', 'fa-solid', 'tabler', 'bx']

export const useFavSets = defineStore('favSets', () => {
    function getSets() {
        const fromStorage = localStorage.getItem('favSets')
        let favSets: string[];
        if (fromStorage) {
            try {
                favSets = JSON.parse(fromStorage)
            } catch (_) {
                favSets = [...defaultFavSets]
            }
        } else {
            favSets = [...defaultFavSets]
        }
        localStorage.setItem('favSets', JSON.stringify(favSets))
        return favSets
    }

    const sets = ref<string[]>(getSets())

    function add(set: string) {
        if (sets.value.includes(set))
            return

        sets.value.push(set)
    }

    function remove(set: string) {
        sets.value = sets.value.filter(s => s !== set)
    }

    function has(set: string) {
        return sets.value.includes(set)
    }

    function indexOf(set: string) {
        return sets.value.indexOf(set)
    }

    function toggle(set: string) {
        if (has(set)) {
            remove(set)
        } else {
            add(set)
        }
    }

    function resetFromStorage() {
        sets.value = getSets();
        return sets.value
    }

    function updateStorage() {
        localStorage.setItem('favSets', JSON.stringify(sets.value))
    }

    return {
        sets,
        add,
        remove,
        has,
        indexOf,
        toggle,
        resetFromStorage,
        updateStorage
    }
});