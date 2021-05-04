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
        <v-row>
            <v-col>
                <PhotoSphereViewer></PhotoSphereViewer>
            </v-col>
            <!-- <v-col>
                <EditorMenu
                :controller="viewerController"></EditorMenu>
            </v-col> -->
        </v-row>
    </v-container>
</template>

<script>
import EditorMenu from '@/components/EditorMenu';
import ViewerContainer from '@/components/ViewerContainer';
import PhotoSphereViewer from '@/components/PhotoSphereViewer';
import Header from '@/components/Header';
import Controller from '@/controller.js';

let controller = new Controller();
document.controller = controller;

export default {
  name: 'App',
  components:{
    EditorMenu,
    ViewerContainer,
    PhotoSphereViewer,
    Header
  },
  data() {
      return {
          viewerController: controller
      }
  }
};
</script>