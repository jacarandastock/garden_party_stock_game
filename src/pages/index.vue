<script setup>
import {api, ioUrl} from '@/utils/api'
import {io} from 'socket.io-client'


// Required for snackbar background and text color
import 'vuetify-sonner/style.css'
import {useDisplay} from 'vuetify';


import {use} from "echarts/core";
import {CanvasRenderer} from "echarts/renderers";
import {LineChart, PieChart} from "echarts/charts";
import {
  GridComponent,
  LegendComponent,
  MarkLineComponent,
  TitleComponent,
  ToolboxComponent,
  TooltipComponent
} from "echarts/components";
import VChart, {THEME_KEY} from "vue-echarts";
import {provide, ref} from "vue";
import {useRouter} from "vue-router";
import { useDataStore } from '@/stores/data'

const dataStore = useDataStore();

const router = useRouter()


use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  ToolboxComponent,
  GridComponent,
  MarkLineComponent,
  LineChart,
  CanvasRenderer,
  PieChart,
]);

provide(THEME_KEY, "dark");

const chartInstance = ref(null);
const {mobile} = useDisplay();

function resizeChart() {
  if (chartInstance.value) {
    chartInstance.value.resize();
  }
}

onMounted(async () => {
  window.addEventListener('resize', resizeChart);
});

onUnmounted(() => {
  window.removeEventListener('resize', resizeChart);
});


const stockData = ref(null);

// namespace: /game
const socket = io(`${ioUrl}/game`, {
  // 携带token进行连接
  auth: {
    token: localStorage.getItem('token')
  },
  transports: ['websocket'] // 强制使用WebSocket传输
})



socket.on('connect', async () => {
  await updateStockData();
})

socket.on('disconnect', () => {
  console.log('socket disconnected')
//   每5秒重连一次
  setTimeout(() => {
    socket.connect()
  }, 5000)
})

socket.on('game_status', async (data) => {
  if (data.status === 'pending' || data.status === 'settling') {
    // 清空数据
    stockData.value = null;
    // 关闭所有弹窗
    dialogs.value.buy = false;
    dialogs.value.sell = false;
  } else if (data.status === 'running') {
    await updateStockData();
  } else if (data.status === 'finished'){
    await router.push('/result')
  }
})

socket.on('update_data', async (data) => {
  await updateStockData();
})

async function updateStockData() {
  const res = await api.get('/game/get_stock_data')
  // console.log(res.data)
  if (res.data.status === 'pending' || res.data.status === 'settling') {
    // 清空数据
    stockData.value = null;
    // 关闭所有弹窗
    dialogs.value.buy = false;
    dialogs.value.sell = false;
  } else if (res.data.status === 'running') {
    stockData.value = res.data;
    dataStore.year = res.data.current_year;
    //取第一个股票的数据
    graph.value = Object.keys(stockData.value['data'])[0];
    option.value.series[0].data = stockData.value['data'][Object.keys(stockData.value['data'])[0]].open;
    option.value.series[1].data = stockData.value['data'][Object.keys(stockData.value['data'])[0]].close;
  } else if (res.data.status === 'finished'){
    await router.push('/result')
  }
}


const option = ref({
  title: {
    text: '股票走势图',
  },
  tooltip: {
    trigger: 'axis'
  },
  legend: {},
  toolbox: {
    show: true,
    feature: {
      // dataView: { readOnly: false },
      // restore: {},
      // saveAsImage: {}
    }
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['2016', '2017', '2018', '2019', '2020'],
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      formatter: '${value}'
    }
  },
  series: [
    {
      name: '开盘价',
      lineStyle: {color: '#ff0000'},
      type: 'line',
      itemStyle: {
        color: '#ff0000'
      },
      data: [],
    },
    {
      name: '收盘价',
      type: 'line',
      lineStyle: {color: '#03ea03'},
      itemStyle: {
        color: '#03ea03'
      },
      data: [],
    }
  ]
});

const graph = ref(null);

