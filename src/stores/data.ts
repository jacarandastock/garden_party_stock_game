import {defineStore} from 'pinia'
import type {Ref} from "vue";

export const useDataStore = defineStore('data', () => {
    const currentYear: Ref<string> = ref("Waiting")
    const stock_data = reactive({});
    const graph_data = reactive({"x": [], "y": {}});
    const userPosition = ref({balance: 0, position: {}, total_position:0, total_profit:0});
    const adminRankData = reactive([]);
    return {currentYear, stock_data, graph_data, userPosition, adminRankData}
})
