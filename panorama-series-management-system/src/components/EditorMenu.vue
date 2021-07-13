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
          <v-container id='menu-btns'>
            <v-row justify="center" id='spot-selected-indicator'>
              <v-chip color='green' class='spot-selected' outlined > {{ getCurrentSpotText() }}</v-chip>
            </v-row>
            <v-row justify="space-around" class='mb-5'>
              <v-btn :disabled='isButtonDisabled' @click='addHotSpot' rounded>Добавить метку</v-btn>
              <v-btn :disabled='isSpotEditButtonDisabled' @click='deleteHotSpot' rounded>Удалить метку</v-btn>
              <v-btn :disabled='isSpotEditButtonDisabled' @click='moveHotSpot' rounded>Переместить метку</v-btn>
            </v-row>
            <v-row  justify='center' class="mb-5">
              <v-btn :disabled='true' id='save-btn' rounded>Сохранить данные</v-btn>
              <v-btn :disabled='true' id='load-btn' rounded>Загрузить данные</v-btn>
              </v-row>
            <v-row class='row-btns'>
              <UploadImages id='pano-load-btn' @change='handleImages' uploadMsg='Нажмите, чтобы загрузить или перетяните сюда панорамы.'/>
            </v-row>
          </v-container>
        </fieldset>
      </div>
</template>

<script>
import PanoramaSelector from '@/components/PanoramaSelector';
import UploadImages from "vue-upload-drop-images"
import ControllerService from './ControllerService';

export default {
  name: 'EditorMenu',
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
        controller: ControllerService.controller,
        currentSpot: ControllerService.controller.currentSpot
    }
  },
  created() {
    ControllerService.menu = this;
  },
  computed: {
    isInputDisabled() {
      return !this.panoramaIsEditing;
    },
    isButtonDisabled() {
      let isPitchAcceptable = true;
      let isYawAcceptable = true;
      let isDescriptionAcceptaple = this.controller.text != '';
      let isTransitionSceneChosen = this.spotType == 'scene' && this.transitionScene != undefined || this.spotType == 'info';
      return !(isPitchAcceptable && isYawAcceptable && isDescriptionAcceptaple && isTransitionSceneChosen && this.panoramaIsEditing);
    },
    isSpotEditButtonDisabled() {
      return !this.panoramaIsEditing || this.currentSpot == undefined;
    },
    currentSceneSelected() {
      return this.currentScene != undefined;
    },
    isTransitSceneDisabeled() {
      return !this.panoramaIsEditing || this.spotType != 'scene' || this.spotType == undefined; 
    }
  },
  
  methods: {
    updateCurrentSpot() {
      this.currentSpot = ControllerService.controller.currentSpot;
    },
    currentSceneChanged(scene) {
      this.currentScene = scene;
      this.controller.loadScene(this.currentScene);
      this.controller.setHomeScenePath(this.currentScene);
    },
    getCurrentSpotText() {
      return this.currentSpot ? 'Выбрана метка: ' + this.currentSpot.text : 'Метка не выбрана';
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
      this.updateCurrentSpot();
    },
    deleteHotSpot() {
      this.controller.removeHotSpot();
      this.updateCurrentSpot();
    },
    moveHotSpot() {
      this.controller.moveHotSpot();
      this.updateCurrentSpot();
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

#spot-selected-indicator {
  margin-bottom: 5px;
}

#menu-btns {
   margin-top: 10px;
   margin-bottom: 10px;
}
</style>