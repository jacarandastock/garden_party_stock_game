<script setup lang='ts'>
import {useI18n} from "vue-i18n";
import {useDisplay} from "vuetify";
import api from '@/utils/api';
import {saveToken} from '@/utils/auth';
import {useRouter} from "vue-router";

const router = useRouter();
const {t} = useI18n();

const imageSrc = ref('https://cdn.devdojo.com/images/november2020/hero-image.jpeg');
const username = ref('');
const errorMessage = ref('');

async function login() {
  try {
    const response = await api.post('/token', {"username": username.value});
    saveToken(response.data.access_token);
    await router.push(response.data.redirect);
  } catch (error) {
    console.log(error);
  }
}

</script>

<template>
  <v-container class="fill-height">
    <v-row class="h-100 d-flex align-center">
      <v-col cols="12" md="6">
        <v-card class="pa-6 bg-transparent" elevation="0">
          <div class="font-weight-bold text-h4 text-md-h2">
            蓝楹会<br/>
            Jacaranda Stock
          </div>
          <div class="text-h2 font-weight-bold text-primary">
            游园会
          </div>
          <div class="text-subtitle-1">
            合格投资者的摇篮
          </div>
          <v-text-field
              v-model="username"
              :error-messages="errorMessage"
              label="输入一个名字或昵称来开始"
              outlined
              class="mt-4"
              @input="errorMessage = ''"
          ></v-text-field>
          <div class="d-flex justify-end">
            <v-btn class="mt-4" color="primary" @click="login">开始🎉</v-btn>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-img
            :src="imageSrc"
            aspect-ratio="1.7"
            class="rounded-xl"
        ></v-img>
      </v-col>
    </v-row>
  </v-container>
</template>


<style scoped>

</style>
