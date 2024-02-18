// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  colorMode: {
    preference: 'dark'
  },
  modules: [
    'nuxt-icon',
    '@nuxt/ui'
  ]
})
