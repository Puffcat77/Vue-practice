const vm = new Vue({
    el: '#app',
    data: {
        scenes: [
            { 
                path: '1.jpg',
                title: 'Entrance'
            },
            { 
                path: '2.jpg',
                title: 'Middle of the room'
            }
        ],
        currentScene: '1.jpg',
        editLabel: {
            text: 'Panorama is not editing',
            isEditing: false,
            style: {
                color: 'red'
            },
            base() {
                this.text = 'Panorama is not editing';
                this.style.color = 'red';
                this.isEditing = false;
            },
            altered() {
                this.text = 'Panorama is editing';
                this.style.color = 'green';
                this.isEditing = true;
            }
        },
        spotTypes: [
            {
                type: 'info',
                text: 'Info spot'
            },
            {
                type: 'scene',
                text: 'Transition spot'
            }
        ],
        selectedSpotType: 'info',
        selectedTransitionScene: '1.jpg',
        pitch: '',
        yaw: '',
        description: '',
    },
    computed: {
        isHomeSceneChosen() {
            return this.currentScene != '';
        },
        isButtonDisabled() {
            let isPitchAcceptable = this.pitch != '' &&
                !isNaN(parseFloat(this.pitch)) &&
                parseFloat(this.pitch) >= -180 &&
                parseFloat(this.pitch) <= 180;
            let isYawAcceptable = this.yaw != '' &&
                !isNaN(parseFloat(this.yaw)) &&
                parseFloat(this.yaw) >= -90 && 
                parseFloat(this.yaw) <= 90;
            let isTextAcceptable = this.description != '';
            let isTransitSceneChosen = true;
            return !this.editLabel.isEditing || 
                !isPitchAcceptable || 
                !isYawAcceptable || 
                !isTextAcceptable || 
                !isTransitSceneChosen;
        }
    },
    methods: {
        sceneSelected(index) {
            console.log(index);
            this.currentScenePath = this.scenes[index].path
        },
        changeEditingState() {
            this.editLabel.isEditing? 
                this.editLabel.base():
                this.editLabel.altered();
        },
        sceneChanged() {
            this.editLabel.base();
        }
    }
});