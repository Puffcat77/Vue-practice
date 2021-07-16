<template>
    <v-toolbar id = 'header'>
        <v-container>
            <v-layout row>
                <v-flex xs10 s10 md10 id='title'>{{ title }}</v-flex>
                <v-flex xs2 s2 md2 id='flags'>
                    <v-select id='loc-selector' 
                        v-model='lang' 
                        @change='languageChanged'
                        :items='langs'
                        item-text='lang'
                        item-value='value'>   
                    </v-select>
                </v-flex>
            </v-layout>
        </v-container>
    </v-toolbar>
</template>

<script>
import i18nService from './InternalizationService'
import ControllerService from './ControllerService'


export default {
    data() {
        return {
            langs: [
                {
                    lang: 'English',
                    value: 'en'
                },
                {
                    lang: 'Русский',
                    value: 'ru'
                }
            ],
            lang: 'en',
        }
    },
    methods: {
        languageChanged() {
            i18nService.changeLang(this.lang);
            ControllerService.changeViewerStrings()
        }
    },
    computed: {
        title() {
            return i18nService.programTitle;
        }
    }
}
</script>

<style scoped>
#header {
    background-color: aquamarine;
    font-weight: bold;
    color: black;
    padding-top: 8px;
}

#title {
    align-items: center;
    font-size: 24px;
}

</style>