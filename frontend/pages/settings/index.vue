<script setup lang="ts">

const token = ref<string>()
const npc_channel = ref<string>()
const loadingSaveConfigs = ref<boolean>(false)

const toast = useToast()

const submitForm = async (event: Event) => {
    event.preventDefault()
}

const { data } = await useFetch('http://localhost:8000/get_bot_configs/', {
    server: false,
    onResponse({response}) {
        token.value = response._data.bot_token
        npc_channel.value = response._data.npc_channel
    }
})

const saveConfigs = async () => {
    loadingSaveConfigs.value = true
    await $fetch('http://localhost:8000/set_bot_configs/', {
        method: 'POST',
        body: {
            bot_token: token.value,
            npc_channel: npc_channel.value
        }
    })
    .then(() => {
        toast.add({
            title: 'Saved configs',
            icon: 'i-heroicons-check-circle',
            timeout: 3000
        })
    })
    .catch((error) => {
        toast.add({
            title: 'An error occurred while saving settings.',
            color: 'red'
        })
    })
    loadingSaveConfigs.value = false
}

</script>

<template>
    <div class="px-5 mt-5">
        <h1 class="text-xl font-bold">Bot Settings</h1>
        <form class="mt-5" @submit="submitForm">
            <div class="flex flex-col w-1/2">
                <label class="text-lg mb-1">Bot Token</label>
                <div class="flex space-x-5">
                    <FormInput class="w-3/4" placeholder="Your bot token..." :max-length="500" v-model="token" />
                </div>
                <label class="text-lg mt-3">NPCs Channel</label>
                <div class="flex space-x-5 mt-1">
                    <FormInput class="w-3/4" placeholder="The NPC channel of your game..." :max-length="500" v-model="npc_channel" />
                </div>
                <div class="w-3/4 mt-5">
                    <UButton color="primary" variant="solid"
                        :loading="loadingSaveConfigs" @click="saveConfigs"
                        block size="lg"
                    >
                        <Icon class="text-lg" name='material-symbols:save' />
                    </UButton>
                </div>
            </div>
        </form>
    </div>
</template>