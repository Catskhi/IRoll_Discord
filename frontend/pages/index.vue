<script setup>

const goToSettingsPage = async () => {
    await navigateTo('/config/')
}

</script>

<template>
    <div class="px-5 grid grid-cols-3 gap-x-3 mt-5">
        <UCard>
            <div class="flex items-center justify-center">
                <Icon class="text-4xl" name="line-md:cog-filled-loop" />
            </div>
            <template #footer>
                <div class="flex justify-center items-center">
                    <NuxtLink to="/settings" class="text-primary text-lg hover:text-yellow-600 transition-all duration-300">
                        Settings
                    </NuxtLink>
                </div>
            </template>
        </UCard>
    </div>
</template>