<script setup lang="ts">

const route = useRoute()
const id: number = Number(route.params.id)

interface Npc {
    id: number,
    name: string,
    description: string,
    profile_picture_url: string,
}

onBeforeMount(() => {
   if (isNaN(Number(route.params.id))) {
    navigateTo('/npcs/add')
   }
})

</script>

<template>
    <NpcsForm :npc_id="id" />
</template>