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
            container: {}
        }
    },
    methods: {
        containerTouched() {
            this.menu.updateCurrentSpot();
        },
        changeViewerStrings() {
            let strings = i18nService.viewerConfigStrings;
            let newConfig = this.controller.viewer.getConfig()
            newConfig.strings = strings;
            this.controller = new Controller(newConfig);
            this.container.fillContainer();
        },
        addContainer(container) {
            this.container = container;
        }
    }
})