<template>
  <v-app>
    <EditorMenu></EditorMenu>
  </v-app>
</template>

<script>
import EditorMenu from '@/components/EditorMenu'

export default {
  name: 'App',
  components:{
    EditorMenu
  }
};
</script>

<style scoped>
  #menu {
    width: 400px;
  }
</style>