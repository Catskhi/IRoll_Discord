<script setup lang="ts">
useHead({
  link: [{ rel: 'icon', href: 'discord-icon.png' }]
})

useSeoMeta({
  title: 'IRoll Discord'
})
</script>

<template>
  <div>
    <NuxtPage />
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap');
body {
  @apply bg-[#0f172a];
}

.font-inter{
  font-family: 'Inter', sans-serif;
}
</style>
