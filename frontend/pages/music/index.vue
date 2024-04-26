<script setup lang="ts">

interface local_audios {
    audios: {
        [key: string]: string
    }
}

const page = ref<number>(1)
const totalPages = ref<number>(0)
const channelId = ref<string>('')
const songUrl = ref<string>('')
const isMusicPlayerOpened = ref<boolean>(false)

const toast = useToast()
const filteredAudios = ref({})
const currentPageData = ref({})
const { data: local_audios } = await useFetch<local_audios>('http://localhost:8000/audios/' , {
    server: false,
    method: 'GET',
    onResponse({response}) {
        if (response.ok) {
            filteredAudios.value = Object.fromEntries(Object.entries(response._data.audios).slice(0, page.value * 5))
            currentPageData.value = filteredAudios.value
            totalPages.value = Object.entries(response._data.audios).length
            console.log(Object.fromEntries(Object.entries(response._data.audios).slice(0, page.value * 5)))
            return response._data.audios
        }
    },
    onResponseError({response}) {
        console.log(response)
        toast.add({title: 'An error ocurred while fetching the local files', color: 'red'})
    }
})
const localAudioSearch = ref<string>('')

watch([localAudioSearch, page], ([newSearch, newPage]) => {
    if (local_audios.value) {
        let allFilteredAudios = Object.entries(local_audios.value?.audios)
        if (localAudioSearch.value !== '') {
            filteredAudios.value = Object.fromEntries(allFilteredAudios.filter(([key, value]) => {
                return key.toLowerCase().includes(newSearch.toLowerCase()) || value.toLowerCase().includes(newSearch.toLowerCase())
            }))
            currentPageData.value = Object.fromEntries(Object.entries(filteredAudios.value).slice((page.value - 1) * 5, page.value * 5))
            totalPages.value = Object.entries(filteredAudios.value).length
        } else {
            currentPageData.value = Object.fromEntries(allFilteredAudios.slice((page.value - 1) * 5, page.value * 5))
            totalPages.value = Object.entries(local_audios.value.audios).length
        }
    }
})

const playLocalAudio = async (audio_url: string) => {
    const formData = new FormData()
    formData.append('file_path', audio_url)
    if (channelId.value.length > 10) {
        formData.append('channel_id', channelId.value)
    }
    await $fetch('http://localhost:8000/play_audio', {
        method: 'POST',
        body: {
            file_path: audio_url
        },
        onResponse({response}) {
            if (response.ok) {
                console.log(response._data)
            }
        }
    })
}

const playAudioFromUrl = async () => {
    
}


</script>

<template>
    <div class="px-5 pt-5 pb-40 lg:pb-32">
        <h1 class="text-xl font-bold">Music</h1>
        <div class="space-y-3 mt-3 lg:w-1/2" >
            <div class="flex items-center" >
                <label>Channel ID: </label>
                <UInput v-model="channelId" class="ml-3 grow" placeholder="The ID of the channel to join" />
            </div>
            <UDivider />
            <p>Play From Youtube</p>
            <div class="flex items-center">
                <label>Song URL: </label>
                <UInput v-model="songUrl" class="ml-3 grow" placeholder="The ID of the channel to join" />
                <UButton :ui="{ rounded: 'rounded-full' }" square class="ml-3" size="md"
                    :disabled="songUrl.length < 10"
                >
                    <Icon name="ph:play-fill" />
                </UButton>
            </div>
        </div>
        <div class="py-2 mt-3 rounded">
            <div class="flex flex-col bg-white dark:bg-gray-900 ring-1 ring-gray-200 dark:ring-gray-800">
                <div class="px-3 py-3 grid grid-cols-2 justify-items-stretch">
                    <div class="text-lg">
                        Local Files
                    </div>
                    <div class="flex justify-end">
                        <UInput class="w-[80%]"
                        icon="i-heroicons-magnifying-glass-20-solid"
                        placeholder="Search..."
                        v-model="localAudioSearch"
                        />
                    </div>
                </div>
                <div v-if="local_audios" v-for="(audio, audio_name) in currentPageData" 
                class="bg-white dark:bg-gray-900 ring-1 ring-gray-200 dark:ring-gray-800
                    py-3 px-3 grid grid-cols-2
                ">
                    <div class="flex space-x-3">
                        <UButton :ui="{ rounded: 'rounded-full' }" square
                            @click="playLocalAudio(audio)"
                        >
                            <Icon name="ph:play-fill" />
                        </UButton>
                        <div class="truncate">
                            {{ audio_name }} 
                        </div>
                    </div>
                    <div class="text-right truncate">
                        {{ audio }}
                    </div>
                </div>
                <div v-if="totalPages < 1" class="px-3 py-5 text-center text-opacity-50">
                    No Results
                </div>
                <div class="flex items-center justify-center py-3">
                    <UPagination v-model="page" :page-count="5" :total="totalPages" size="md" />
                </div>
            </div>
        </div>
    </div>
    <MusicPlayer :is-opened="isMusicPlayerOpened" />
</template>