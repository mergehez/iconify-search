<script setup lang="ts">
const modelValue = defineModel<string>()
</script>

<template>
    <input type="text" v-model="modelValue" required class="bg-neutral-900 border border-neutral-700 px-2 rounded-md leading-tight py-0.5"/>
</template>

<style scoped>

</style>