function changeGraphData(name) {
  // if (graph.value === 'all') {
  //   option.value.series[0].data = Array.from({length: 7}, () => Math.floor(Math.random() * 10) + 1);
  //   option.value.series[1].data = Array.from({length: 7}, () => Math.floor(Math.random() * 10) + 1);
  //   return;
  // }
  option.value.series[0].data = stockData.value['data'][name].open;
  option.value.series[1].data = stockData.value['data'][name].close;
}

const dialogs = ref({
  buy: false,
  sell: false
})

const displayInfo = ref({
  loading: true,
  snackbar: false,
  text: '',
  money: 0,
  maxExchangeNumber: 0,
  exchangeNumber: 0,
  requesting: false,
  hold: 0,
})

async function buyStockCheck() {
  displayInfo.value.loading = true;
  displayInfo.value.money = 0;
  displayInfo.value.requesting = false;
  displayInfo.value.exchangeNumber = 0;
  displayInfo.value.maxExchangeNumber = 0;
  dialogs.value.buy = true;
  const response = await api.post('/user/money')
  if (response.data.status === 'error') {
    displayInfo.value.text = '网络波动，请稍后再试'
    displayInfo.value.snackbar = true;
    dialogs.value.buy = false;
    return;
  }
  displayInfo.value.money = response.data.money;
  displayInfo.value.maxExchangeNumber = Math.floor(response.data.money / stockData.value['data'][graph.value].open[stockData.value['data'][graph.value].open.length - 1]);
  displayInfo.value.loading = false;
}

async function postBuy() {
  displayInfo.value.requesting = true;
  try {
    const response = await api.post('/game/buy', {
      stock: graph.value,
      number: displayInfo.value.exchangeNumber,
      price: stockData.value['data'][graph.value].open[stockData.value['data'][graph.value].open.length - 1],
    })
    if (response.data.status === 'success') {
      dialogs.value.buy = false;
      displayInfo.value.requesting = false;
      return;
    }
  } catch (e) {
    console.log(e)
  }
  displayInfo.value.text = '网络波动，请稍后再试';
  displayInfo.value.snackbar = true;
  displayInfo.value.requesting = false;
}

async function sellStockCheck() {
  displayInfo.value.loading = true;
  displayInfo.value.hold = 0;
  displayInfo.value.requesting = false;
  displayInfo.value.exchangeNumber = 0;
  displayInfo.value.maxExchangeNumber = 0;
  dialogs.value.sell = true;
  const response = await api.post('/game/hold/' + graph.value)
  if (response.data.status === 'error') {
    displayInfo.value.text = '网络波动，请稍后再试'
    displayInfo.value.snackbar = true;
    dialogs.value.buy = false;
    return;
  }
  displayInfo.value.hold = response.data.stock_number;
  displayInfo.value.maxExchangeNumber = response.data.stock_number;
  displayInfo.value.loading = false;
}

async function postSell() {
  displayInfo.value.requesting = true;
  try {
    const response = await api.post('/game/sell', {
      stock: graph.value,
      number: displayInfo.value.exchangeNumber,
      price: stockData.value['data'][graph.value].open[stockData.value['data'][graph.value].open.length - 1],
    })
    if (response.data.status === 'success') {
      dialogs.value.sell = false;
      displayInfo.value.requesting = false;
      return;
    }
  } catch (e) {
    console.log(e)
  }
  displayInfo.value.text = '网络波动，请稍后再试';
  displayInfo.value.snackbar = true;
  displayInfo.value.requesting = false;
}

</script>

