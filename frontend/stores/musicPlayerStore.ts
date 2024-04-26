import { defineStore } from 'pinia'

export const useMusicPlayerStore = defineStore('musicPlayer', () => {
    const currentSongName = ref<string>('')
    const isPlaying = ref<boolean>(false)
    const volume = ref<number>(100)
    
    return {currentSongName, isPlaying, volume}
})