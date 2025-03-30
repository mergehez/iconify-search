import {TIcon, TIconSetWithIconData} from "./types.ts";
import {computed, reactive, ref} from "vue";
import {defineStore} from "pinia";
import {useTwStyle} from "./useTwStyle";

export const animationTypes = [
    {value: '-', label: 'none'},
    {value: 'animate-spin', label: 'spin'},
    {value: 'animate-ping', label: 'ping'},
    {value: 'animate-bounce', label: 'bounce'},
    {value: 'animate-pulse', label: 'pulse'},
] as const
export type TAnimationType = typeof animationTypes[number]['value']

const defaultOptions = {
    color: 'currentColor',
    twColor: undefined as undefined | { key: string, shade: number, hex: string },
    size: '1em',
    animation: '-' as TAnimationType,
    twSize: 'none',
    wrapper: 'none',
}

type TOptions = Partial<typeof defaultOptions>;

export const iconToSvgHtml = (icon: TIcon | undefined, collection: TIconSetWithIconData | undefined, p: TOptions) => {
    if(!icon || !collection) return '';

    const h = collection.data.height;
    const w = collection.data.width;
    const viewBox = `${icon.left ?? 0} ${icon.top ?? 0} ${icon.width ?? w ?? 16} ${icon.height ?? h ?? 16}`

    const body = icon.body.replace(/"currentColor"/g, '"' + (p.color || 'currentColor') + '"')
    const cls = p.animation ? `class="${p.animation}" ` : ''
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${p.size || '1em'}" height="${p.size || '1em'}" viewBox="${viewBox}" ${cls}>\n\t${body}\n</svg>`
}

export const useIconView = defineStore('iconView', () => {
    const icon = ref<TIcon>();
    const collection = ref<TIconSetWithIconData>();
    const options = reactive(defaultOptions)
    const tab = ref<'css' | 'svg'>('css');

    const asSvgHtml = computed(() => iconToSvgHtml(icon.value, collection.value, options))

    function asCss(tag: 'span' | 'i') {
        if(!icon.value || !collection.value) return '';

        let cls = `icon icon-[${collection.value.id}--${icon.value.id}]`
        // const sizeClass = options.twSize && options.twSize != 'none' ? ` ${options.twSize}` : '';
        // const sizeClass = options.twSize && options.twSize != 'none' ? ` ${options.twSize}` : '';
        let ws = '', we = '';
        if (options.wrapper && options.wrapper != 'none') {
            ws = `<${options.wrapper}>\n\t`
            we = `\n</${options.wrapper}>`
        }
        if(options.twSize && options.twSize != 'none')
            cls += ` ${options.twSize}`
        if(options.animation.length > 1)
            cls += ` ${options.animation}`

        if(options.twColor){
            cls += ` text-${options.twColor.key}-${options.twColor.shade}`
        }
        return ws + `<${tag} class="${cls}"></${tag}>` + we
    }

    const asSpan = computed(() => asCss('span'))
    const asI = computed(() => asCss('i'))
    const svgStyleOnTheFly = computed(() => {
        if(!icon.value || !collection.value) return '';

        const encodedSvg = encodeURIComponent(asSvgHtml.value)
            .replace(/\(/g, '%28') // Encode parentheses
            .replace(/\)/g, '%29');

        let res = `.icon-\\[${collection.value.id}--${icon.value.id}\\] {
            --svg: url(data:image/svg+xml;utf8,${encodedSvg});
            font-size: 1em;
          }`;

        if(options.twColor){
            res += `
                .text-${options.twColor.key}-${options.twColor.shade} {
                    color: ${options.twColor.hex};
                }`;
        }

        return res;
    });

    function setIcon(i: TIcon, c: TIconSetWithIconData) {
        icon.value = i
        collection.value = c
    }

    function clearIcon() {
        icon.value = undefined
        collection.value = undefined
    }

    const asTwClass = computed(() => {
        return toTwClass({
            icon: icon.value,
            collection: collection.value
        });
    })

    return {
        options,
        icon,
        collection,
        tab,
        asSvgHtml,
        asSpan,
        asI,
        asTwClass,
        svgStyleOnTheFly,
        setIcon,
        clearIcon
    }
})


let twStyle: ReturnType<typeof useTwStyle>
export function toTwClass(ic?: {icon?: {id: string}, collection?: {id: string}}) {
    if(!twStyle)
        twStyle = useTwStyle()
    if(!ic || !ic.icon || !ic.collection) return '';
    if(twStyle.value == 'icon-[set--icon]'){
        return `icon-[${ic.collection.id}--${ic.icon.id}]`
    }
    if(twStyle.value == 'icon-set--icon'){
        return `icon-${ic.collection.id}--${ic.icon.id}`
    }
    return ''
}