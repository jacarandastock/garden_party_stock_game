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
        <v-list>
          <v-list-item>
            <template v-slot:prepend>
              <v-icon color="primary">mdi-currency-usd</v-icon>
            </template>
            <v-list-item-title>您今年的借款额度</v-list-item-title>
            <v-list-item-subtitle>{{profileData.max_loan.toFixed(2)}}</v-list-item-subtitle>
          </v-list-item>
          <v-list-item v-if="profileData.loan">
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
            <v-list-item-title>需付利息</v-list-item-title>
            <v-list-item-subtitle>{{profileData.loan.interest.toFixed(2)}}</v-list-item-subtitle>
          </v-list-item>
        </v-list>

      </v-card>
      <v-card class="mt-3">
        <v-card-title>当年持仓</v-card-title>
        <v-divider></v-divider>
        <v-table>
          <tbody>
          <tr v-for="(item,name) in profileData.current_year_stock">
            <td>{{ name }}</td>
            <td>{{ item }}</td>
          </tr>
          </tbody>
        </v-table>

      </v-card>
      <v-card class="mt-3">
        <v-card-title>历史记录</v-card-title>
        <v-divider></v-divider>
        <v-table v-if="profileData.history.length > 0">
          <tbody v-for='(item,year) in profileData.history'>
          <tr>
            <td>{{ year }}</td>
            <td></td>
          </tr>
          <tr v-for="(i, name) in item">
            <td>{{ name }}</td>
            <td>{{ i }}</td>
          </tr>
          </tbody>
        </v-table>
        <v-card-text v-else>
          暂无数据
        </v-card-text>
      </v-card>

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