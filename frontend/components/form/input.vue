<script setup lang="ts">

const props = defineProps<{
    placeholder?: string
    maxLength?: number
}>()

const value = defineModel()

</script>

<template>
    <input class="border border-yellow-500 rounded bg-transparent px-2 py-1 outline-none focus:ring-[1px] ring-yellow-500
        transition-all duration-150
    "
        type="text"
        :placeholder="placeholder"
        :max-length="maxLength"
        v-model="value"
    />
</template>