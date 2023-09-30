<script setup lang="ts">
import {useDataStore} from "@/stores/data";
import {useRouter} from "vue-router";
import { useDisplay } from 'vuetify';
import api from "@/utils/api";
const router = useRouter();
const {t, locale} = useI18n();
const dataStore = useDataStore();
const nextYearDialog = ref(false)
const disabled = ref(false)
const resetDialog = ref(false)
function nextYear() {
  api.post('/api/stock/year/update').then((data) => {
    if (data.data.success) {
      dataStore.currentYear = data.data.year
    } else {
      if (data.data.status == 'finish') {
        disabled.value = true
      }
    }
  })
}

function reset() {
  api.post('/api/reset').then((data) => {

  })
}
const drawer = ref(false)
const { name } = useDisplay();
const isMobile = computed(() => name.value === 'xs');
</script>
<template>
  <v-app>
    <v-app-bar app>
      <div class="px-2 flex items-center">
        <!--     移动端的时候只显示小logo Icon     -->
        <LogoIcon v-if="isMobile" :width="60" :height="60"/>
        <!--     非移动端显示大图标     -->
        <Logo v-else :width="200" :height="40"/>
      </div>
      <v-spacer></v-spacer>
      <h1>{{dataStore.currentYear}}</h1>
      <v-dialog
          v-model="nextYearDialog"
          width="auto"
      >
        <template v-slot:activator="{ props }">
          <v-btn v-show="$route.meta.isAdmin" v-bind="props" variant="elevated" class="ml-5" color="error" :disabled="disabled">
            下一年
          </v-btn>
        </template>
        <v-card>
          <v-card-title>
            您确定要进入下一年吗？
          </v-card-title>
          <v-card-text>这个操作无法撤销 <br>您当前在 <span class="font-weight-bold">{{dataStore.currentYear}}年</span> </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                color="primary"
                variant="elevated"
                @click="nextYearDialog = false"
            >
              放弃
            </v-btn>
            <v-btn
                color="error"
                variant="text"
                @click="nextYear(); nextYearDialog = false"
            >
              确定
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-spacer></v-spacer>
      <v-btn icon variant="text" @click="drawer=!drawer">
        <span class="i-iconoir-bell text-2xl"></span>
      </v-btn>
      <LocaleToggler/>
      <ThemeToggler/>
    </v-app-bar>

    <v-main class="text-slate-700 dark:text-slate-300">
      <RouterView/>
      <v-navigation-drawer
          v-model="drawer"
          location="bottom"
          temporary
      >
        <v-list>
          <v-list-item>
            <v-dialog
                v-model="resetDialog"
                width="auto"
            >
              <template v-slot:activator="{ props }">
                <v-btn v-show="$route.meta.isAdmin" v-bind="props" variant="elevated" class="ml-5" color="black" :disabled="disabled">
                  重置数据
                </v-btn>
              </template>
              <v-card>
                <v-card-title>
                  您确定要重置所有数据吗
                </v-card-title>
                <v-card-text>这个操作无法撤销, 会清除所有用户并将游戏重置为初始状态 </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                      color="primary"
                      variant="elevated"
                      @click="resetDialog = false"
                  >
                    放弃
                  </v-btn>
                  <v-btn
                      color="error"
                      variant="text"
                      @click="reset(); resetDialog = false"
                  >
                    确定
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
    </v-main>
  </v-app>
</template>

<style scoped></style>
