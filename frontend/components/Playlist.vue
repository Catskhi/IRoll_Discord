<script setup lang="ts">
export interface songToPlay {
    title: string,
    url: string
}

defineProps<{
    queue: songToPlay[]
}>();

const playFromIndex = async (index: number) => {
    await $fetch('http://localhost:5000/voice/playFromIndex/', {
        method: 'POST',
        body: {
            index: index
        },
        onResponse(response) {
            console.log(response);
        }
    })
}

const removeFromIndex = async (index: number) => {
    await $fetch('http://localhost:5000/voice/removeFromIndex', {
        method: 'POST',
        body: {
            index: index
        },
        onResponse(response) {
            console.log(response);
        }
    })
}

</script>

<template>
<div class="flex flex-col h-full overflow-y-scroll py-5">
    <div v-if="queue.length == 0" class="flex items-center justify-center grow">
        <span class="opacity-50 select-none">There's no sounds on queue, add a new one to see it here.</span>
    </div>
    <div v-else class="px-5 space-y-3">    
        <div v-for="(song, index) in queue" 
        class="bg-gray-800 px-5 py-3 rounded hover:bg-gray-700/80 
        flex items-center
        transition-colors duration-100"
        >
            <span class="font-semibold flex-grow truncate">{{ index + 1 }} - {{ song.title }}</span>
            <div class="space-x-2 w-fit ml-2 flex items-center justify-end">
                <UButton square size="sm" @click="playFromIndex(index)" >
                    <Icon name="material-symbols:play-arrow-rounded" class="text-[20px]" />
                </UButton>
                <UButton square size="sm" color="red" @click="removeFromIndex(index)" >
                    <Icon name="material-symbols:close-rounded" class="text-[20px]" />
                </UButton>
            </div>
        </div>
    </div>
</div>
</template>

<style>

</style>