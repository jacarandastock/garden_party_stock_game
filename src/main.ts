import './assets/main.css'
import 'uno.css'

import App from './App.vue'
import { ViteSSG } from 'vite-ssg'
import { createHead } from '@vueuse/head'
import { createPinia } from 'pinia'
import generatedRoutes from '~pages'
import i18n from './plugins/i18n'
import { setupLayouts } from 'virtual:generated-layouts'
import vuetify from './plugins/vuetify'

const routes = setupLayouts(generatedRoutes)

import { createMemoryHistory, createWebHashHistory } from 'vue-router'
import {getToken, isTokenValid} from "@/utils/auth";


const history = typeof window !== 'undefined' ?  createWebHashHistory() : createMemoryHistory()


export const createApp = ViteSSG(App, { routes, history: history, base: import.meta.env.BASE_URL }, ({ app, router, isClient }) => {
    app.use(createPinia())
    app.use(vuetify)
    // app.use(createHead())
    app.use(i18n)
    router.beforeEach(async (to: any, from: any, next: any) => {
        if (to.meta.requiresAuth && !await isTokenValid(getToken(), to.meta.isAdmin)) {
            next('/');
        } else {
            next();
        }
    });
    if (isClient) {
        import('vue3-apexcharts').then(({ default: VueApexCharts }) => {
            app.use(VueApexCharts)
        })
    }
})

// const app = createApp({
//     render: () => h(App),
//     setup() {
//         onInitApp()
//     },
// })

// app.use(createPinia())
//     .use(vuetify)
//     .use(createHead())
//     .use(i18n)
//     .use(VueApexCharts)
//     .use(
//         createRouter({
//             history: createWebHistory(import.meta.env.BASE_URL),
//             routes,
//         })
//     )
// app.mount('#app')