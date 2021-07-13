<template>
    <v-container>
        <Header></Header>
        <v-row>
            <v-col>
                <ViewerContainer></ViewerContainer>
            </v-col>
            <v-col>
                <EditorMenu></EditorMenu>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import EditorMenu from '@/components/EditorMenu';
import ViewerContainer from '@/components/ViewerContainer';
import Header from '@/components/Header';

export default {
  name: 'EditorApp',
  components:{
    EditorMenu,
    ViewerContainer,
    Header,
  },
  data() { 
      return {}
  }
};
</script>