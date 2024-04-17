<script setup>
import {api, ioUrl} from '@/utils/api'
import {io} from 'socket.io-client'
// Required for snackbar background and text color
import { useDataStore } from '@/stores/data';

const dataStore = useDataStore();
import {useRouter} from "vue-router";
const router = useRouter()

dataStore.year = "🎉"

const resultData = ref(null)
onMounted(async () => {
  const response = await api.get('/game/user/result')
  resultData.value = response.data
})

</script>

<template>
  <v-container>
    <loading-tree text="游戏已经结束, 感谢参与"></loading-tree>
    <div class="text-h6 text-center" v-if="resultData">
      您的最终资产为:
    </div>
    <div class="text-h2 text-center mb-5" v-if="resultData">
      ${{resultData.data.final_result.toFixed(2)}}
    </div>
    <v-card v-if="resultData">
      <v-card-title>资产变化</v-card-title>
      <v-divider></v-divider>
      <v-table>
        <thead>
        <tr>
          <th>年份</th>
          <th>现金</th>
          <th>银行存款</th>
        </tr>
        </thead>
        <tbody>

        <tr v-for="(item, index) in resultData.data.record" :key="index">
          <td>{{item.year}}</td>
          <td>{{item.money.toFixed(2)}}</td>
          <td>{{item.bank.toFixed(2)}}</td>
        </tr>
        </tbody>
      </v-table>
      <v-card-subtitle class="my-3">
        * 资产变化中不包含最终未还的贷款的金额, 实际最终资产的现金计算公式为 (现金 + 银行存款 - 最后未还贷款金额)
      </v-card-subtitle>
    </v-card>

    <v-card v-if="resultData" class="mt-4">
      <v-card-title>借款记录</v-card-title>
      <v-divider></v-divider>
      <v-table>
        <thead>
        <tr>
          <th>开始年份</th>
          <th>借款周期</th>
          <th>借款金额</th>
          <th>还款金额</th>
          <th>状态</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item, index) in resultData.data.loan_records" :key="index">
          <td>{{item.start_year}}</td>
          <td>{{item.loan_period}}</td>
          <td>{{item.loan}}</td>
          <td>{{(item.loan * 1.02 ** item.loan_period).toFixed(2)}}</td>
          <td>
            <v-chip v-if="item.is_repay" color="green">已还款</v-chip>
            <v-chip v-else color="red">强制清算</v-chip>
          </td>
        </tr>
        </tbody>
      </v-table>
    </v-card>
  </v-container>
</template>


<style scoped>

</style>

<route lang="yaml">
meta:
  requiresAuth: false
  layout: login
</route>