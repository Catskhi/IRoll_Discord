<script setup lang="ts">

interface local_audios {
    audios: {
        [key: string]: string
    }
}

const page = ref<number>(1)
const totalPages = ref<number>(0)

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


</script>

<template>
    <div class="px-5 pt-5">
        <h1 class="text-xl font-bold">Music</h1>
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
                        <UButton :ui="{ rounded: 'rounded-full' }" square>
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
</template>