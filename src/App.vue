<script setup lang="ts">

useHead({
    title: '蓝楹会',
    meta: [{ name: 'description', content: '蓝楹会' }],
})

onInitApp();
</script>

<template>
    <RouterView />
</template>

<style>


*::-webkit-scrollbar {
  background: transparent;
  width: 6px;
  height: 6px;
}

*::-webkit-scrollbar-thumb {
  border-radius: 4px;
  background: transparent;
}

*:hover::-webkit-scrollbar-thumb {
  background: hsla(0, 0%, 53%, 0.4);
}

*:hover::-webkit-scrollbar-track {
  background: hsla(0, 0%, 53%, 0.1);
}
</style>