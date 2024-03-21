<script setup lang="ts">

const colorMode = useColorMode()
const isDark = computed({
    get() {
        return colorMode.value == 'dark'
    },
    set() {
        colorMode.preference = colorMode.value == 'dark' ? 'light' : 'dark'
    }
})

const goToMainPage = async () => {
    await navigateTo('/')
}

</script>

<template>
    <nav class="grid grid-cols-2">
        <div class="h-16 flex items-center pl-5 select-none"
        >
            <h1 class="text-xl group cursor-pointer" @click="goToMainPage">
                <span class="text-[35px] group-hover:text-red-500 transition-all duration-150">
                    <Icon name="game-icons:dice-fire" /> 
                </span>
                IRoll <span class="group-hover:text-[#7289da] transition-all duration-150">Discord</span>
            </h1>
        </div>
        <div class="flex items-center justify-end pr-10">
            <UButton
                :icon="isDark ? 'i-heroicons-moon-20-solid' : 'i-heroicons-sun-20-solid'"
                color="gray"
                variant="ghost"
                aria-label="Theme"
                @click="isDark = !isDark"
            />
        </div>
    </nav>
    <UDivider />
    <main>
        <slot/>
    </main>
</template>