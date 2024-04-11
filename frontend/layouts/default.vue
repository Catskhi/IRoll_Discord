<script setup lang="ts">

const isSlideOpen = ref<boolean>(false)
const links = [{
    label: 'Lobby',
    to: '/',
    icon: 'material-symbols:home'
}, {
    label: 'Settings',
    to: '/settings/',
    icon: 'line-md:cog-filled-loop'
}, {
    label: 'NPCs',
    to: '/npcs/',
    icon: 'material-symbols:person'
}]

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
            <div class="rounded-full p-1 hover:bg-zinc-300 dark:hover:bg-zinc-600 bg-opacity-45 cursor-pointer mr-5"
                @click="isSlideOpen = true"
            >
                <Icon name="ic:round-menu" class="text-[30px]" />
            </div>
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
        <USlideover v-model="isSlideOpen" side="left" class="w-44">
            <span class="flex items-center text-[20px] px-2 space-x-2 mt-5 pb-5 select-none">
                <Icon name="game-icons:dice-fire" class="text-[25px]" />
                <p>
                    IRoll Discord
                </p>
            </span>
            <UDivider />
            <UVerticalNavigation :links="links" class="mt-5" :ui="{ size: 'text-base' }"
                @click="isSlideOpen = false"
            >
                <template #icon="{link}">
                    <Icon :name="link.icon" class="text-base" />
                </template>
            </UVerticalNavigation>
        </USlideover>
        <slot/>
    </main>
</template>