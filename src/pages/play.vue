<script setup>
import {apiURL, connectMarketWebSocket, RECONNECT_INTERVAL} from '@/utils/api';
import api from "@/utils/api";
import {useDataStore} from "@/stores/data";
import {getToken} from "@/utils/auth";

const tab = ref("1");


const dataStore = useDataStore();

// dialog
const confirmDialog = ref(false);
const confirmMessage = ref({});
const exchangeNumber = ref(0);
const exchangePrice = ref(0);
const exchangeEndpoint = ref("");
const stockName = ref("");
const exchangeMax = ref(0);
const onExchangeButtonClick = (type, name, stockPrice) => {
  if (type === 'BUY') {
    confirmMessage.value = {
      title: `请输入您要购买股票 ${name} 的数量`,
      confirm: "买入"
    };
    exchangeEndpoint.value = "/api/stock/buy";
    exchangeMax.value = getBuySliderMaxValue(stockPrice);
  } else {
    confirmMessage.value = {
      title: `请输入您要卖出股票 ${name} 的数量`,
      confirm: "卖出"
    };
    exchangeEndpoint.value = "/api/stock/sell";
    exchangeMax.value = dataStore.userPosition.position[name].quantity;
  }
  stockName.value = name;
  confirmDialog.value = true;
  exchangePrice.value = stockPrice;
}

const onExchangeConfirmDialogClose = () => {
  confirmDialog.value = false;
  exchangeNumber.value = 0;
  stockName.value = "";
  exchangePrice.value = 0;
}

const exchangeConfirm = () => {
  api.post(exchangeEndpoint.value, {
    stockName: stockName.value,
    quantity: exchangeNumber.value,
    price: exchangePrice.value,
    time: dataStore.currentYear
  }).then((data) => {
    if (data.data.status === "success"){
      const receivedData = JSON.parse(data.data['data']).data;
      Object.assign(dataStore.userPosition, receivedData);
      // Object.assign(dataStore.userPosition.position, receivedData.position);
      // dataStore.userPosition.balance = receivedData.balance;
      // dataStore.userPosition.total_position = receivedData.total_position;
      // dataStore.userPosition.total_profit = receivedData.total_profit;
      onExchangeConfirmDialogClose();
    } else {
      console.log(data.data.message)
    }
  });
}

function getBuySliderMaxValue(stockPrice) {
  return Math.floor(dataStore.userPosition.balance / stockPrice);
}

// sell dialog




const ws = ref(null);
function connectUserWebSocket() {
  const token = getToken();
  ws.value = new WebSocket(`wss://${apiURL}/api/user/ws?token=${token}`);

  ws.value.onopen = () => {
    // 请求最新的数据
    ws.value.send("request_latest_data");
  };

  ws.value.onmessage = (event) => {
    if (event.data === "update_data") {
      ws.value.send("request_latest_data");
      return;
    }
    const receivedData = JSON.parse(event.data);
    console.log(receivedData['data']);
    Object.assign(dataStore.userPosition, receivedData['data']);
  };


  ws.value.onclose = (event) => {
    console.log("WebSocket closed:", event);
    setTimeout(connectMarketWebSocket, RECONNECT_INTERVAL);  // 重新连接
  };

  ws.value.onerror = (error) => {
    console.error("WebSocket Error:", error);
  };
}


onMounted(() => {
  connectMarketWebSocket();
  connectUserWebSocket();
});

function fix2float(num) {
  return parseFloat(num).toFixed(2);
}

</script>

