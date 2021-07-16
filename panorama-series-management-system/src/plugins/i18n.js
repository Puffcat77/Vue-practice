import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

const messages = {
    en: {
        programTitle: 'Panorama series management system',
        curPanoSelectorLegend: 'Current panorama',
        curPanoSelectorBaseOption: 'Choose current panorama',
        editMenuLegend: 'Panorama editor',
        panoEditingSwitch: 'Panorama is editing',
        centerCoordinatesBtn: 'Cross coordinates',
        spotTypeSelectorBaseOption: 'Choose spot type',
        horizontalCoord: 'Pitch',
        verticalCoord: 'Yaw',
        spotDescription: 'Description',
        spotNotSelected: 'Spot isn\'t selected',
        spotSelected: 'Selected spot: ',
        infoSpotType: 'Info',
        transitSpotType: 'Transit',
        spotFileLabel: 'Config file with spots',
        panoLoadLabel: 'Panoramas',
    },
    ru: {
        programTitle: 'Система управления серией панорам',
        curPanoSelectorLegend: 'Текущая панорама',
        curPanoSelectorBaseOption: 'Выберите текущую панораму',
        editMenuLegend: 'Редактор панорамы',
        panoEditingSwitch: 'Панорама редактируется',
        centerCoordinatesBtn: 'Координаты креста',
        spotTypeSelectorBaseOption: 'Выберите тип метки',
        horizontalCoord: 'Горизонталь',
        verticalCoord: 'Вертикаль',
        spotDescription: 'Описание',
        spotNotSelected: 'Метка не выбрана',
        spotSelected: 'Выбрана метка: ',
        infoSpotType: 'Информационная',
        transitSpotType: 'Переход',
        spotFileLabel: 'Файл с метками панорам',
        panoLoadLabel: 'Панорамы',
        viewerConfigStrings: {
            "loadButtonLabel": "Нажмите, чтобы<br>Загрузить<br>Панораму",
            "loadingLabel": "Загрузка...",
            "bylineLabel": "by %s",
            "noPanoramaError": "Панорама не указана.",
            "fileAccessError": "Файл %s не удается получить.",
            "malformedURLError": "Что-то не так с URL панорамы.",
            "iOS8WebGLError": "Из-за сломанной реализации WebGL в iOS 8 для вашего устройства работают только JPEG с прогрессивной кодировкой (эта панорама использует стандартную кодировку).",
            "genericWebGLError": "Ваш браузер не имеет необходимой поддержки WebGL для отображения этой панорамы.",
            "textureSizeError": "Это панорама слишком большая для вашего устройства! Её ширина %spx, но ваше устройство поддерживает только %spx в ширину. Попробуйте другое устройство. (Если вы автор, попробуйте уменьшить изображение.)",
            "unknownError": "Неизвестная ошибка, проверьте консоль разработчика."
        }
    }
}


export const i18n = new VueI18n({
    locale: 'en',
    fallbackLocale: 'en',
    messages
})