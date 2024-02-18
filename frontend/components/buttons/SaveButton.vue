<script setup lang="ts">

const props = defineProps<{
    saveFunction: Function
    disabled?: boolean
}>()

const loading = ref<boolean>(false)

const save = async () => {
    loading.value = true
    await props.saveFunction()
    loading.value = false
}


</script>

<template>
    <button class="bg-yellow-500 text-neutral-800 px-3 rounded flex items-center
        hover:bg-yellow-600 disabled:bg-yellow-800  hover:scale-95 active:scale-90 transition-all duration-150
    "
        @click="save"
        :disabled="disabled"
    >
        <Icon class="text-lg" :name="loading ? 'line-md:loading-loop' : 'material-symbols:save'" />
    </button>
</template>