<template>
    <div id='menu'>
        <fieldset>
          <legend>Current panorama</legend>
          <PanoramaSelector
          :scenes='scenes'
          :baseOptionText='"Choose current panorama"'
          @sceneChanged='currentSceneChanged'></PanoramaSelector>
        </fieldset>
        <fieldset>
          <legend>Panorama editor</legend>
            <v-checkbox v-model='panoramaIsEditing'
            label='Panorama is editing'
            :disabled='!currentSceneSelected'>
            </v-checkbox>
            <v-select v-model='spotType'
              :disabled='isInputDisabled'
              :items='spotTypes'
              item-text='text'
              item-value='value'
              label='Choose spot type'>
            </v-select>
            <PanoramaSelector  
              :disabilityCondition='isTransitSceneDisabeled'
              :scenes='scenes' 
              :baseOptionText='"Choose panorama for transition"'
              @sceneChanged='transitionSceneChanged'></PanoramaSelector>
          <v-text-field v-model='pitch' label='pitch' :disabled='isInputDisabled'></v-text-field>
          <v-text-field label='yaw' v-model='yaw' :disabled='isInputDisabled'></v-text-field>
          <v-text-field label='description' v-model='description' :disabled='isInputDisabled'></v-text-field>
          <v-btn-toggle id='buttons'>
            <v-btn :disabled='isButtonDisabled'>Add spot</v-btn>
            <v-btn :disabled='isButtonDisabled'>Delete spot</v-btn>
            <v-btn :disabled='isButtonDisabled'>Move spot</v-btn>
          </v-btn-toggle>
        </fieldset>
      </div>
</template>

<script>
import PanoramaSelector from '@/components/PanoramaSelector'

export default {
    name: 'EditorMenu',

    data() {
    return {
      scenes: [
        {
          id: 0,
          path: 'panoramas/1.jpg',
          title: 'Entry'
        },
        {
          id: 1,
          path: 'panoramas/2.jpg',
          title: 'Middle of the room'
        }
      ],
      currentScene: undefined,
      transitionScene: undefined,
      panoramaIsEditing: false,
      spotTypes: [
        {
          value: 'info',
          text: 'Info spot'
        },
        {
          value: 'scene',
          text: 'Transition spot'
        }
      ],
      spotType: 'info',
      pitch: '',
      yaw: '',
      description: ''
    }
  },
  computed: {
    isInputDisabled() {
      return !this.panoramaIsEditing;
    },
    isButtonDisabled() {
      let isPitchAcceptable = this.pitch != '' &&
         !isNaN(parseFloat(this.pitch)) &&
         parseFloat(this.pitch) <= 180 &&
         parseFloat(this.pitch) >= -180;
      let isYawAcceptable = this.yaw != '' &&
         !isNaN(parseFloat(this.yaw)) &&
         parseFloat(this.yaw) <= 90 &&
         parseFloat(this.yaw) >= -90;
      let isDescriptionAcceptaple = this.description != '';
      let isTransitionSceneChosen = this.spotType == 'scene' && this.transitionScene != undefined || this.spotType == 'info';
      return !isPitchAcceptable || !isYawAcceptable || !isDescriptionAcceptaple || !isTransitionSceneChosen || !this.panoramaIsEditing;
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
    },
    transitionSceneChanged(scene) {
      this.transitionScene = scene;
    },
  },
  components: {
    PanoramaSelector
  }
}
</script>