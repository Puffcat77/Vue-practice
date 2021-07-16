import Vue from 'vue';
import * as ru from '../locales/ru.json';
import * as en from '../locales/en.json'

export default new Vue({
    name: 'i18nService',
    data() {
        return {
            'en': {},
            'ru': {},
            lang: {}
        }
    },
    created() {
        this['en'] = en;
        this['ru'] = ru;
        this.lang = this['en'].default.messages;
    },
    methods: {
        changeLang(language) {
            this.lang = this[language].default.messages;
            this.$emit('langChanged')
        }
    },
    computed: {
        programTitle() { return this.lang.programTitle },
        curPanoSelectorLegend() { return this.lang.curPanoSelectorLegend },
        curPanoSelectorBaseOption() { return this.lang.curPanoSelectorBaseOption },
        editMenuLegend() { return this.lang.editMenuLegend },
        panoEditingSwitch() { return this.lang.centerCoordinatesBtn },
        centerCoordinatesBtn() {return this.lang.centerCoordinatesBtn },
        spotTypeSelectorLabel() { return this.lang.spotTypeSelectorLabel },
        panoTransitionSelector() { return this.lang.panoTransitionSelector },
        horizontalCoord() { return this.lang.horizontalCoord },
        verticalCoord() { return this.lang.verticalCoord },
        spotDescription() { return this.lang.spotDescription },
        spotNotSelected() { return this.lang.spotNotSelected },
        spotSelected() { return this.lang.spotSelected },
        infoSpotType() { return this.lang.infoSpotType },
        transitSpotType() { return this.lang.transitSpotType},
        spotFileLabel() { return this.lang.spotFileLabel },
        panoLoadLabel() { return this.lang.panoLoadLabel },
        viewerConfigStrings() { return this.lang.viewerConfigStrings }
    }
})