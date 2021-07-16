<template>
    <div id='menu'>
        <fieldset>
          <legend>{{ curPanoSelectorLegend }}</legend>
          <PanoramaSelector
          :scenes='scenes'
          :baseOptionText='curPanoSelectorBaseOption'
          @sceneChanged='currentSceneChanged'></PanoramaSelector>
        </fieldset>
        <fieldset>
          <legend>{{ editMenuLegend }}</legend>
          <v-switch v-model='panoramaIsEditing'
          :label='panoEditingSwitch'
          :disabled='!currentSceneSelected'
          @change='editingModeChanged()'>
          </v-switch>
          <v-btn 
          :disabled='!panoramaIsEditing'
          rounded
          @click='getCenterClicked()'>{{ centerCoordinatesBtn }}</v-btn>
          <v-select v-model='spotType'
            :disabled='isInputDisabled'
            :items='spotTypes'
            item-text='text'
            item-value='value'
            :label='spotTypeSelectorLabel'>
          </v-select>
          <PanoramaSelector  
            :disabilityCondition='isTransitSceneDisabeled'
            :scenes='scenes' 
            :baseOptionText='panoTransitionSelector'
            @sceneChanged='transitionSceneChanged'></PanoramaSelector>
          <v-text-field :label='verticalCoord' v-model='controller.pitch' :disabled='isInputDisabled'></v-text-field>
          <v-text-field :label='horizontalCoord' v-model='controller.yaw' :disabled='isInputDisabled'></v-text-field>
          <v-text-field :label='spotDescription' v-model='controller.text' :disabled='isInputDisabled'></v-text-field>
          <v-container id='menu-btns'>
            <v-row justify="center" id='spot-selected-indicator'>
              <v-chip color='green' class='spot-selected' outlined > {{ currentSpotText }}</v-chip>
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
                :label='spotFileLabel'></v-file-input>
            </v-row>
            <v-row justify='center' class="mb-5">
              <v-file-input 
                @change="handleImages" 
                accept="image/png, image/jpeg, image/bmp" 
                :label='panoLoadLabel' 
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
import i18nService from './InternalizationService';

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
    spotTypes() { return [
      {
        value: 'info',
        text: this.infoSpotType
      },
      {
        value: 'scene',
        text: this.transitSpotType
      }
    ]},
    isSpotEditButtonDisabled() { return !this.panoramaIsEditing || this.currentSpot == undefined; },
    currentSceneSelected() { return this.currentScene != undefined; },
    currentSpotText() { return this.currentSpot ? this.spotSelected + this.currentSpot.text : this.spotNotSelected; },
    isTransitSceneDisabeled() { return !this.panoramaIsEditing || this.spotType != 'scene' || this.spotType == undefined; },
    isDataBtnDisabled() { return this.scenes.length == 0; },
    curPanoSelectorLegend() { return i18nService.curPanoSelectorLegend },
    curPanoSelectorBaseOption() { return i18nService.curPanoSelectorBaseOption },
    editMenuLegend() { return i18nService.editMenuLegend },
    panoEditingSwitch() { return i18nService.centerCoordinatesBtn},
    centerCoordinatesBtn() {return i18nService.centerCoordinatesBtn },
    spotTypeSelectorLabel() { return i18nService.spotTypeSelectorLabel},
    panoTransitionSelector() { return i18nService.panoTransitionSelector },
    horizontalCoord() { return i18nService.horizontalCoord},
    verticalCoord() { return i18nService.verticalCoord },
    spotDescription() { return i18nService.spotDescription },
    spotNotSelected() { return i18nService.spotNotSelected },
    spotSelected() { return i18nService.spotSelected },
    infoSpotType() { return i18nService.infoSpotType },
    transitSpotType() { return i18nService.transitSpotType},
    spotFileLabel() { return i18nService.spotFileLabel },
    panoLoadLabel() { return i18nService.panoLoadLabel },
        
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
        let url = URL.createObjectURL(file);

        this.scenes.push({
          path: url,
          title: name
        });

        ControllerService.controller.addScene(url);
      });
    },
    saveData() {
      let scenesData = {};
      for(let i = 0; i < this.scenes.length; i++) {
        let scene = this.scenes[i]
        scenesData[scene.title] = ControllerService.controller.getSpotsFromScene(scene.path)
      }
      // let data = JSON.stringify(scenesData);

      // TODO: send data to server
    },
    loadData(file) {
      let reader = new FileReader();
      reader.readAsText(file);

      reader.onload = () => {
        let data = JSON.parse(reader.result);

        for(let d in data) {
          if (this.scenes.length > 0) {
            let i = this.scenes.map((scene) => { return scene.title }).indexOf(d);
            let scene = this.scenes[i];
            let spots = data[d];
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