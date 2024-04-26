<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid';

interface player_data {
    is_playing: boolean
}

const props = defineProps<{
    isOpened: boolean
}>()

let webSocket: WebSocket | undefined
const isPlaying = ref<boolean>(false)
const isPaused = ref<boolean>(false)
const volume = ref<number>(100)
const currentSongName = ref<string>('') 
const volumeIcon = computed(() => {
    if (volume.value >= 60) {
        return 'humbleicons:volume-2'
    } else if (volume.value >= 30) {
        return 'humbleicons:volume-1'
    } else if (volume.value > 0) {
        return 'humbleicons:volume'
    } else {
        return 'humbleicons:volume-off'
    }
})

const toggleAudioPaused = async () => {
    await $fetch('http://localhost:8000/toggle_paused', {
        method: 'POST',
        onResponse({response}) {
            if (response.ok) {
                isPlaying.value = response._data.is_playing
            }
        }
    })
}

onMounted(() => {
    webSocket = new WebSocket(`ws://localhost:8000/voice_ws/${uuidv4()}`)
    webSocket.onmessage = (event) => {
        if (webSocket) {
            const player_data = JSON.parse(event.data) as player_data
            console.log(player_data)
            isPlaying.value = player_data.is_playing
        }
    }
})

</script>

<template>
    <div class="fixed w-full bottom-0 lg:h-28 lg:pb-0 h-36 pb-3 bg-white dark:bg-gray-900 ring-2 ring-gray-200 dark:ring-gray-800
        grid lg:grid-cols-3 lg:px-[10%] space-y-1
    ">
        <div class="justify-self-center self-center">
            <p class="text-center mt-3 truncate text-lg lg:text-xl" :class="[currentSongName.length > 0 ? 'font-bold' : 'font-normal']">
                {{ currentSongName ? currentSongName : 'Select a song to play' }}
            </p>
        </div>
        <div class="flex items-center justify-center space-x-3">
            <UButton :ui="{ rounded: 'rounded-full' }" square class="lg:w-12 lg:h-12 h-10 w-10 flex items-center justify-center bg-gray">
                <Icon name="ph:skip-back-fill" class="lg:text-xl text-lg" />
            </UButton>
            <UButton :ui="{ rounded: 'rounded-full' }" square class="lg:w-12 lg:h-12 h-10 w-10 flex items-center justify-center"
                @click="toggleAudioPaused"
            >
                <Icon :name="isPlaying == true ? 'ph:pause-fill' : 'ph:play-fill'" class="lg:text-xl text-lg" />
            </UButton>
            <UButton :ui="{ rounded: 'rounded-full' }" square class="lg:w-12 lg:h-12 h-10 w-10 flex items-center justify-center bg-gray">
                <Icon name="ph:skip-forward-fill" class="lg:text-xl text-lg" />
            </UButton>
        </div>
        <div class="flex items-center justify-center px-10 space-x-2 lg:w-full md:w-1/2 w-full justify-self-center">
            <Icon :name="volumeIcon" class="text-2xl" />
            <URange v-model="volume" :min="0" :max="100" @change="console.log('Changed')" />
        </div>
    </div>
</template>