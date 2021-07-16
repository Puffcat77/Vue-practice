import Controller from '@/controller.js';
import Vue from 'vue';
import i18nService from './InternalizationService';

var contr = new Controller();

export default new Vue({
    name: 'ControllerService',
    data() {
        return {
            controller: contr,
            menu: undefined,
        }
    },
    methods: {
        containerTouched() {
            this.menu.updateCurrentSpot();
        },
        changeViewerStrings() {
            let strings = i18nService.viewerConfigStrings;
            console.log(strings)
            console.log(this.controller.viewer.getConfig())
        }
    }
})