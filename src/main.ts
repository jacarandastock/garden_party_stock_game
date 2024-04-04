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
import VueApexCharts from 'vue3-apexcharts'
import { getToken, isTokenValid } from '@/utils/api'

const routes = setupLayouts(generatedRoutes)

import { createMemoryHistory, createRouter, createWebHashHistory } from 'vue-router'


const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes
})

// 使用 router.beforeEach 来设置全局前置守卫
router.beforeEach(async (to: any, from: any, next: any) => {
    if (to.meta.requiresAuth && !await isTokenValid(getToken(), to.meta.isAdmin)) {
        // 如果这个路由需要认证，而用户未登录，则重定向到登录页面
        next({ path: '/login' })
    } else {
        next()
    }
})


const app = createApp({
    render: () => h(App),
    setup() {
        onInitApp()
    }
})

app.use(createPinia())
    .use(vuetify)
    .use(createHead())
    .use(i18n)
    .use(VueApexCharts)
    .use(router)
app.mount('#app')