import {defineStore} from 'pinia'
import type {Ref} from "vue";

export const useDataStore = defineStore('data', () => {
    const year: Ref<string> = ref('')
    return { year }
})
