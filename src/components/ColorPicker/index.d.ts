import {ComponentOptionsMixin, ComponentProvideOptions, DefineComponent, PublicProps} from 'vue';

declare type __VLS_PublicProps = {
    modelValue?: string;
} & typeof __VLS_typeProps;

declare let __VLS_typeProps: {
    showPalette?: boolean;
    showEyeDropper?: boolean;
    colorClasses?: ColorClasses;
};

declare type ColorClasses = {
    surface?: string;
    canvas?: string;
    canvasCircle?: string;
    opacityWrapper?: string;
    input?: string;
    paletteRemove?: string;
    paletteAdd?: string;
};

declare const _default: DefineComponent<__VLS_PublicProps, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {
    "update:modelValue": (modelValue: string) => any;
}, string, PublicProps, Readonly<__VLS_PublicProps> & Readonly<{
    "onUpdate:modelValue"?: ((modelValue: string) => any) | undefined;
}>, {
    showPalette: boolean;
    showEyeDropper: boolean;
    colorClasses: ColorClasses;
}, {}, {}, {}, string, ComponentProvideOptions, false, {}, any>;
export default _default;

export {}
