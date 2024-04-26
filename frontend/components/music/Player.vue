<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid';
import { useMusicPlayerStore } from '#imports';

interface player_data {
    is_playing: boolean,
    song_title: string | undefined
}

const props = defineProps<{
    isOpened: boolean
}>()

const musicPlayerStore = useMusicPlayerStore()
let webSocket: WebSocket | undefined
const toast = useToast()
const volumeIcon = computed(() => {
    if (musicPlayerStore.volume >= 60) {
        return 'humbleicons:volume-2'
    } else if (musicPlayerStore.volume >= 30) {
        return 'humbleicons:volume-1'
    } else if (musicPlayerStore.volume > 0) {
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
                musicPlayerStore.isPlaying = response._data.is_playing
            }
        }
    })
}

const setVolume = async () => {
    await $fetch('http://localhost:8000/volume', {
        method: 'POST',
        body: {
            new_volume: musicPlayerStore.volume
        }
    })
}

onMounted(() => {
    webSocket = new WebSocket(`ws://localhost:8000/voice_ws/${uuidv4()}`)
    webSocket.onmessage = (event) => {
        if (webSocket) {
            const player_data = JSON.parse(event.data) as player_data
            console.log(player_data)
            musicPlayerStore.isPlaying = player_data.is_playing
            if (player_data.song_title) {
                musicPlayerStore.currentSongName = player_data.song_title
            }
        }
    }
})

</script>

<template>
    <div class="fixed w-full bottom-0 lg:h-28 lg:pb-0 h-36 pb-3 bg-white dark:bg-gray-900 ring-2 ring-gray-200 dark:ring-gray-800
        grid lg:grid-cols-3 lg:px-[10%] space-y-1
    ">
        <div class="justify-self-center self-center w-full">
            <p class="text-center mt-3 truncate text-lg lg:text-xl" :class="[musicPlayerStore.currentSongName.length > 0 ? 'font-bold' : 'font-normal']">
                {{ musicPlayerStore.currentSongName ? musicPlayerStore.currentSongName : 'Select a song to play' }}
            </p>
        </div>
        <div class="flex items-center justify-center space-x-3">
            <UButton :ui="{ rounded: 'rounded-full' }" square class="lg:w-12 lg:h-12 h-10 w-10 flex items-center justify-center"
                @click="toggleAudioPaused"
            >
                <Icon :name="musicPlayerStore.isPlaying == true ? 'ph:pause-fill' : 'ph:play-fill'" class="lg:text-xl text-lg" />
            </UButton>
        </div>
        <div class="flex items-center justify-center px-10 space-x-2 lg:w-full md:w-1/2 w-full justify-self-center">
            <Icon :name="volumeIcon" class="text-2xl" />
            <URange v-model="musicPlayerStore.volume" :min="0" :max="100" @change="setVolume" />
            <span>{{ musicPlayerStore.volume }}%</span>
        </div>
    </div>
</template>