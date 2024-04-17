<script setup>
import {api, ioUrl} from '@/utils/api'
import {io} from 'socket.io-client'

// Required for snackbar background and text color
import {useDisplay} from 'vuetify';
import { useDataStore } from '@/stores/data'

const dataStore = useDataStore();
import {provide, ref} from "vue";
import {useRouter} from "vue-router";
const router = useRouter()
const dialogs = ref({
  deposit: false,
  withdraw: false,
  loan: false,
  repay: false
})

const pending = ref(true);
// namespace: /game
const socket = io(`${ioUrl}/bank`, {
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
  if (data.status === 'pending' || data.status === 'settling') {
    pending.value = true;
    // 关闭所有弹窗
    dialogs.value.deposit = false;
    dialogs.value.withdraw = false;
    dialogs.value.loan = false;
    dialogs.value.repay = false;
  } else if (data.status === 'running') {
    dataStore.year = data.current_year;
    pending.value = false;
  } else if (data.status === 'finished'){
    await router.push('/result')
  }
})

async function getGameStatus() {
  const response = await api.get('/game/get_game_status')
  if (response.data.status === 'pending' || response.data.status === 'settling') {
    pending.value = true;
    // 关闭所有弹窗
    dialogs.value.deposit = false;
    dialogs.value.withdraw = false;
    dialogs.value.loan = false;
    dialogs.value.repay = false;
  } else if (response.data.status === 'running') {
    dataStore.year = response.data.current_year;
    pending.value = false;
  } else if (response.data.status === 'finished'){
    await router.push('/result')
  }
}

async function deposit() {
  dialogs.value.deposit = true
  displayInfo.value.loading = true;
  displayInfo.value.money = 0;
  displayInfo.value.requesting = false;
  displayInfo.value.exchangeNumber = 0;
  displayInfo.value.maxExchangeNumber = 0;
  const response = await api.post('/user/money')
  if (response.data.status === 'error') {
    displayInfo.value.text = '网络波动，请稍后再试'
    displayInfo.value.snackbar = true;
    dialogs.value.buy = false;
    return;
  }
  displayInfo.value.money = response.data.money;
  displayInfo.value.maxExchangeNumber = response.data.money;
  displayInfo.value.loading = false;
}

async function withdraw() {
  dialogs.value.withdraw = true
  displayInfo.value.loading = true;
  displayInfo.value.money = 0;
  displayInfo.value.requesting = false;
  displayInfo.value.exchangeNumber = 0;
  displayInfo.value.maxExchangeNumber = 0;
  const response = await api.post('/user/bank')
  if (response.data.status === 'error') {
    displayInfo.value.text = '网络波动，请稍后再试'
    displayInfo.value.snackbar = true;
    dialogs.value.buy = false;
    return;
  }
  displayInfo.value.money = response.data.money;
  displayInfo.value.maxExchangeNumber = response.data.money;
  displayInfo.value.loading = false;
}

async function loan() {
  dialogs.value.loan = true
  displayInfo.value.loading = true;
  displayInfo.value.money = 0;
  displayInfo.value.warningText = '';
  displayInfo.value.requesting = false;
  displayInfo.value.exchangeNumber = 0;
  displayInfo.value.maxExchangeNumber = 0;
  const response = await api.post('/user/loan/max')
  console.log(response)
  if (response.data.status === 'error') {
    displayInfo.value.text = '网络波动，请稍后再试'
    displayInfo.value.snackbar = true;
    dialogs.value.buy = false;
    return;
  } else if (response.data.status === 'warning'){
    displayInfo.value.warningText = response.data.message;
    displayInfo.value.loading = false;
    return;
  }
  displayInfo.value.money = response.data.max_loan;
  displayInfo.value.maxExchangeNumber = response.data.max_loan;
  displayInfo.value.loading = false;
}

