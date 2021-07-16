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
        return {
            homeBtn: {}
        };
    },
    mounted() {
        this.$el.appendChild(ControllerService.controller.getViewerContainer());
        this.$el.onclick = () => { ControllerService.containerTouched()};
        this.homeBtn = this.$el.children[0];
        this.$el.removeChild(this.homeBtn);
        ControllerService.controller.addHomeButton(this.homeBtn);
        ControllerService.container = this;
    },
    methods: {
        fillContainer() {
            ControllerService.controller.addHomeButton(this.homeBtn);
            this.$el.removeChild(this.$el.children[0]);
            this.$el.appendChild(ControllerService.controller.getViewerContainer());
            this.$el.onclick = () => { ControllerService.containerTouched()};
        }
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