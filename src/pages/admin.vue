<script setup >
import { VDataTable } from 'vuetify/labs/VDataTable'
import {apiURL, connectMarketWebSocket, RECONNECT_INTERVAL} from '@/utils/api';
import {useDataStore} from "@/stores/data";
import {getToken} from "@/utils/auth";
const tab = ref("1");
const dataStore = useDataStore();

let requestInterval = null;
const ws = ref(null);
function connectAdminWebSocket() {
  const token = getToken();
  ws.value = new WebSocket(`ws://${apiURL}/api/user/rank/ws?token=${token}`);

  ws.value.onopen = () => {
    // 请求最新的数据
    ws.value.send("request_latest_data");
    requestInterval = setInterval(() => {
      ws.value.send("request_latest_data");
    }, 2000);
  };

  ws.value.onmessage = (event) => {
    if (event.data === "update_data") {
      ws.value.send("request_latest_data");
      return;
    }
    const receivedData = JSON.parse(event.data);
    Object.assign(dataStore.adminRankData, receivedData['data']);
  };


  ws.value.onclose = (event) => {
    console.log("WebSocket closed:", event);
    setTimeout(connectMarketWebSocket, RECONNECT_INTERVAL);  // 重新连接
  };

  ws.value.onerror = (error) => {
    console.error("WebSocket Error:", error);
  };
}

const sortBy = ref([{ key: 'total_funds', order: 'desc' }])
const search = ref('')
const headers = [
  { title: '排名', key: 'rank', sortable: false },
  {
    title: '用户名',
    align: 'start',
    sortable: false,
    key: 'username',
  },
  { title: '资产总额', key: 'total_funds' },
  { title: '现金', key: 'balance' },
  { title: '持仓', key: 'total_position' },
]

function fix2float(num) {
  return parseFloat(num).toFixed(2);
}

const formattedData = computed(() => {
  return dataStore.adminRankData.map(item => ({
    ...item,
    total_funds: parseFloat(item.total_funds).toFixed(2),
    balance: parseFloat(item.balance).toFixed(2),
    total_position: parseFloat(item.total_position).toFixed(2),
  }));
});

onMounted(() => {
  connectMarketWebSocket();
  connectAdminWebSocket();
});
</script>

<template>
  <v-container>
    <v-window v-model="tab">
      <v-window-item value="1">
        <v-container>

          <stock-chart></stock-chart>
          <v-row class="overflow-y-auto h-100">
            <v-col cols="12" md="4" v-for="(stockInfo, stockName) in dataStore.stock_data" :key="stockName">
              <v-card>
                <v-card-title>
                  <div class="font-weight-bold">{{stockName}}</div>
                </v-card-title>
                <v-list>
                  <v-list-item>
                    <v-list-item-title class="d-flex justify-space-between">
                      <div class="font-weight-bold">前价</div>
                      <div>{{stockInfo.previous}}</div>
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title class="d-flex justify-space-between">
                      <div class="font-weight-bold">现价</div>
                      <div>{{stockInfo.now}}</div>
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title class="d-flex justify-space-between">
                      <div class="font-weight-bold">涨幅</div>
                      <div>{{stockInfo.change}}</div>
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-window-item>

      <v-window-item value="2">
        <v-container>
          <v-card>
            <v-card-title>
              <v-spacer></v-spacer>
              <v-text-field
                  v-model="search"
                  append-icon="mdi-magnify"
                  label="Search"
                  single-line
                  hide-details
              ></v-text-field>
            </v-card-title>
            <v-data-table v-model:sort-by="sortBy"
                          :headers="headers"
                          items-per-page="20"
                          :items="formattedData"
                          :search="search"
            >
              <template v-slot:item.rank="{ item, index }">
                {{index + 1}}
              </template>
            </v-data-table>
          </v-card>

        </v-container>
      </v-window-item>
    </v-window>
    <v-bottom-navigation grow>
      <v-btn @click="tab='1'" >
        <v-icon>mdi-store-clock-outline</v-icon>
        <span>市场行情</span>
      </v-btn>

      <v-btn @click="tab='2'" >
        <v-icon>mdi-chart-bell-curve-cumulative</v-icon>
        <span>排名</span>
      </v-btn>
    </v-bottom-navigation>
  </v-container>
</template>

<style scoped>

</style>

<route lang="yaml">
meta:
  layout: play
  requiresAuth: true
  isAdmin: true
</route>