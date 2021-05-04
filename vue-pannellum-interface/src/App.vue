<template>
  <v-app>
    <EditorApp>
    </EditorApp>
  </v-app>
</template>

<script>
import EditorApp from '@/components/EditorApp'

export default {
  name: 'App',
  components:{
    EditorApp
  }
};
</script>

<style scoped>
  #menu {
    width: 400px;
  }
</style>