<!-- default layout only displays the router view (Empty page)-->
<script setup lang='ts'>

import {useDisplay} from "vuetify";
import {VSonner} from 'vuetify-sonner'
// Required for snackbar background and text color
import 'vuetify-sonner/style.css'
import { useDataStore } from '@/stores/data'

const dataStore = useDataStore();
const {xs, mdAndUp} = useDisplay();
defineProps({
  color: {
    type: String,
    default: 'inherit',
  },
})
</script>


<template>
  <v-app id="inspire">
    <VSonner position="top-right"/>
    <v-app-bar flat>
      <v-spacer></v-spacer>
      {{dataStore.year}}
      <v-spacer></v-spacer>
      <!--      <total-rank></total-rank>-->
      <theme-toggler></theme-toggler>
      <!--      <locale-toggler></locale-toggler>-->
    </v-app-bar>

    <v-main class="text-slate-700 dark:text-slate-300">
      <v-container fluid class="ma-0 pa-0 fill-height">
        <RouterView/>
      </v-container>
    </v-main>
  </v-app>
</template>


<style scoped>
html, body, #app {
  height: 100%;
  margin: 0;
}
</style>