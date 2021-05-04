<script>
import 'pannellum';
import 'pannellum/build/pannellum.css';

let viewerConfig = {
    'default': {
        'type': 'equirectangular',
        'hotSpots': []
    },
    'scenes': []
};

let panoViewerContainer = document.createElement('div');
panoViewerContainer.id = 'viewer';
let panoViewer = window.pannellum.viewer(panoViewerContainer, viewerConfig);

export default {
    data() {
        return {
            viewer: {},
            viewerContainer: {},
            homeScene: ''
        }
    },
    created() {
        this.viewer = panoViewer;
        this.viewerContainer = panoViewerContainer;
    },
    computed: {
        scenes() {
            return this.viewer.getConfig().scenes;
        },
        hotSpots() {
            return this.viewer.getConfig().hotSpots;
        }
    },
    methods: {
        getData() {
        },
        onLoadEvent() {
            this.loadSpotsToScene();
            this.applyTransitionClicks();
        },
        createHomeButtton() {
            let button = document.createElement('input');
            button.type='button';
            button.id='homeButton'
            button.value = 'Home';
            button.style.display = 'none';
            button.onclick = () => {
                this.viewer.loadScene(this.homeScene);
                button.style.display = 'none';
            }
            button.style.position = 'absolute';
            button.style.top = '4px';
            button.style.right = '4px';
            document.getElementsByClassName('pnlm-ui')[0].appendChild(button);
        },    
        getCenterPosition() {
            return {
                pitch: this.viewer.getPitch(),
                yaw: this.viewer.getPitch()
            }
        },
        addScene(panoramaPath) {
            let scene = {
                'panorama': panoramaPath
            }
            this.viewer.addScene(panoramaPath, scene);
        },
        loadScene(panoramaPath) {
            if (!(panoramaPath in (this.viewer.getConfig().scenes)))
                this.addScene(panoramaPath);
            this.viewer.loadScene(panoramaPath);
            this.currentScenePath = panoramaPath;
        },
        getHotSpotInfo(index) {
            let hotSpots = this.hotSpots;
            this.currentSpot = hotSpots[index];
            return this.currentSpot;
        },
        displayCross(isEditing) {
            let hotSpotDebugIcon = document.getElementsByClassName('pnlm-sprite pnlm-hot-spot-debug-indicator')[0];
            hotSpotDebugIcon.style.display = isEditing? 'block': 'none'
        },
        addHotSpot(spotType, pitch, yaw, text, spotId = -1, transitionScene) {
            let id = spotId != -1? spotId: this.hotSpots.length;

            spotType == 'info' ? 
                this.addInfoSpot(pitch, yaw, text, id): 
                this.addTransitSpot(pitch, yaw, text, id, transitionScene);
            this.applyTransitionClicks();
        },
        addInfoSpot(pitch, yaw, text, id) {
            let controllerService = this;
            this.viewer.addHotSpot({
                'pitch': pitch,
                'yaw': yaw,
                'type': 'info',
                'text': text,
                'id': id,
                'clickHandlerFunc': () => {
                    controllerService.infoSpotClick(this)
                }
            }, this.currentScenePath);
        },
        infoSpotClick(spot) {
            if (this.editingMode) {
                this.getHotSpotInfo(spot.id);
            }
        },
        addTransitSpot(pitch, yaw, text, id, transitionScene) {
            this.viewer.addHotSpot({
                'pitch': pitch,
                'yaw': yaw,
                'type': 'scene',
                'text': text,
                'id': id,
                'sceneId': transitionScene
            });
        },
        transitSpotClick(spot) {
            if (this.editingMode) {
                this.getHotSpotInfo(spot.id);
            }
            else {
                this.currentScenePath = spot.sceneId;
                let homeButton = document.getElementById('homeButton');
                homeButton.style.display = this.currentScenePath == this.homeScene ? 'none' : 'block';
                this.loadScene(spot.sceneId);
            }
        },
        applyTransitionClicks() {
            this.viewer.getConfig().hotSpots.forEach(spot => {
                if (spot.type == 'scene') {
                    spot.div.onclick = () => {
                        this.transitSpotClick(spot);
                    }
                }
            });
        },
        moveHotSpot(pitch, yaw, text) {
            let spot = this.currentSpot;
            this.removeHotSpot();
            this.addHotSpot(spot.type, pitch, yaw, text, spot.id, spot.sceneID);
            this.currentSpot = undefined;
            this.applyTransitionClicks();
        },
        removeHotSpot() {
            let spots = this.hotSpots;
            const index = spots.indexOf(this.currentSpot);
            if (index > -1) {
                this.viewer.removeHotSpot(this.currentSpot.id);
            }
            this.applyTransitionClicks();
        },
        saveSpotsFromScene(scene = this.currentScenePath) {
            let data = JSON.stringify(this.scenes[scene]['hotSpots']);
            localStorage.setItem(scene, data);
        },
        loadSpotsToScene(scene = this.currentScenePath) {
            let data = localStorage.getItem(scene);
            if (data != undefined){
                let spots = JSON.parse(data);
                spots.forEach(spot => {
                    if (this.viewer.getConfig().hotSpots[spot.id] == undefined)
                    this.addHotSpot(spot.type, spot.pitch, spot.yaw, spot.text, spot.id, spot.sceneId);
                });
            }
        },
        setViewer(viewer) {
            this.viewer = viewer;
            this.viewer.on('load', () => {
                this.methods.onLoadEvent()
            });
        },
        getViewer() {
            return this.viewer;
        },
        getViewerContainer() {
            return this.viewerContainer;
        }
    }
}
</script>