import Controller from '@/controller.js';
import Vue from 'vue';

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
        }
    }
})