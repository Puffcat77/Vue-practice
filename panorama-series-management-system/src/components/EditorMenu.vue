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
          <v-switch v-model='panoramaIsEditing'
          label='Панорама редактируется'
          :disabled='!currentSceneSelected'
          @change='editingModeChanged()'>
          </v-switch>
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
              <v-btn :disabled='isButtonDisabled' @click='addHotSpot' fab><v-icon>mdi-plus</v-icon></v-btn>
              <v-btn :disabled='isSpotEditButtonDisabled' @click='deleteHotSpot' fab><v-icon>mdi-minus</v-icon></v-btn>
              <v-btn :disabled='isSpotEditButtonDisabled' @click='moveHotSpot' fab><v-icon>mdi-circle-edit-outline</v-icon></v-btn>
              <v-btn :disabled='isDataBtnDisabled' @click='saveData' fab><v-icon>mdi-content-save-outline</v-icon></v-btn>
            </v-row>
            <v-row  justify='center' class="mb-5">
              <v-file-input 
                @change="loadData" 
                :disabled='isDataBtnDisabled' 
                accept="application/json" 
                label='Файл с метками'></v-file-input>
            </v-row>
            <v-row justify='center' class="mb-5">
              <v-file-input 
                @change="handleImages" 
                accept="image/png, image/jpeg, image/bmp" 
                label='Панорамы' 
                prepend-icon="mdi-image"
                multiple></v-file-input>
            </v-row>
            <v-row class='row-btns'>
              
            </v-row>
          </v-container>
        </fieldset>
      </div>
</template>

<script>
import PanoramaSelector from '@/components/PanoramaSelector';
import ControllerService from './ControllerService';

export default {
  name: 'EditorMenu',
  components: {
    PanoramaSelector
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
    },
    isDataBtnDisabled() {
      return this.scenes.length == 0;
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
        this.currentScene, this.spotType, undefined, this.transitionScene);
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

        let name = file.name.split('.')[0];
        let url = URL.createObjectURL(file)

        this.scenes.push({
          path: url,
          title: name
        })
      });
    },
    saveData() {
      let scenesData = {};
      for(let i = 0; i < this.scenes.length; i++) {
        let scene = this.scenes[i]
        scenesData[scene.title] = ControllerService.controller.getSpotsFromScene(scene.path)
      }
      let data = JSON.stringify(scenesData);

      console.log(data);

      // TODO: send data to server
    },
    loadData(file) {
      let reader = new FileReader();
      reader.readAsText(file);

      reader.onload = () => {
        let data = JSON.parse(reader.result);

        for(let d in data) {
          if (this.scenes.length > 0) {
            alert(d)
            let i = this.scenes.map((scene) => { return scene.title }).indexOf(d);
            let scene = this.scenes[i];
            let spots = data[d];
            console.log(spots)
            if (scene != undefined && spots != undefined)
              ControllerService.controller.loadSpotsToScene(scene.path, spots);
          }
        }
      };
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