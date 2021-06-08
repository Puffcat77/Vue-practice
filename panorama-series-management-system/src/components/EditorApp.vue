<template>
    <v-container>
        <Header></Header>
        <v-row>
            <v-col>
                <ViewerContainer 
                    :controller="viewerController"
                    ></ViewerContainer>
            </v-col>
            <v-col>
                <EditorMenu
                :controller="viewerController"></EditorMenu>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import EditorMenu from '@/components/EditorMenu';
import ViewerContainer from '@/components/ViewerContainer';
import Header from '@/components/Header';
import Controller from '@/controller.js';

let controller = new Controller();
document.controller = controller;

export default {
  name: 'App',
  components:{
    EditorMenu,
    ViewerContainer,
    Header
  },
  data() {
      return {
          viewerController: controller
      }
  }
};
</script>