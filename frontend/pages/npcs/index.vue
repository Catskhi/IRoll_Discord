<script setup lang="ts">

interface npc_data {
    id: number,
    name: string
    description: string,
    profile_picture_url: string,
}

const npcs = ref<Array<npc_data>>([])
const api_url : string = 'http://localhost:8000/'
const toast = useToast()

const { data } = await useFetch<npc_data>('http://localhost:8000/get_npcs/', {
    server: false,
    onResponse({response}) {
        console.log(response._data)
        npcs.value = response._data
    }
})

function copyDescription(description: string) {
    console.log(description)
    navigator.clipboard.writeText(description)
    toast.add({
        title: 'Description copied.',
        timeout: 1500
    })
}

</script>

<template>
    <div class="px-5 mt-5 grid lg:grid-cols-3 gap-3">
        <UCard v-for="npc in npcs" class="">
            <div class="flex justify-center">
                <NuxtImg :src="'http://localhost:8000/' + npc.profile_picture_url"
                    class="w-64"
                />
            </div>
            <template #footer>
                <div class="flex items-center justify-center pl-3 pr-5">
                    <p class="text-2xl truncate">
                        {{ npc.name }}
                    </p>
                    <div class="text-xl w-10 flex justify-center cursor-pointer
                        hover:dark:text-slate-400
                    ">
                        <Icon name="mdi:pencil" />
                    </div>
                </div>
                <div class="flex items-center relative mt-3">
                    <p class="px-3 text-lg">Description:</p>
                    <button @click="copyDescription(npc.description)"
                    class="flex items-end p-1 rounded absolute right-5 *:
                       dark:text-slate-400 dark:hover:text-white
                       text-zinc-600 hover:text-black
                       text-xl
                    ">
                        <Icon name="heroicons:clipboard-document" />
                    </button>
                </div>
                <p class="dark:text-slate-300 dark max-h-36 overflow-scroll py-y px-3 text-justify mt-3 h-36">
                    {{ npc.description }}
                </p>
            </template>
        </UCard>
    </div>
</template>