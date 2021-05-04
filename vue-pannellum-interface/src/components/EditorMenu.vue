<template>
    <div id='menu'>
        <fieldset>
          <legend>Текущая панорама</legend>
          <PanoramaSelector
          :scenes='scenes'
          :baseOptionText='"Выберите текущую панораму"'
          @sceneChanged='currentSceneChanged'></PanoramaSelector>
        </fieldset>
        <fieldset>
          <legend>Редактор панорамы</legend>
            <v-checkbox v-model='panoramaIsEditing'
            label='Панорама редактируется'
            :disabled='!currentSceneSelected'
            @change='editingModeChanged()'>
            </v-checkbox>
            <v-btn 
            :disabled='!panoramaIsEditing'
            rounded
            @click='getCenterClicked()'>Координаты центра</v-btn>
            <v-select v-model='spotType'
              :disabled='isInputDisabled'
              :items='spotTypes'
              item-text='text'
              item-value='value'
              label='Выберите тип метки'>
            </v-select>
            <PanoramaSelector  
              :disabilityCondition='isTransitSceneDisabeled'
              :scenes='scenes' 
              :baseOptionText='"Выберите панораму для перехода"'
              @sceneChanged='transitionSceneChanged'></PanoramaSelector>
          <v-text-field label='Вертикаль' v-model='controller.pitch' :disabled='isInputDisabled'></v-text-field>
          <v-text-field label='Горизонталь' v-model='controller.yaw' :disabled='isInputDisabled'></v-text-field>
          <v-text-field label='Описание' v-model='controller.text' :disabled='isInputDisabled'></v-text-field>
          <v-row justify="center">
            <v-chip color='green' class='spot-selected' outlined v-show='controller.currentSpot != undefined'> {{ getCurrentSpotText() }}</v-chip>
          </v-row>
          <v-container>
            <v-row justify="space-around">
              <v-btn :disabled='isButtonDisabled' @click='addHotSpot' rounded>Добавить метку</v-btn>
              <v-btn :disabled='isSpotEditButtonDisabled' @click='deleteHotSpot' rounded>Удалить метку</v-btn>
              <v-btn :disabled='isSpotEditButtonDisabled' @click='moveHotSpot' rounded>Переместить метку</v-btn>
            </v-row>
            <v-row  justify='center'>
              <v-btn :disabled='true' id='syncronise-btn' rounded>Синхронизировать</v-btn>
              <UploadImages id='pano-load-btn' @change='handleImages' uploadMsg='Нажмите, чтобы загрузить или перетяните сюда панорамы.'/>
            </v-row>
          </v-container>
        </fieldset>
      </div>
</template>

<script>
import PanoramaSelector from '@/components/PanoramaSelector';
import UploadImages from "vue-upload-drop-images"

let panoramas = [
  {
    path: 'panoramas/2.jpg',
    title: 'Доска'
  },
  {
    path: 'panoramas/1.jpg',
    title: 'Середина комнаты'
  } 
]

export default {
    name: 'EditorMenu',
    props: ['controller'],
    components: {
      PanoramaSelector,
      UploadImages
    },
    data() {
      return {
        scenes: [],
        currentScene: undefined,
        transitionScene: undefined,
        panoramaIsEditing: false,
        spotTypes: [
          {
            value: 'info',
            text: 'Информационная'
          },
          {
            value: 'scene',
            text: 'Переход'
          }
        ],
        spotType: 'info',
    }
  },
  created() {
    for (let i = 0; i < panoramas.length; i++) {
      this.scenes.push({
        id: i,
        path: panoramas[i].path,
        title: panoramas[i].title
      })
    }
  },
  computed: {
    isInputDisabled() {
      return !this.panoramaIsEditing;
    },
    isButtonDisabled() {
      let isPitchAcceptable = 
         parseFloat(this.controller.pitch) <= 180 &&
         parseFloat(this.controller.pitch) >= -180;
      let isYawAcceptable = 
         parseFloat(this.controller.yaw) <= 90 &&
         parseFloat(this.controller.yaw) >= -90;
      let isDescriptionAcceptaple = this.controller.text != '';
      let isTransitionSceneChosen = this.spotType == 'scene' && this.transitionScene != undefined || this.spotType == 'info';
      return !(isPitchAcceptable && isYawAcceptable && isDescriptionAcceptaple && isTransitionSceneChosen && this.panoramaIsEditing);
    },
    isSpotEditButtonDisabled() {
      return !(!this.isButtonDisabled && (this.controller.currentSpot != undefined));
    },
    currentSceneSelected() {
      return this.currentScene != undefined;
    },
    isTransitSceneDisabeled() {
      return !this.panoramaIsEditing || this.spotType != 'scene' || this.spotType == undefined; 
    }
  },
  
  methods: {
    currentSceneChanged(scene) {
      this.currentScene = scene;
      this.controller.loadScene(this.currentScene);
      this.controller.setHomeScenePath(this.currentScene);
    },
    getCurrentSpotText() {
      return this.controller.currentSpot ? 'Выбрана точка:' + this.controller.currentSpot.text : undefined;
    },
    transitionSceneChanged(scene) {
      this.transitionScene = scene;
    },
    editingModeChanged() {
      this.controller.setEditingMode(this.panoramaIsEditing);
      this.controller.displayCross();
    },
    getCenterClicked() {
      this.controller.setCenterPosition();
    },
    addHotSpot() {
      this.controller.addHotSpot(
        this.spotType, undefined, this.transitionScene);
    },
    deleteHotSpot() {
      this.controller.removeHotSpot();
    },
    moveHotSpot() {
      this.controller.moveHotSpot();
    },
    handleImages(files) {
      files.forEach(file => {
        if (file.type === 'text/html' ||
            file.type === 'text/css' ||
            file.type === 'text/javascript')
        return;

        let name = file.name.split('.')[0];
        let url = URL.createObjectURL(file)

        this.scenes.push({
          path: url,
          title: name
        })
      });
    }
  }
}
</script>

<style>
fieldset {
  padding: 5px;
}


.spot-selected {
  border-radius: 20%;
  align-self: center;
  justify-self: center;
}



#syncronise-btn,  #load-pano-btn {
   width: 50%;
   margin-top: 10px;
   margin-bottom: 10px;
}
</style>