<template>
  <v-container fluid class="fill-height align-content-start" v-if="stockData">
    <v-snackbar
        v-model="displayInfo.snackbar"
    >
      {{ displayInfo.text }}
      <template v-slot:actions>
        <v-btn
            color="pink"
            variant="text"
            @click="displayInfo.snackbar = false"
        >
          关闭
        </v-btn>
      </template>
    </v-snackbar>
    <v-select
        v-model="graph"
        :items="Object.keys(stockData.data)"
        density="compact"
        hide-details
        @update:modelValue="changeGraphData"
        label="快速选择"
        :class="mobile?'':'mx-2'"
    ></v-select>
    <v-tabs v-model="graph" align-tabs="start" class="my-2">
      <!--                <v-tab value="all" rounded="0" elevation="0" variant="elevated" @click="changeGraphData">All</v-tab>-->
      <v-tab rounded="0" v-for="(item, name) in stockData.data" elevation="0" variant="elevated" :value="name"
             @click="changeGraphData(name)">{{ name }}
      </v-tab>
    </v-tabs>
    <v-chart ref="chartInstance" style="height: 50vh;" class="chart my-2" :option="option"/>
    <v-card class="w-100">
      <v-table density="compact" hover>
        <thead>
        <tr>
          <th class="text-left font-weight-bold">
            年份
          </th>
          <th class="text-left font-weight-bold">
            开盘价
          </th>
          <th class="text-left font-weight-bold">
            收盘价
          </th>
        </tr>
        </thead>
        <tbody>
        <!--高亮最新的数据-->
        <tr v-for="(data, index) in option.series[0].data" :key="index" v-if="option.series[0].data.length > 0">
          <td>
            {{ stockData.total_year[index] }}
          </td>
          <td>
            {{ option.series[0].data[index] ? option.series[0].data[index] : 'N/A' }}
            <v-icon v-if="index === option.series[0].data.length - 1" color="red">mdi-new-box</v-icon>
          </td>
          <td>
            {{ option.series[1].data[index] ? option.series[1].data[index] : 'N/A' }}
          </td>
        </tr>
        </tbody>
      </v-table>
      <v-card-actions>
        <v-card-item>{{ graph }}</v-card-item>
        <v-spacer></v-spacer>
        <v-dialog max-width="500" v-model="dialogs.buy">
          <template v-slot:activator>
            <v-btn color="info" variant="elevated" @click="buyStockCheck">买入</v-btn>
          </template>

          <template v-slot:default>
            <v-list
                v-if="displayInfo.loading"
                class="py-2"
                color="primary"
                elevation="12"
                rounded="lg"
            >
              <!-- 公平秤的icon-->
              <v-list-item
                  prepend-icon="mdi-scale-balance"
                  title="正在与服务端同步..."
              >
                <template v-slot:prepend>
                  <div class="pe-4">
                    <v-icon color="primary" size="x-large"></v-icon>
                  </div>
                </template>

                <template v-slot:append>
                  <v-progress-circular
                      color="primary"
                      indeterminate="disable-shrink"
                      size="16"
                      width="2"
                  ></v-progress-circular>
                </template>
              </v-list-item>
            </v-list>
            <v-card v-else>
              <!-- 强调 {{graph}} 的信息-->
              <v-card-title>
                买入<span style="color: red">{{ graph }}</span>股票
              </v-card-title>
              <v-divider></v-divider>
              <v-card-text>
                <v-row>
                  <v-col cols="12" md="6">
                    当前余额: ${{ displayInfo.money }}
                  </v-col>
                  <v-col cols="12" md="6">
                    价格: ${{ stockData.data[graph].open[stockData.data[graph].open.length - 1] }}
                  </v-col>
                  <!-- 给一个划框的输入框-->
                  <v-col cols="12">
                    买入数量
                    <v-slider
                        :disabled="displayInfo.maxExchangeNumber <= 0"
                        v-model="displayInfo.exchangeNumber"
                        :max="displayInfo.maxExchangeNumber"
                        min="1"
                        thumb-label
                        thumb-size="24"
                        step="1"
                    >
                      <template v-slot:append>
                        {{ displayInfo.exchangeNumber }}
                      </template>
                    </v-slider>
                  </v-col>
                  <v-col cols="12" >
                    您将花费: ${{ (displayInfo.exchangeNumber * stockData.data[graph].open[stockData.data[graph].open.length - 1]).toFixed(2) }}
                  </v-col>
                </v-row>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    text="取消"
                    color="primary"
                    variant="elevated"
                    @click="dialogs.buy = false"
                ></v-btn>
                <v-btn
                    text="确定"
                    color="error"
                    variant="elevated"
                    :loading="displayInfo.requesting"
                    :disabled="displayInfo.exchangeNumber <= 0 || displayInfo.exchangeNumber > displayInfo.maxExchangeNumber || displayInfo.exchangeNumber === 0"
                    @click="postBuy"
                ></v-btn>
              </v-card-actions>
            </v-card>
          </template>
        </v-dialog>
        <v-dialog max-width="500" v-model="dialogs.sell">
          <template v-slot:activator>
            <v-btn color="error" variant="elevated" @click="sellStockCheck">卖出</v-btn>
          </template>

          <template v-slot:default>
            <v-list
                v-if="displayInfo.loading"
                class="py-2"
                color="primary"
                elevation="12"
                rounded="lg"
            >
              <!-- 公平秤的icon-->
              <v-list-item
                  prepend-icon="mdi-scale-balance"
                  title="正在与服务端同步..."
              >
                <template v-slot:prepend>
                  <div class="pe-4">
                    <v-icon color="primary" size="x-large"></v-icon>
                  </div>
                </template>

                <template v-slot:append>
                  <v-progress-circular
                      color="primary"
                      indeterminate="disable-shrink"
                      size="16"
                      width="2"
                  ></v-progress-circular>
                </template>
              </v-list-item>
            </v-list>
            <v-card v-else>
              <!-- 强调 {{graph}} 的信息-->
              <V-card-title>
                卖出<span style="color: red">{{ graph }}</span>股票
              </V-card-title>
              <v-divider></v-divider>
              <v-card-text>
                <v-row>
                  <v-col cols="12" md="6">
                    价格: ${{ stockData.data[graph].open[stockData.data[graph].open.length - 1] }}
                  </v-col>
                  <v-col cols="12" md="6">
                    持有数量 {{displayInfo.hold}}
                  </v-col>
                  <!-- 给一个划框的输入框-->
                  <v-col cols="12" v-if="displayInfo.hold > 0">
                    卖出数量
                    <v-slider
                        :disabled="displayInfo.maxExchangeNumber <= 0"
                        v-model="displayInfo.exchangeNumber"
                        :max="displayInfo.maxExchangeNumber"
                        min="1"
                        thumb-label
                        thumb-size="24"
                        step="1"
                    >
                      <template v-slot:append>
                        {{ displayInfo.exchangeNumber }}
                      </template>
                    </v-slider>
                  </v-col>
                  <v-col cols="12" v-if="displayInfo.hold > 0">
                    您将得到: ${{ (displayInfo.exchangeNumber * stockData.data[graph].open[stockData.data[graph].open.length - 1]).toFixed(2) }}
                  </v-col>
                  <v-col v-if="displayInfo.hold <= 0" class="text-center d-flex justify-center align-center ">
                    <v-icon>mdi-scale-balance</v-icon>
                    <div class="ml-2">您当前未持有该股票</div>
                  </v-col>
                </v-row>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    text="取消"
                    color="primary"
                    variant="elevated"
                    @click="dialogs.sell = false"
                ></v-btn>
                <v-btn
                    text="确定"
                    color="error"
                    variant="elevated"
                    :loading="displayInfo.requesting"
                    :disabled="displayInfo.exchangeNumber <= 0 || displayInfo.exchangeNumber > displayInfo.maxExchangeNumber || displayInfo.exchangeNumber === 0"
                    @click="postSell"
                ></v-btn>
              </v-card-actions>
            </v-card>
          </template>
        </v-dialog>
      </v-card-actions>
    </v-card>

  </v-container>
  <v-container v-else>
    <loading-tree></loading-tree>
  </v-container>
</template>


<style scoped>

</style>

<route lang="yaml">
meta:
requiresAuth: false
</route>