import ky from "ky";
import {TIcon, TIconSetWithIconData, TSearchResult, TSearchResultWithIconData} from "./types.ts";
import {useFavSets} from "./useFavSets.ts";

const basePath = 'https://api.iconify.design'

export const api = {
    async search(query: string, limit = 9999) {
        const res = await ky.get<TSearchResult>(`${basePath}/search?query=${query}&limit=${limit}`).json()
        const res2: TSearchResultWithIconData = {
            request: res.request,
            collections: [],
            total: res.total,
            start: res.start,
            limit: res.limit
        }

        const icons = res.icons.map((icon) => icon.split(':')).reduce((acc, [setId, icon]) => {
            acc[setId] || (acc[setId] = [])
            acc[setId].push(icon)
            return acc
        }, {} as Record<string, string[]>)
        await Promise.all(Object.keys(icons).map(async (setId) => {
            const a = await api.getSetIcons(setId, icons[setId])
            const aicons = a.icons as unknown as Record<string, TIcon>
            if (Object.keys(aicons).length > 0)
                aicons[Object.keys(aicons)[0]].first = true
            const iconsArr = Object.keys(a.icons).map((iconId) => ({
                ...aicons[iconId],
                id: iconId
            }))

            if (setId == 'ic') {
                iconsArr.sort((a, b) => {
                    const aid = a.id.replace(/(baseline|outline|twotone|sharp|round)-/g, '')
                    const bid = b.id.replace(/(baseline|outline|twotone|sharp|round)-/g, '')
                    return aid.localeCompare(bid)
                })
            }
            delete res.collections[setId]['samples']
            const newC: TIconSetWithIconData = {
                id: setId,
                name: res.collections[setId].name,
                height: res.collections[setId].height,
                palette: res.collections[setId].palette,
                data: {
                    height: a.height,
                    width: a.width,
                    icons: iconsArr
                }
            }
            res2.collections.push(newC)

        }));
        const favSets = useFavSets().sets
        res2.collections = [
            ...res2.collections.filter((c) => favSets.includes(c.id)).toSorted((a, b) => favSets.indexOf(a.id) - favSets.indexOf(b.id)),
            ...res2.collections.filter((c) => !favSets.includes(c.id)).toSorted((a, b) => a.id.localeCompare(b.id))
        ]
        return res2
    },

    getSetIcons: async function (setId: string, icons: string[]) {
        // https://api.iconify.design/bx.json?icons=color%2Ccolor-fill%2Cfont-color
        return await ky.get<TIconSetWithIconData['data']>(`${basePath}/${setId}.json?icons=${icons.join('%2C')}`).json()
    },

    getIconSets: async function () {
        return await ky.get<TSearchResult['collections']>(`${basePath}/collections`).json()
    }
}