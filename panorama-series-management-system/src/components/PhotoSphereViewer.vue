<template>
    <div id='photo-sphere-viewer-container'></div>
</template>

<script>
import { Viewer } from 'photo-sphere-viewer';

export default {
    name: 'PhotoSphereViewer',
    data() {
        return {
            viewer: {}
        }
    },
    mounted() {
        var container = this.$el;
        this.viewer = new Viewer({
            container: container,
            panorama: 'panoramas/2.jpg'
        }); 
    }
}
</script>

<style src='photo-sphere-viewer/dist/photo-sphere-viewer.css'>
</style>

<style scoped>
    #photo-sphere-viewer-container {
        width: 100%;
        height: 100%;
    }
</style>