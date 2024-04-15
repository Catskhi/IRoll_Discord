<script setup lang="ts">

interface local_audios {
    audios: {
        [key: string]: string
    }
}

const toast = useToast()
const allAudios = ref([])
const { data: local_audios } = await useFetch<local_audios>('http://localhost:8000/audios/' , {
    method: 'GET',
    onResponse({response}) {
        if (response.ok) {
            return response._data.audios
        }
    },
    onResponseError({response}) {
        console.log(response)
        toast.add({title: 'An error ocurred while fetching the local files', color: 'red'})
    }
})
const audioNameSearch = ref<string>()
const audioFileSearch = ref<string>()

const filteredAudios = computed(() => {
    if (local_audios.value) {
        return Object.fromEntries(Object.entries(local_audios.value?.audios).filter(([key, value]) => {
            return key.includes('a')
        }))
    }
})


</script>

<template>
    <div class="px-5 pt-5">
        <h1 class="text-xl font-bold">Music</h1>
        <div class="py-2 mt-3 rounded">
            <div v-if="local_audios" class="flex flex-col">
                <div class="bg-white dark:bg-gray-900 ring-1 ring-gray-200 dark:ring-gray-800
                    px-3 py-3
                ">
                    <div class="text-lg
                    
                    ">
                        Local Files
                    </div>
                </div>
                <div v-for="(audio, audio_name) in filteredAudios" 
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
            </div>
        </div>
    </div>
</template>