<script setup lang='ts'>
import { useI18n } from 'vue-i18n'
import { useDisplay } from 'vuetify'
import { useRouter } from 'vue-router'
import api from '@/utils/api'
import { setToken } from '@/utils/api'

const router = useRouter()
const { t } = useI18n()

const imageSrc = ref('https://cdn.devdojo.com/images/november2020/hero-image.jpeg')
const username = ref('')
const password = ref('')
const errorMessage = ref({
  username: '',
  password: ''
})

// 判断是不是移动端
const { name } = useDisplay()
const isMobile = computed(() => name.value === 'xs')
const loading = ref(true)

onMounted(() => {
  loading.value = false
})


async function login() {
  try {
    if (username.value === '') {
      errorMessage.value.username = '用户名不能为空'
      return
    }
    const response = await api.post('/login', { 'username': username.value, 'password': password.value })
    if (response.data.status === 'success') {
      setToken(response.data.access_token)
      await router.push(response.data.redirect)
      return
    } else {
      errorMessage.value.username = response.data.message
      errorMessage.value.password = ' '
    }
    // console.log(response)
  } catch (error) {
    console.log(error)
  }
}


async function register() {
  try {
    if (username.value === '') {
      errorMessage.value.username = '用户名不能为空'
      return
    }
    const response = await api.post('/register', { 'username': username.value, 'password': password.value })
    if (response.data.status === 'success') {
      setToken(response.data.access_token)
      await router.push(response.data.redirect)
      return
    } else {
      errorMessage.value.username = response.data.message
      errorMessage.value.password = ' '
    }
  } catch (error) {
    console.log(error)
  }
}

</script>

<template>
  <v-container class="fill-height">
    <div v-if="loading" class="fill-height d-flex align-center justify-center w-100">
      <div>
        <v-progress-circular
          color="deep-purple-accent-4"
          indeterminate
          rounded
          :size="50"
        ></v-progress-circular>
      </div>
    </div>
    <v-row v-else class="h-100 d-flex align-center">
      <v-col cols="12" md="6">
        <v-card class="pa-6 bg-transparent" elevation="0">
          <div class="font-weight-bold text-h4 text-md-h2">
            蓝楹会<br />
            Jacaranda Stock
          </div>
          <!--          <div class="text-h2 font-weight-bold text-primary">-->
          <!--            游园会-->
          <!--          </div>-->
          <div class="text-subtitle-1">
            合格投资者的摇篮
          </div>
          <v-form>
            <v-text-field
              v-model="username"
              :error-messages="errorMessage.username"
              validate-on="input"
              label="用户名"
              outlined
              :rules="[(v:any) => v.length > 0 || '用户名不能为空']"
              class="mt-4"
              required
              @input="errorMessage.username = ''"
            ></v-text-field>
            <v-text-field
              v-model="password"
              :error-messages="errorMessage.password"
              label="密码"
              outlined
              class="mt-4"
              @input="errorMessage.password = ''"
            ></v-text-field>
          </v-form>
          <div class="d-flex justify-end">
            <v-btn class="mt-4" color="primary" @click="login">开始🎉</v-btn>
          </div>
<!--          <v-btn block variant="outlined" elevation="3" rounded="2" class="mt-4" color="primary"-->
<!--                 @click="register">-->
<!--            🔰 还没有创建账号? 点击我注册-->
<!--          </v-btn>-->
        </v-card>

      </v-col>
      <v-col cols="12" md="6" v-show="!isMobile">
        <v-img
          :src="imageSrc"
          aspect-ratio="1.7"
          class="rounded-xl"
        ></v-img>
      </v-col>
    </v-row>
  </v-container>
</template>

<route lang="yaml">
meta:
  layout: login
</route>

<style scoped>

</style>
