<script setup lang="ts">

const props = defineProps<{
    icon: string
    title: string
    action?: Function
}>()

</script>

<template>
    <div class="w-full h-full bg-neutral-600 bg-opacity-500 rounded flex flex-col items-center justify-center py-5
        border hover:text-neutral-400 hover:border-neutral-400 transition-all duration-150 cursor-pointer"
            @click="action ? action() : console.log('No action defined.')"
        >
        <span class="pb-3">
            <Icon :name="icon" class="text-[30px]" />
        </span>
        <p class="text-xl">{{ title }}</p>
    </div>
</template>