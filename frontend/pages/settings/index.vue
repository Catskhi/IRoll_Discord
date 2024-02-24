<script setup lang="ts">

const token = ref<string>('')
const loadingSaveToken = ref<boolean>(false)

const toast = useToast()

const submitForm = async (event: Event) => {
    event.preventDefault()
}

const saveToken = async () => {
    loadingSaveToken.value = true
    await $fetch('http://localhost:8000/set_bot_token/', {
        method: 'POST',
        body: {
            token: token.value
        }
    })
    .then(() => {
        toast.add({
            title: 'Saved token',
            icon: 'i-heroicons-check-circle',
            timeout: 3000
        })
        token.value = ''
    })
    loadingSaveToken.value = false
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
                    <UButton color="primary" variant="solid" :disabled="token.length < 10" class="px-3"
                        :loading="loadingSaveToken" @click="saveToken"
                    >
                        <Icon class="text-lg" name='material-symbols:save' />
                    </UButton>
                </div>
            </div>
        </form>
        <!-- <UNotification icon="i-heroicons-check-circle" title="Success" description="Token saved." :id="1" :timeout="5000" /> -->
    </div>
</template>