<template>
  <router-view />
  <NotificationContainer />
  <ConfirmDialog />
</template>

<script setup lang="ts">
import NotificationContainer from './components/NotificationContainer.vue';
import ConfirmDialog from './components/ConfirmDialog.vue';
</script>

<style>
/* Global styles if any */
</style>
