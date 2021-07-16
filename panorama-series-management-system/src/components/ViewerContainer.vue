<template>
    <div class='viewer-container'>
        <v-btn fab small id="homeBtn" fixed ><v-icon>mdi-home</v-icon></v-btn>
    </div>
</template>

<script type='module'>
import ControllerService from './ControllerService';

export default {
    name: 'viewerContainer',
    data() {
        return {};
    },
    mounted() {
        this.$el.appendChild(ControllerService.controller.getViewerContainer());
        this.$el.onclick = () => { ControllerService.containerTouched()};
        let homeBtn = this.$el.children[0];
        this.$el.removeChild(homeBtn);
        ControllerService.controller.addHomeButton(homeBtn);
    }
}
</script>

<style src='pannellum/build/pannellum.css'>
</style>

<style scoped>
    .viewer-container {
        width: 100%;
        height: 100%;
        margin-top: 10px;
    }
</style>