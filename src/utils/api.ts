import axios from 'axios';
import { getToken } from './auth';
import {useDataStore} from "@/stores/data";
export const apiURL = 'https://jacarandastock.com:8000';

export const api = axios.create({
    baseURL: `http://${apiURL}`
});

api.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const RECONNECT_INTERVAL = 5000;  // 重连间隔，单位：毫秒
const ws: any = ref(null);
export function connectMarketWebSocket() {
    const dataStore = useDataStore();
    ws.value = new WebSocket(`ws://${apiURL}/api/stock/ws`);

    ws.value.onopen = () => {
        // 请求最新的数据
        ws.value.send("request_latest_data");
    };

    ws.value.onmessage = (event: any) => {
        const receivedData = JSON.parse(event.data);
        // console.log(receivedData)
        dataStore.currentYear = receivedData['year'];
        Object.assign(dataStore.stock_data, receivedData['data']);
        Object.assign(dataStore.graph_data, receivedData['graph']);
    };


    ws.value.onclose = (event: any) => {
        console.log("WebSocket closed:", event);
        setTimeout(connectMarketWebSocket, RECONNECT_INTERVAL);  // 重新连接
    };

    ws.value.onerror = (error: any) => {
        console.error("WebSocket Error:", error);
    };
}
export default api;