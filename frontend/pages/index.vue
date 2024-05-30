<script setup lang="ts">

const songUrl = ref<string>('');
const channelId = ref<string>('');
const loadingPlay = ref<boolean>(false);

const playButtonEnabled = computed(() => {
    return songUrl.value.length > 10 && channelId.value.length > 5;
})

const playSong = async () => {
    loadingPlay.value = true;
    if (songUrl.value && channelId.value) {
        await $fetch('http://localhost:5000/voice/play/', {
            body: {
                songUrl: songUrl.value,
                channelId: channelId.value
            },
            method: 'POST',
            onResponse(response) {
                console.log(response);
            },
            onResponseError(error) {
                console.log(error);
            }
        })
    } else {
        console.log('You must set an song url and a channel id');
    }
    loadingPlay.value = false;
}

</script>

<template>
<div class="flex flex-col h-screen">
    <div class="font-inter font-semibold flex items-center justify-center pt-20 text-4xl select-none">
        <h1>IRoll <span class="text-primary">Discord</span></h1>
    </div>
    <div class="flex items-center justify-center h-full pb-20">
        <div class="px-5">
            <p class="opacity-50 mb-3 text-lg text-center">There's nothing playing right now, play a song to see it here</p>
            <div class="flex flex-col lg:flex-row lg:space-x-3 space-y-3 lg:space-y-0">
                <UInput v-model="songUrl" placeholder="Song URL" size="lg" class="flex-1 lg:w-72" color="gray" />
                <UInput v-model="channelId" placeholder="Channel ID" size="lg" class="flex-1 lg:w-72" color="gray" />
                <UButton :disabled="!playButtonEnabled" @click="playSong" :loading="loadingPlay" class="px-10 block lg:inline">Play</UButton>
            </div>
        </div>
    </div>
</div>
</template>

<style>

</style>