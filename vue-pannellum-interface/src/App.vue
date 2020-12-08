<template>
  <div id='app'>
      <h1>Pannellum interface</h1>
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
          <p>
            <input type='checkbox' v-model='panoramaIsEditing'>
            <label>Panorama is editing</label>
          </p>
          <p>
            <select v-model='spotType' :disabled='isInputDisabled'>
              <option v-for='type in spotTypes'
                :key='type.value'
                :value='type.value'>{{type.text}}</option>
            </select>
          </p>
          <p>
            <PanoramaSelector  
              :disabled='isInputDisabled'
              :scenes='scenes' 
              :baseOptionText='"Choose panorama for transition"'
              @sceneChanged='transitionSceneChanged'></PanoramaSelector>
          </p>
          <p>pitch <input type="text" v-model='pitch' :disabled='isInputDisabled'></p>
          <p> {{ pitch }} </p>
          <p>yaw <input type="text" v-model='yaw' :disabled='isInputDisabled'></p>
          <p> {{ yaw }} </p>
          <p>description <input type="text" v-model='description' :disabled='isInputDisabled'></p>
          <p> {{ description }} </p>
          <div id='buttons'>
            <button :disabled='isButtonDisabled'>Add spot</button>
            <button :disabled='isButtonDisabled'>Delete spot</button>
            <button :disabled='isButtonDisabled'>Move spot</button>
          </div>
        </fieldset>
      </div>
  </div>
</template>

<script>
import PanoramaSelector from '@/components/PanoramaSelector'

export default {
  name: 'App',
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

<style>
#menu{
  width: 400px;
}
</style>
