<!-- default layout only displays the router view (Empty page)-->
<script setup lang='ts'>

const sideNavBar = ref(false);

</script>


<template>
    <v-app>
        <v-layout>
            <v-main class="text-slate-700 dark:text-slate-300">
                <v-container fluid class="ma-0 pa-0 h-100">
                    <RouterView/>
                </v-container>
            </v-main>
        </v-layout>
    </v-app>
</template>


<style scoped>

</style>