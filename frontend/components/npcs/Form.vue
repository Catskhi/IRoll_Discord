<script setup lang="ts">

interface Npc {
    id: number,
    name: string,
    description: string,
    profile_picture_url: string,
}

const props = defineProps<{
    npc_id?: number
}>()

const editMode = computed(() => {
    return props.npc_id ? true : false
})

const imageUrl = ref<string>('')
const npcImageUrl = ref<string>('')
const imageFile = ref<Blob | null>(null)
const npcName = ref<string>('')
const npcDescription = ref<string>('')
const loadingUpload = ref<boolean>(false)

const toast = useToast()

const npc_channel = ref<string>('')

const { data } = await useFetch('http://localhost:8000/get_bot_configs/', {
    server: false,
    onResponse({response}) {
        npc_channel.value = response._data.npc_channel
    }
})

const handleFileInput = (event: Event) => {
    const input = event.target as HTMLInputElement
    if (input.files && input.files[0]) {
        imageFile.value = input.files[0]
        const reader = new FileReader()
        reader.onload = () => {
            if (typeof reader.result === 'string') {
                imageUrl.value = reader.result
            }
        }
        reader.readAsDataURL(input.files[0])
    }
}

const sendNpcToServer = async () => {
    loadingUpload.value = true
    const formData = new FormData()
    formData.append('name', npcName.value)
    formData.append('description', npcDescription.value)
    formData.append('channel_id', npc_channel.value)
    formData.append('file', imageFile.value as Blob)
    await $fetch('http://localhost:8000/send_npc/', {
        method: 'POST',
        body: formData
    })
    .catch((error) => {
        console.log(error)
        toast.add({
            title: 'An error occurred while saving the NPC.',
            color: 'red'
        })
    })
    loadingUpload.value = false
}

const saveNpc = async () => {
    loadingUpload.value = true
    var newImageUrl: string = ''
    if (imageFile.value) {
        const formData = new FormData()
        formData.append('new_image', imageFile.value as Blob)
        await $fetch('http://localhost:8000/save_npc_image/', {
            method: 'POST',
            body: formData,
            onResponse({response}) {
                newImageUrl = response._data.image_url
            }
        })
        try {
            await $fetch('http://localhost:8000/npc/', {
                method: 'POST',
                body: {
                    name: npcName.value,
                    description: npcDescription.value,
                    profile_picture_url: newImageUrl
                }
            })
            toast.add({title: 'Successfully saved NPC.', color: 'green'})
            await useRouter().push('/npcs/')
        } catch (error) {
            toast.add({title: 'An error occurred when saving the NPC on the database.', color: 'red'})
        }
    } else {
        console.log('No image value')
    }
    loadingUpload.value = false
}

const updateNpc = async () => {
    loadingUpload.value = true
    let updateBody: {[key: string]: any} = {
        name: npcName.value,
        description: npcDescription.value 
    }
    try {
        if (imageFile.value) {
            const imageForm = new FormData()
            imageForm.append('new_image', imageFile.value as Blob)
            imageForm.append('old_image_url', npcImageUrl.value)
            await $fetch('http://localhost:8000/save_npc_image/', {
                method: 'POST',
                body: imageForm,
                onResponse({response}) {
                    if ((response._data.image_url as string).length > 0) {
                        updateBody.profile_picture_url = response._data.image_url
                    }
                },
                onResponseError({response}) {
                    toast.add({title: 'An error occurred while saving the NPC image.', color: 'red'})
                }
            })
        }
        await $fetch('http://localhost:8000/npc/' + props.npc_id, {
            method: 'PATCH',
            body: updateBody
        })
        toast.add({title: 'Updated NPC successfully.', color: 'green'})
        await useRouter().push('/npcs/')
    } catch (error) {
        toast.add({title: 'An error occurred while saving the NPC.', color: 'red'})
    }
    loadingUpload.value = false
}

onBeforeMount(async () => {
    if (props.npc_id) {
        const npc = await $fetch<Npc>('http://localhost:8000/get_npc/', {
            method: 'POST',
            body: {
                id: 1
            }
        })
        imageUrl.value = 'http://localhost:8000/' + npc.profile_picture_url
        npcImageUrl.value = npc.profile_picture_url
        npcName.value =  npc.name
        npcDescription.value = npc.description
    }
})

</script>

<template>
    <div class="px-5 mt-5">
        <div class="relative">
            <NuxtLink to="/npcs/" class="absolute left-0 cursor-pointer text-lg font-bold
                dark:hover:text-slate-300 hover:text-zinc-600
            ">
                <Icon name="mdi:arrow-left" /> Back
            </NuxtLink>
            <p class="text-center text-2xl font-bold">NPC Picture</p>
        </div>
        <div class="mt-5 flex items-center justify-center">
            <div class="border-2 border-gray-500 rounded h-72 w-1/2 flex items-center justify-center
                cursor-pointer relative"
            >
                <p class="text-gray-400">Select an image</p>
                <input class="border-2 w-full h-full bg-red-500 absolute opacity-0 cursor-pointer" type="file" accept="image/*"
                    @change="handleFileInput"
                />
                <img :src="imageUrl" class="w-full h-full absolute rounded pointer-events-none object-contain" />
            </div>
        </div>
        <div class="w-full flex items-center justify-center mt-5">
            <div class="w-1/2">
                <p class="text-center text-xl font-bold">NPC Name</p>
                <UInput type="text" placeholder="NPC Name" class="mt-5" size="lg" v-model="npcName" />
                <p class="text-center text-xl font-bold mt-5">NPC Description</p>
                <UTextarea class="mt-5" placeholder="The NPC description..." :rows="6" v-model="npcDescription" :maxrows="7" />
                <div class="flex items-center justify-center mt-5">
                    <UButton color="primary" variant="solid" size="xl" class="mt-3" block
                        @click="editMode == true ? updateNpc() : saveNpc()" :loading="loadingUpload"
                    >
                        Save
                    </UButton>
                </div>
            </div>
        </div>
    </div>
</template>