<script setup>
import {api, ioUrl} from '@/utils/api'
import {io} from 'socket.io-client'
// Required for snackbar background and text color
import { useDataStore } from '@/stores/data';

const dataStore = useDataStore();
import {useRouter} from "vue-router";
const router = useRouter()

dataStore.year = "🎉"
</script>

<template>
  <v-container>
    <loading-tree text="游戏已经结束, 感谢参与"></loading-tree>
  </v-container>
</template>


<style scoped>

</style>

<route lang="yaml">
meta:
  requiresAuth: false
  layout: login
</route>