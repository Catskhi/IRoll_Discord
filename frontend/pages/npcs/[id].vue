<script setup lang="ts">

const route = useRoute()
const id: number = Number(route.params.id)

onBeforeMount(() => {
   if (isNaN(Number(route.params.id))) {
    navigateTo('/npcs/add')
   }
})

</script>

<template>
    <h1>{{ id }}</h1>
</template>