<template>
    <select
        @change='sceneChanged()'
        v-model='selected'>
        <option disabled value=''>{{baseOptionText}}</option>
        <option v-for='scene in scenes'
            :key='scene.id'
            :value='scene'>{{ scene.title }}</option>
    </select>
</template>

<script>
export default {
    props: [
        'scenes',
        'baseOptionText'
    ],
    data() {
        return {
            selected: ''
        }
    },
    methods:{
        sceneChanged() {
            this.$emit('sceneChanged', this.selected)
        }
    }
}
</script>