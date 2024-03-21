<script setup lang="ts">

const imageUrl = ref<string>('')
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
            title: 'An error occurred while sending the NPC to discord.',
            color: 'red'
        })
    })
    loadingUpload.value = false
}

</script>

<template>
    <div class="px-5 mt-5">
        <p class="text-center text-xl font-bold">NPC Picture</p>
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
                <UTextarea class="mt-5" placeholder="The NPC description..." :rows="6" v-model="npcDescription" />
                <div class="flex items-center justify-center mt-5">
                    <UButton color="primary" variant="solid" size="xl" class="mt-3" block
                        @click="sendNpcToServer" :loading="loadingUpload"
                    >
                        Send
                    </UButton>
                </div>
            </div>
        </div>
    </div>
</template>