<template>
    <v-select
        @change='sceneChanged()'
        v-model='selected'
        :disabled='disabilityCondition'
        :label='baseOptionText'
        :items='scenes'
        item-text='title'
        item-value='path'>
    </v-select>
</template>

<script>
export default {
    props: [
        'scenes',
        'baseOptionText',
        'disabilityCondition'
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