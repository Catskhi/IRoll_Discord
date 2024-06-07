<script setup lang="ts">

const model = defineModel('volume', { required: true, type: Number })


const volumeIcon = computed(() => {
    if (model.value == 0) {
        return 'material-symbols:volume-off-rounded'
    } else if (model.value <= 20) {
        return 'material-symbols:volume-mute-rounded'
    } else if (model.value <= 70) {
        return 'material-symbols:volume-down-rounded'
    }
    return 'material-symbols:volume-up-rounded'
})

const changeVolume = async () => {
    await $fetch(`http://localhost:5000/voice/volume/${model.value}`, {
        method: 'POST',
        onResponse(response) {
            console.log(response.response._data);
        }
    });
}

</script>

<template>
<div class="flex w-full items-center justify-center">
    <Icon :name="volumeIcon" class="mr-3 text-[30px]" />
    <URange @change="changeVolume" :min="0" :max="100" v-model="model" />
</div>
</template>