<template>
    <div id='viewer-container'></div>
</template>

<script type='module'>

export default {
    name: 'viewerContainer',
    props: ['controller'],
    data() {
        return {};
    },
    mounted() {
        this.$el.appendChild(this.controller.getViewerContainer());
    }
}
</script>

<style src='pannellum/build/pannellum.css'>
</style>

<style scoped>
    #viewer-container {
        width: 100%;
        height: 100%;
    }
</style>