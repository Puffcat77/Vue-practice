<template>
  <v-app>
    <editor-app></editor-app>
  </v-app>
</template>

<script>
import EditorApp from './components/EditorApp.vue';

export default {
  name: 'App',

  components: {
    EditorApp
  },

  data: () => ({}),
};
</script>