<template>
  <v-container>
    <v-window v-model="tab">
      <v-window-item value="1">
        <v-container>
          <stock-chart/>
          <v-row class="overflow-y-auto h-100">
            <v-col cols="12" md="4" v-for="(stockInfo, stockName) in dataStore.stock_data" :key="stockName">
              <v-card>
                <v-card-title>
                  <div class="font-weight-bold">{{ stockName }}</div>
                </v-card-title>
                <v-list>
                  <v-list-item>
                    <v-list-item-title class="d-flex justify-space-between">
                      <div class="font-weight-bold">前价</div>
                      <div>{{ stockInfo.previous }}</div>
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title class="d-flex justify-space-between">
                      <div class="font-weight-bold">现价</div>
                      <div>{{ stockInfo.now }}</div>
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title class="d-flex justify-space-between">
                      <div class="font-weight-bold">涨幅</div>
                      <div>{{ stockInfo.change }}</div>
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item class="d-flex justify-end">
                    <v-btn variant="flat" color="primary" @click="onExchangeButtonClick('BUY',stockName, stockInfo.now)">买入</v-btn>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-window-item>

      <v-window-item value="2">
        <v-container>
          <v-card class="mb-4" variant="outlined">
            <v-list>
              <v-list-item>
                <v-list-item-title class="d-flex justify-space-between">
                  <div class="font-weight-bold">持仓</div>
                  <div>{{fix2float(dataStore.userPosition.total_position)}}</div>
                </v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title class="d-flex justify-space-between">
                  <div class="font-weight-bold">持仓总盈亏</div>
                  <div>{{fix2float(dataStore.userPosition.total_profit)}}</div>
                </v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title class="d-flex justify-space-between">
                  <div class="font-weight-bold">现金</div>
                  <div>{{fix2float(dataStore.userPosition.balance)}}</div>
                </v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title class="d-flex justify-space-between">
                  <div class="font-weight-bold">资产总额</div>
                  <div>{{fix2float(dataStore.userPosition.total_position + dataStore.userPosition.balance)}}</div>
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card>
          <v-row>
            <v-col cols="12" md="4" v-for="(stockInfo, stockName) in dataStore.userPosition.position" :key="stockName">
              <v-card v-if="stockInfo.quantity !== 0">
                <v-card-title>
                  <div class="font-weight-bold">{{stockName}}</div>
                </v-card-title>
                <v-list>
                  <v-list-item>
                    <v-list-item-title class="d-flex justify-space-between">
                      <div class="font-weight-bold">现价</div>
                      <div>{{fix2float(stockInfo.current_price)}}</div>
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title class="d-flex justify-space-between">
                      <div class="font-weight-bold">买入均价</div>
                      <div>{{fix2float(stockInfo.purchase_avg_price)}}</div>
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title class="d-flex justify-space-between">
                      <div class="font-weight-bold">涨幅</div>
                      <div>{{fix2float(stockInfo.profit)}}</div>
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title class="d-flex justify-space-between">
                      <div class="font-weight-bold">持有数</div>
                      <div>{{stockInfo.quantity}}</div>
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item class="d-flex justify-end">
                    <v-btn color="primary" @click="onExchangeButtonClick('SELL',stockName, stockInfo.current_price)">卖出</v-btn>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-window-item>
    </v-window>
    <v-dialog
        @click:outside="onExchangeConfirmDialogClose"
        v-model="confirmDialog"
        width="500"
    >
      <v-card>
        <v-card-title>
          {{ confirmMessage.title }}
        </v-card-title>
        <v-divider></v-divider>
        <v-card-subtitle>
          您当前的余额为 {{ fix2float(dataStore.userPosition.balance)}}
        </v-card-subtitle>
        <v-card-text>
          <v-sheet>
            <div class='mb-2 font-weight-bold'>数量</div>
            <v-slider
                v-model='exchangeNumber'
                min='1'
                :max='exchangeMax'
                step='1'
                type="number"
                class='align-center use-cairo-font'
            >
              <!-- Box for user to enter number -->
              <template v-slot:append>
                <v-text-field
                    v-model='exchangeNumber'
                    hide-details
                    single-line
                    min='1'
                    :max='exchangeMax'
                    step='1'
                    density='compact'
                    type='number'
                    style='width: 100px'
                ></v-text-field>
              </template>
            </v-slider>
          </v-sheet>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="" variant="flat" @click="onExchangeConfirmDialogClose">取消</v-btn>
          <v-btn color="primary" variant="flat" @click="exchangeConfirm">{{confirmMessage.confirm}}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-bottom-navigation grow>
      <v-btn @click="tab='1'" value="recent">
        <v-icon>mdi-store-clock-outline</v-icon>

        <span>市场行情</span>
      </v-btn>

      <v-btn @click="tab='2'" value="favorites">
        <v-icon>mdi-cart-outline</v-icon>

        <span>持仓</span>
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
</route>