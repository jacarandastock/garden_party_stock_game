<script setup lang="ts">
import api from '@/utils/api';


const rankListDialog = ref(false)
const rankList = ref([])
const currentUsername = ref('')

function getRankListDialog() {
  rankListDialog.value = true
  api.post('/rank').then((response) => {
    console.log(response)
    rankList.value = response.data.data
    currentUsername.value = response.data.current_user
  })
}

</script>
<template>
  <v-dialog max-width="500" v-model="rankListDialog">
    <template v-slot:activator="{ props: activatorProps }">
      <v-btn icon @click="getRankListDialog" variant="elevated"  class="d-block text-center mx-auto">
        <v-icon>mdi-trophy</v-icon>
      </v-btn>
    </template>

    <template v-slot:default="{ isActive }">
      <v-card>
        <v-card-title>
          得分排名
        </v-card-title>
        <v-divider></v-divider>
        <v-table fixed-header height="300px" density="compact" v-if="rankList.length > 0">
          <thead>
          <tr>
            <th class="text-center">排名</th>
            <th class="text-center">用户名</th>
            <th class="text-center">总得分</th>
          </tr>
          </thead>
          <tbody >
          <tr v-for="(item, id) in rankList" :key="id">
            <td class="text-center">{{ id + 1 }}</td>
            <td class="text-center" v-if="currentUsername == item[0]">
              <v-chip color="primary" label outlined>{{ item[0] }}</v-chip>
            </td>
            <td class="text-center" v-else>{{ item[0] }}</td>
            <td class="text-center">{{ item[1] }}</td>
          </tr>
          </tbody>
        </v-table>
        <v-card-text v-else>
          <v-col class="text-center">暂无数据</v-col>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <div class="text-caption">*不包含正进行的问题</div>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text="关闭"
            @click="isActive.value = false"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<style scoped></style>
