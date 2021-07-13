<template>
    <div class='viewer-container'></div>
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