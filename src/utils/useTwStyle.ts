import {defineStore} from "pinia";
import {ref, watch} from "vue";

export const tailwindTypes = [
    'icon-[set--icon]',
    'icon-set--icon',
] as const
export type TTailwindType = typeof tailwindTypes[number]
const key = 'tw-style'
export const useTwStyle = defineStore(key, () => {
    function getStyle(): TTailwindType {
        let fromStorage = localStorage.getItem(key) as any
        if (fromStorage && tailwindTypes.includes(fromStorage)) {
            return fromStorage
        }
        fromStorage = tailwindTypes[0]
        localStorage.setItem(key, fromStorage)
        return fromStorage;
    }
    const style = ref<TTailwindType>(getStyle())

    watch(style, (newStyle) => {
        localStorage.setItem(key, newStyle)
    })

    return {
        value: style,
    }
});