<script setup lang="ts">

interface npc_data {
    id: number,
    name: string
    description: string,
    profile_picture_url: string,
}

const npcs = ref<Array<npc_data>>([])
const toast = useToast()
const isModalOpen = ref<boolean>(false)
const npcToDeleteId = ref<number | undefined>(undefined)

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

function openDeleteModal(npc_id: number) {
    npcToDeleteId.value = npc_id
    isModalOpen.value = true
}

async function deleteNpc(npc_id: number) {
    if (isNaN(npc_id)) {
        throw new Error('The NPC ID must be a number')
    }
    await $fetch('http://localhost:8000/npc/' + npc_id, {
        method: 'DELETE',
        onResponse({response}) {
            if (response.ok) {
                npcs.value = npcs.value.filter(npc => npc.id !== npc_id)
                toast.add({title: 'Successfully deleted the npc', color: 'green'})
            }
        },
        onRequestError({response}) {
            console.log(response)
            toast.add({title: "Failed deleting the NPC", color: 'red'})
        }
    }) 
    npcToDeleteId.value = undefined
    isModalOpen.value = false
}

async function sendNpc(npc_id: number) {
    if (isNaN(npc_id)) {
        throw new Error('The NPC ID must be a number.')
    }
    await $fetch('http://localhost:8000/send_npc/' + npc_id, {
        method: 'POST',
        onResponse({response}) {
            if (response.ok) {
                toast.add({title: 'NPC sent', color: 'green'})
            }
        },
        onResponseError({response}) {
            console.log(response)
            toast.add({title: 'An error occurred when sending the NPC.', color: 'red'})
        }
    })
}

</script>

<template>
    <div>
        <UModal v-model="isModalOpen">
            <div class="py-4 px-5">
                <p>Confirm NPC deletion?</p>
                <div class="flex justify-end space-x-3">
                    <UButton class="px-5" color="green" @click="isModalOpen = false">No</UButton>
                    <UButton class="px-5" color="red" @click="deleteNpc(npcToDeleteId as number)">Yes</UButton>
                </div>
            </div>
        </UModal>
    </div>
    <div class="mt-5 px-5 flex items-center justify-center">
        <NuxtLink to="/npcs/add">
            <UButton class="px-10 text-lg">
                Add NPC
            </UButton>
        </NuxtLink>
    </div>
    <div class="px-5 mt-5 grid lg:grid-cols-3 gap-3 pb-5">
        <UCard v-for="npc in npcs" class="">
            <div class="flex justify-center h-64">
                <NuxtImg :src="'http://localhost:8000/' + npc.profile_picture_url"
                    class="w-64 object-contain"
                />
            </div>
            <template #footer>
                <div class="flex items-center justify-center pl-3 pr-5">
                    <p class="text-2xl truncate mr-3">
                        {{ npc.name }}
                    </p>
                    <NuxtLink :to="`/npcs/${npc.id}`">
                        <div class="text-xl p-1 rounded flex justify-center cursor-pointer
                            dark:hover:bg-neutral-500 hover:bg-slate-300 transition-all duration-150
                        ">
                            <Icon name="mdi:pencil" />
                        </div>
                    </NuxtLink>
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
                <div class="mt-3 pb-3 flex items-center justify-end space-x-5">
                    <UButton class="text-md" color="red" @click="openDeleteModal(npc.id)">
                        Delete NPC <Icon name="ph:trash" class="text-xl" />
                    </UButton>
                    <UButton class="text-md" @click="sendNpc(npc.id)">
                        Send NPC <Icon name="material-symbols:send" class="text-xl" />
                    </UButton>
                </div>
            </template>
        </UCard>
    </div>
</template>