async function repay() {
  dialogs.value.repay = true
  displayInfo.value.loading = true;
  displayInfo.value.warningText = '';
  displayInfo.value.requesting = false;
  displayInfo.value.total = 0;
  displayInfo.value.money = 0;
  displayInfo.value.period = 0;
  displayInfo.value.interest = 0;
  dialogs.value.buy = true;
  const response = await api.post('/user/repay/info')
  console.log(response)
  if (response.data.status === 'error') {
    displayInfo.value.text = '网络波动，请稍后再试'
    displayInfo.value.snackbar = true;
    dialogs.value.buy = false;
    return;
  } else if (response.data.status === 'warning'){
    displayInfo.value.warningText = response.data.message;
    displayInfo.value.loading = false;
    return;
  }
  displayInfo.value.total = response.data.total;
  displayInfo.value.period = response.data.period;
  displayInfo.value.interest = response.data.interest;
  displayInfo.value.money = response.data.loan;
  displayInfo.value.loading = false;
}

async function postDeposit() {
  displayInfo.value.requesting = true;
  try {
    const response = await api.post('/user/deposit', {
      money: displayInfo.value.exchangeNumber,
    })
    if (response.data.status === 'success') {
      dialogs.value.deposit = false;
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

async function postWithdraw() {
  displayInfo.value.requesting = true;
  try {
    const response = await api.post('/user/withdraw', {
      money: displayInfo.value.exchangeNumber,
    })
    if (response.data.status === 'success') {
      dialogs.value.withdraw = false;
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

async function postLoan(){
  displayInfo.value.requesting = true;
  try {
    const response = await api.post('/user/loan', {
      money: displayInfo.value.exchangeNumber,
      year: dataStore.year,
    })
    if (response.data.status === 'success') {
      dialogs.value.loan = false;
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

async function postRepay(){
  displayInfo.value.requesting = true;
  try {
    const response = await api.post('/user/repay')
    if (response.data.status === 'success') {
      dialogs.value.repay = false;
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

const displayInfo = ref({
  loading: true,
  snackbar: false,
  text: '',
  valid: false,
  money: 0,
  maxExchangeNumber: 0,
  exchangeNumber: 0,
  requesting: false,
  hold: 0,
  warningText: '',
  total: 0,
  period: 0,
  interest: 0,
})

const rules = [
  value => !!value || '必填',
  value => {
  //整数或者是两位小数
    const pattern =  /^([1-9]\d*|0)(\.\d{1,2})?$/
    return pattern.test(value) || '请输入有效数字'
  },
]

</script>

<template>
  <v-container fluid class="fill-height align-content-start" v-if="!pending">
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
    <v-container class="fill-height d-flex align-center justify-center w-100 text-center flex-column">
      <v-icon size="150">mdi-bank</v-icon>
      <v-dialog max-width="450">
        <template v-slot:activator="{ props: activatorProps }">
          <v-btn
              v-bind="activatorProps"
              color="surface-variant"
              prepend-icon="mdi-information"
              text="重要信息"
              variant="outlined"
          ></v-btn>
        </template>

        <template v-slot:default="{ isActive }">
          <v-card title="银行信息">
            <v-card-text>
              <v-row>
                <v-col cols="12">
                  借款利率: <v-chip color="error">2.0%</v-chip>
                </v-col>
                <v-col cols="12">
                  借款利息计算公式: (P * (1 + i)^n) - P)
                </v-col>
                <v-col cols="12">
                  存款利率: <v-chip color="success">1.5%</v-chip>
                </v-col>
                <v-col cols="12">
                  存款利息计算公式: (P * (1 + i)^n) - P)
                </v-col>
                <v-col cols="12">
                  最大借款额度: 当年开盘时所持总资产的 <v-chip>20%</v-chip>
                </v-col>
              </v-row>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn
                  text="我已知晓"
                  block=""
                  @click="isActive.value = false"
                  variant="elevated"
              ></v-btn>
            </v-card-actions>
          </v-card>
        </template>
      </v-dialog>
      <v-divider class="my-2"></v-divider>
      <v-row>
        <v-col cols="6" class="d-flex justify-center align-center">
          <v-dialog max-width="500" v-model="dialogs.deposit">
            <template v-slot:activator>
              <v-card @click="deposit" height="180" width="180" class="d-flex flex-column justify-center align-center" color="primary">
                <v-icon size="40">mdi-bank-transfer-in</v-icon>
                <span class="text-h6">存入</span>
              </v-card>
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
                  存款
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text>
                  <v-row>
                    <v-col cols="12" md="6">
                      现金余额: ${{ displayInfo.money.toFixed(2) }}
                    </v-col>
                    <v-col cols="12" md="6">
                      固定利率: <v-chip color="success">1.5%</v-chip>
                    </v-col>
                    <!-- 给一个划框的输入框-->
                    <v-col cols="12">
                      存入金额:
                      <v-form v-model="displayInfo.valid">
                        <v-text-field
                            min="0.01"
                            :disabled="displayInfo.maxExchangeNumber <= 0"
                            v-model="displayInfo.exchangeNumber"
                            :max="displayInfo.maxExchangeNumber"
                            :rules="rules"
                            type="number"
                            step="0.01"
                        ></v-text-field>
                      </v-form>
                    </v-col>
                  </v-row>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                      text="取消"
                      color="primary"
                      variant="elevated"
                      @click="dialogs.deposit = false"
                  ></v-btn>
                  <v-btn
                      text="确定"
                      color="error"
                      variant="elevated"
                      :loading="displayInfo.requesting"
                      :disabled="!displayInfo.valid || displayInfo.exchangeNumber <= 0 || displayInfo.exchangeNumber > displayInfo.maxExchangeNumber || displayInfo.exchangeNumber === 0"
                      @click="postDeposit"
                  ></v-btn>
                </v-card-actions>
              </v-card>
            </template>
          </v-dialog>
        </v-col>
        <v-col cols="6" class="d-flex justify-center align-center">
          <v-dialog max-width="500" v-model="dialogs.withdraw">
            <template v-slot:activator>
              <v-card @click="withdraw" height="180" width="180" class="d-flex flex-column justify-center align-center" >
                <v-icon size="40">mdi-bank-transfer-out</v-icon>
                <span class="text-h6">取出</span>
              </v-card>
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
                  取款
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text>
                  <v-row>
                    <v-col cols="12" md="6">
                      银行余额: ${{ displayInfo.money.toFixed(2) }}
                    </v-col>
                    <!-- 给一个划框的输入框-->
                    <v-col cols="12">
                      取出金额:
                      <v-form v-model="displayInfo.valid">
                        <v-text-field
                            min="0.01"
                            :disabled="displayInfo.maxExchangeNumber <= 0"
                            v-model="displayInfo.exchangeNumber"
                            :max="displayInfo.maxExchangeNumber"
                            :rules="rules"
                            type="number"
                            step="0.01"
                        ></v-text-field>
                      </v-form>
                    </v-col>
                  </v-row>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                      text="取消"
                      color="primary"
                      variant="elevated"
                      @click="dialogs.withdraw = false"
                  ></v-btn>
                  <v-btn
                      text="确定"
                      color="error"
                      variant="elevated"
                      :loading="displayInfo.requesting"
                      :disabled="!displayInfo.valid || displayInfo.exchangeNumber <= 0 || displayInfo.exchangeNumber > displayInfo.maxExchangeNumber || displayInfo.exchangeNumber === 0"
                      @click="postWithdraw"
                  ></v-btn>
                </v-card-actions>
              </v-card>
            </template>
          </v-dialog>

        </v-col>
        <v-col cols="6" class="d-flex justify-center align-center">
          <v-dialog max-width="500" v-model="dialogs.loan">
            <template v-slot:activator>
              <v-card @click="loan" height="180" width="180" class="d-flex flex-column justify-center align-center" color="primary">
                <v-icon size="40">mdi-cash-plus</v-icon>
                <span class="text-h6">借款</span>
              </v-card>
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
              <v-card v-else-if="displayInfo.warningText">
                <!-- 强调 {{graph}} 的信息-->
                <v-card-title>
                  借款
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text>
                  <v-alert
                      density="compact"
                      text="您必须还清之前的借款才能再次借款"
                      :title="displayInfo.warningText"
                      icon="mdi-scale-balance"
                      type="warning"
                  ></v-alert>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                      text="确定"
                      color="primary"
                      variant="elevated"
                      @click="dialogs.loan = false"
                  ></v-btn>
                </v-card-actions>
              </v-card>
              <v-card v-else>
                <!-- 强调 {{graph}} 的信息-->
                <v-card-title>
                  借款
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text>
                  <v-row>
                    <v-col cols="12" >
                      <v-alert
                          color="info"
                          density="compact"
                          text="借款存在期间，您将无法再次借款"
                          icon="mdi-information"
                          type="success"
                      ></v-alert>
                    </v-col>
                    <v-col cols="12" md="6">
                      您的最大借款额度: ${{ displayInfo.money.toFixed(2) }}
                    </v-col>
                    <v-col cols="12" md="6">
                      借款利息: <v-chip color="error">2.0%</v-chip>
                    </v-col>
                    <!-- 给一个划框的输入框-->
                    <v-col cols="12">
                      借款金额:
                      <v-form v-model="displayInfo.valid">
                        <v-text-field
                            min="0.01"
                            :disabled="displayInfo.maxExchangeNumber <= 0"
                            v-model="displayInfo.exchangeNumber"
                            :max="displayInfo.maxExchangeNumber"
                            :rules="rules"
                            type="number"
                            step="0.01"
                        ></v-text-field>
                      </v-form>
                    </v-col>
                  </v-row>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                      text="取消"
                      color="primary"
                      variant="elevated"
                      @click="dialogs.loan = false"
                  ></v-btn>
                  <v-btn
                      text="确定"
                      color="error"
                      variant="elevated"
                      :loading="displayInfo.requesting"
                      :disabled="!displayInfo.valid || displayInfo.exchangeNumber <= 0 || displayInfo.exchangeNumber > displayInfo.maxExchangeNumber || displayInfo.exchangeNumber === 0"
                      @click="postLoan"
                  ></v-btn>
                </v-card-actions>
              </v-card>
            </template>
          </v-dialog>

        </v-col>
        <v-col cols="6" class="d-flex justify-center align-center">
          <v-dialog max-width="500" v-model="dialogs.repay">
            <template v-slot:activator>
              <v-card @click="repay" height="180" width="180" class="d-flex flex-column justify-center align-center" >
                <v-icon size="40">mdi-cash-refund</v-icon>
                <span class="text-h6">还款</span>
              </v-card>
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
              <v-card v-else-if="displayInfo.warningText">
                <!-- 强调 {{graph}} 的信息-->
                <v-card-title>
                  还款
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text>
                  <v-alert
                      density="compact"
                      text="您可以使用借款功能来借款"
                      :title="displayInfo.warningText"
                      icon="mdi-check-bold"
                      type="success"
                  ></v-alert>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                      text="确定"
                      color="primary"
                      variant="elevated"
                      @click="dialogs.repay = false"
                  ></v-btn>
                </v-card-actions>
              </v-card>
              <v-card v-else>
                <!-- 强调 {{graph}} 的信息-->
                <v-card-title>
                  还款
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text>
                  <v-row>
                    <v-col cols="12" md='4'>
                      您借款的金额: ${{ displayInfo.money.toFixed(2) }}
                    </v-col>
                    <v-col cols="12" md="4">
                      需付利息: ${{ displayInfo.interest.toFixed(2) }}
                    </v-col>
                    <v-col cols="12" md="4">
                      已借款周期: {{ displayInfo.period }}
                    </v-col>
                    <v-col cols="12">
                      总计: ${{ displayInfo.total.toFixed(2) }}
                    </v-col>
                  </v-row>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                      text="取消"
                      color="primary"
                      variant="elevated"
                      @click="dialogs.repay = false"
                  ></v-btn>
                  <v-btn
                      text="确定还款"
                      color="error"
                      variant="elevated"
                      :loading="displayInfo.requesting"
                      @click="postRepay"
                  ></v-btn>
                </v-card-actions>
              </v-card>
            </template>
          </v-dialog>
        </v-col>
      </v-row>

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