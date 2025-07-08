<template>
  <div>
    <NuxtPage />
    <UNotifications />
  </div>
</template>

<script setup>
// 导入Element Plus主题变量
import '~/assets/scss/element-variables.scss'
// App.vue is now just a layout shell
// No script logic needed here for the main page content
</script>

<style>
/* Global styles can remain here or be moved to assets/css */
/* For simplicity, let's assume global styles are mainly in assets/css/main.css */
/* Basic body styling might still be useful here if no other layout sets it */
body {
  margin: 0;
  font-family: sans-serif; /* Basic default */
  /* You might want to retain some base styling from the original app.vue */
  background-color: #ffffff; /* White background */
  color: #333333; /* Dark text */
  /* Remove overflow: hidden to allow scrolling on child pages */
  /* overflow: hidden; */ 
}
</style>

