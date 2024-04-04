<script setup lang="ts">
import { useAppTheme } from '@/composables/useAppTheme'

const { isDark, onToggleTheme } = useAppTheme()

defineProps({
    color: {
        type: String,
        default: 'inherit',
    },
})
</script>
<template>
    <div class="theme-toggler">
      <!-- Add Data Attribute for testing -->
      <v-btn variant="plain" icon :color="color" @click="onToggleTheme" class="d-block text-center mx-auto">
            <span :class="isDark ? 'i-iconoir-sun-light' : 'i-iconoir-half-moon'" class="text-2xl"></span>
        </v-btn>
    </div>
</template>

<style scoped></style>
