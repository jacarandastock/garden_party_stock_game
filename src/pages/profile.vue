<script setup>
import {api, ioUrl} from '@/utils/api'
import {io} from 'socket.io-client'
import { useDataStore } from '@/stores/data';


// Required for snackbar background and text color
import {useDisplay} from 'vuetify';

import {provide, ref} from "vue";
import {useRouter} from "vue-router";
const router = useRouter()


const dataStore = useDataStore();

const profileData = ref(null)
const operationRecord = ref(null)

const pending = ref(true);
// namespace: /game
const socket = io(`${ioUrl}/profile`, {
  // 携带token进行连接
  auth: {
    token: localStorage.getItem('token')
  },
  transports: ['websocket'] // 强制使用WebSocket传输
})


socket.on('connect', async () => {
  const response = await api.get('/game/get_game_status')
  if (response.data.status === 'pending' || response.data.status === 'settling') {
    pending.value = true;
  } else if (response.data.status === 'running') {
    await getProfile();
    // await getOperationRecord();
    dataStore.year = response.data.current_year;
    pending.value = false;
  } else if (response.data.status === 'finished'){
    await router.push('/result')
  }
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
    pending.value = true;
  } else if (data.status === 'running') {
    await getProfile();
    // await getOperationRecord();
    pending.value = false;
  } else if (data.status === 'finished'){
    await router.push('/result')
  }
})

async function getProfile() {
  const response = await api.post('/game/profile')
  profileData.value = response.data.data
  dataStore.profile = response.data.data.current_year
}

async function getOperationRecord() {
  const response = await api.post('/game/operation_record')
  operationRecord.value = response.data.data
}

</script>

<template>
  <v-container fluid class="fill-height align-content-start" v-if="profileData && !pending">
    <v-container>
      <v-card>
        <v-card-title>
          账户信息
        </v-card-title>
        <v-divider></v-divider>
        <v-list>
          <v-list-item>
            <template v-slot:prepend>
              <v-icon color="primary">mdi-cash</v-icon>
            </template>
            <v-list-item-title>现金</v-list-item-title>
            <v-list-item-subtitle>{{ profileData.money.toFixed(2) }}</v-list-item-subtitle>
          </v-list-item>
          <v-list-item>
            <template v-slot:prepend>
              <v-icon color="primary">mdi-bank</v-icon>
            </template>
            <v-list-item-title>银行存款</v-list-item-title>
            <v-list-item-subtitle>{{profileData.bank.toFixed(2)}}</v-list-item-subtitle>
          </v-list-item>

        </v-list>
      </v-card>
      <v-card class="mt-3">
        <v-card-title>借款</v-card-title>
        <v-divider></v-divider>
        <v-card-text v-if="profileData.loan">
          <v-alert
              density="compact"
              text="您必须还清之前的借款才能再次借款"
              icon="mdi-scale-balance"
              type="warning"
          ></v-alert>
        </v-card-text>
        <v-list>
          <v-list-item v-if="!profileData.loan">
            <template v-slot:prepend>
              <v-icon color="primary">mdi-currency-usd</v-icon>
            </template>
            <v-list-item-title>您今年的借款额度 <v-chip>当年开盘时所持总资产的20%</v-chip></v-list-item-title>
            <v-list-item-subtitle>{{profileData.max_loan.toFixed(2)}}</v-list-item-subtitle>
          </v-list-item>
          <v-list-item v-else>
            <template v-slot:prepend>
              <v-icon color="primary">mdi-currency-usd</v-icon>
            </template>
            <v-list-item-title>您当前借款</v-list-item-title>
            <v-list-item-subtitle>{{profileData.loan.loan.toFixed(2)}}</v-list-item-subtitle>
          </v-list-item>
          <v-list-item v-if="profileData.loan">
            <template v-slot:prepend>
              <v-icon color="primary">mdi-currency-usd</v-icon>
            </template>
            <v-list-item-title>借款周期</v-list-item-title>
            <v-list-item-subtitle>{{profileData.loan.loan_period}}</v-list-item-subtitle>
          </v-list-item>
          <v-list-item v-if="profileData.loan">
            <template v-slot:prepend>
              <v-icon color="primary">mdi-currency-usd</v-icon>
            </template>
            <v-list-item-title>需要偿还 (本金+利息)</v-list-item-title>
            <v-list-item-subtitle>{{profileData.loan.total_amount.toFixed(2)}}</v-list-item-subtitle>
          </v-list-item>
        </v-list>

      </v-card>
      <v-card class="mt-3">
        <v-card-title>当年持仓</v-card-title>
        <v-divider></v-divider>
        <v-table>
          <tbody>
          <tr>
            <th style="font-weight: bold;">股票名称</th>
            <th style="font-weight: bold;">持有数量</th>
            <th style="font-weight: bold;">持有市值</th>
          </tr>
          <tr v-for="(item,name) in profileData.current_year_stock" v-show="item > 0">
            <td>{{ name }}</td>
            <td>{{ item }} 股</td>
<!--            计算价格-->
            <td>${{ (item * profileData.current_year_stock_data[name]).toFixed(2) }}</td>
          </tr>
          </tbody>
        </v-table>

      </v-card>
      <v-card class="mt-3">
        <v-card-title>历史记录</v-card-title>
        <v-divider></v-divider>
<!--        {{profileData.previous_year_stock_data}}-->
        <v-table v-if="profileData.history">
          <tbody v-for='(item,year) in profileData.history'>
          <tr>
            <th>{{ year }}</th>
            <th></th>
          </tr>
          <tr>
            <th>股票名</th>
            <th>数量</th>
            <th>开盘价</th>
            <th>收盘价</th>
          </tr>
          <tr v-for="(i, name) in item">
            <td>{{ name }}</td>
            <td>{{ i }} 股</td>
<!--            计算价格-->
            <td>${{ profileData.previous_year_stock_data[name][year]["open"]}}</td>
            <td>${{ profileData.previous_year_stock_data[name][year]["close"]}}</td>
          </tr>
          </tbody>
        </v-table>
        <v-card-text v-else>
          暂无数据
        </v-card-text>
      </v-card>
<!--      <v-card class="mt-3" v-if="operationRecord">-->
<!--        <v-card-title>操作记录</v-card-title>-->
<!--        <v-divider></v-divider>-->
<!--        <v-table>-->
<!--          <tbody>-->
<!--          <tr>-->
<!--            <th style="font-weight: bold;">股票名称</th>-->
<!--            <th style="font-weight: bold;">类型</th>-->
<!--            <th style="font-weight: bold;">数量</th>-->
<!--            <th style="font-weight: bold;">价格</th>-->
<!--            <th style="font-weight: bold;">时间</th>-->
<!--          </tr>-->
<!--          <tr v-for="(item,name) in operationRecord">-->
<!--            <td>{{ item.stock_name }}</td>-->
<!--            <td>-->
<!--              <v-chip :color="item.stock_type==='buy'?'success':'error'">{{ item.stock_type }}</v-chip>-->
<!--            </td>-->
<!--            <td>{{ item.stock_number }} 股</td>-->
<!--            <td>${{ item.stock_price }}</td>-->
<!--            <td>{{ item.year }}</td>-->
<!--          </tr>-->
<!--          </tbody>-->
<!--        </v-table>-->

<!--      </v-card>-->
    </v-container>
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