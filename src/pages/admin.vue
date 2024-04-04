<script setup lang='ts'>
import api, {ioUrl} from '@/utils/api'
import {io} from 'socket.io-client'


const gameStatus = ref('unknown')
import { useDataStore } from '@/stores/data'

const dataStore = useDataStore();
const stockData = ref(null)
const userData = ref(null)
const loanData = ref(null)
const isNextIsSettlement = ref(null)
const finalResult = ref(null)
onMounted(async () => {
  // 自动更新record
  await getAllUser();
  await getAllLoan();
  await isNextSettlement();
  setInterval(async () => {
    await getAllUser();
    await getAllLoan();
    await isNextSettlement();
    console.log('update records')
  }, 10000)
})

async function isNextSettlement() {
  const res = await api.get('/game/admin/settlementorfinalize')
  isNextIsSettlement.value = res.data.is_next_settlement
}

function name2RgbColor(name: string) {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  const c = (hash & 0x00FFFFFF)
    .toString(16)
    .toUpperCase()
  return '#' + '00000'.substring(0, 6 - c.length) + c
}

const socket = io(`${ioUrl}/game`, {
  // 携带token进行连接
  auth: {
    token: localStorage.getItem('token')
  },
  transports: ['websocket'] // 强制使用WebSocket传输
})



socket.on('connect', async () => {
  await getGameStatus();
})

socket.on('disconnect', () => {
  console.log('socket disconnected')
//   每5秒重连一次
  setTimeout(() => {
    socket.connect()
  }, 5000)
})

socket.on('game_status', async (data) => {
  gameStatus.value = data.status
  if (data.status === 'pending' || data.status === 'settling') {

  } else if (data.status === 'running') {
    dataStore.year = data.current_year;
  } else if (data.status === 'finished'){

  }
})

socket.on('update_data', async (data) => {

})

async function getAllUser() {
  const response = await api.post('/user/all')
  userData.value = response.data.data
}

async function getGameStatus() {
  const res = await api.get('/game/get_stock_data')
  gameStatus.value = res.data.status
  if (res.data.status === 'pending' || res.data.status === 'settling') {
    // ignore
  } else if (res.data.status === 'running') {
    dataStore.year = res.data.current_year;
    stockData.value = res.data;
  } else if (res.data.status === 'finished'){
    const res = await api.get('/game/result')
    finalResult.value = handleResult(res.data.final_result)
  }
}

async function startGame() {
  await api.get('/game/admin/start')
}

async function getAllLoan() {
  const res = await api.get('/game/admin/loan/all')
  loanData.value = res.data.data
}

async function settlement() {
  const res = await api.get('/game/admin/settlement')
  if (res.data.status === 'success') {
    // ignore
  } else if (res.data.status === 'finished') {
    isNextIsSettlement.value = false
  }
}

async function finalize() {
  const res = await api.get('/game/admin/finalize')
  finalResult.value = handleResult(res.data.final_result)
}

function handleResult(input: any) {
  // { "admin": 9600 } 按照数值排序为列表 [{}, {}]
  return Object.entries(input).sort((a: any, b: any) => b[1] - a[1])
}

</script>

<template>
  <v-container class="fill-height align-content-start">
    <v-card class="w-100 mb-3" v-if="finalResult">
      <v-table>
        <thead>
        <tr>
          <th>用户名</th>
          <th>现金</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="result in finalResult">
          <td>{{ result[0] }}</td>
          <td>{{ result[1] }}</td>
        </tr>
        </tbody>
      </v-table>
    </v-card>
    <v-card class="w-100">
      <v-card-actions>
        <v-btn variant="elevated" :disabled="gameStatus !== 'pending'" @click="startGame">开始游戏</v-btn>
        <v-btn variant="elevated" color="error" @click="settlement" :disabled="isNextIsSettlement == null || isNextIsSettlement!=true || gameStatus !== 'running'">下一年</v-btn>
        <v-btn variant="elevated" color="error" @click="finalize" :disabled="isNextIsSettlement == null || isNextIsSettlement!=false ">结束游戏</v-btn>
      </v-card-actions>
      <v-list>
        <v-list-item>
          游戏状态: <v-chip>{{gameStatus}}</v-chip>
        </v-list-item>
      </v-list>
    </v-card>
    <v-expansion-panels class="mt-3" v-if="stockData">
      <v-expansion-panel >
        <v-expansion-panel-title>JSON股票数据</v-expansion-panel-title>
        <v-expansion-panel-text>
          <pre class="text-body-2">{{JSON.stringify(stockData, null, 2)}}</pre>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
    <v-expansion-panels class="mt-3" v-if="userData">
      <v-expansion-panel>
        <v-expansion-panel-title>用户数据</v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-table>
            <thead>
            <tr>
              <th>ID</th>
              <th>用户名</th>
              <th>现金</th>
              <th>银行存款</th>
              <th>借款额度</th>
              <th>密码</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="user in userData" v-show="!user.is_admin">
              <td>{{ user.id }}</td>
              <td>{{ user.username }}</td>
              <td>{{ user.money }}</td>
              <td>{{ user.bank }}</td>
              <td>{{ user.max_loan }}</td>
              <td>{{ user.password }}</td>
            </tr>
            </tbody>
          </v-table>
        </v-expansion-panel-text>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-title>JSON</v-expansion-panel-title>
        <v-expansion-panel-text>
          <pre class="text-body-2">{{JSON.stringify(userData, null, 2)}}</pre>
        </v-expansion-panel-text>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-title>CSV</v-expansion-panel-title>
        <v-expansion-panel-text>
          <pre class="text-body-2">ID,用户名,现金,银行存款,借款额度,密码<br><template v-for="user in userData">{{user.id}},{{user.username}},{{user.money}},{{user.bank}},{{user.max_loan}},{{user.password}}<br></template></pre>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
    <v-expansion-panels class="mt-3" v-if="loanData">
      <v-expansion-panel>
        <v-expansion-panel-title>借款数据</v-expansion-panel-title>
        <v-expansion-panel-text>

          <v-table>
            <thead>
            <tr>
              <th>ID</th>
              <th>用户名</th>
              <th>状态</th>
              <th>借款金额</th>
              <th>借款周期</th>
              <th>开始年份</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="loan in loanData">
              <td>{{ loan.id }}</td>
              <td>{{ loan.username }}</td>
              <td v-if="loan.is_repay"><v-chip color="green">已还款</v-chip></td><td v-else><v-chip color="red">未还款</v-chip></td>
              <td>{{ loan.loan }}</td>
              <td>{{ loan.loan_period }}</td>
              <td>{{ loan.start_year }}</td>
            </tr>
            </tbody>
          </v-table>
        </v-expansion-panel-text>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-title>JSON</v-expansion-panel-title>
        <v-expansion-panel-text>
          <pre class="text-body-2">{{JSON.stringify(loanData, null, 2)}}</pre>
        </v-expansion-panel-text>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-title>CSV</v-expansion-panel-title>
        <v-expansion-panel-text>
          <pre class="text-body-2">ID,用户名,状态,借款金额,借款周期,开始年份<br><template v-for="loan in loanData">{{loan.id}},{{loan.username}},{{loan.is_repay ? '已还款' : '未还款'}},{{loan.loan}},{{loan.loan_period}},{{loan.start_year}}<br></template></pre>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-container>
</template>


<style scoped>

</style>

<route lang="yaml">
meta:
  requiresAuth: true
  isAdmin: true
  layout: login
</route>