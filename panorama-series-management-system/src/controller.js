import 'pannellum/src/js/pannellum';
import 'pannellum/src/js/libpannellum';

export default class Controller{
    
    constructor(viewerConfig = undefined) {
        this.homeScenePath;
        this.editingMode = false;
        this.pitch = 0;
        this.yaw = 0;
        this.text = '';
        this.currentSpot;
        this.homeBtn;

        if (viewerConfig == undefined)
            viewerConfig = {
                'default': {
                    'type': 'equirectangular',
                    'hotSpots': [],
                    'autoLoad': true
                },
                'scenes': [],
                'showControls': false,
            };
        this.viewerContainer = document.createElement('div');
        this.viewerContainer.id = 'viewer-container';
        this.viewer = window.pannellum.viewer(this.viewerContainer, viewerConfig);
        this.viewer.on('load', () => {
            this.loadSpotsToScene();
            this.applyTransitionClicks();
        });
    }

    clearCurrentSpotInfo() { this.currentSpot = null; }

    setHomeScenePath(scenePath) { this.homeScenePath = scenePath; }

    getViewer() { return this.viewer; }

    getViewerContainer() { return this.viewerContainer; }

    setEditingMode(modeState) { this.editingMode = modeState; }

    addHomeButton(button) {
        button.style.display = 'none';
        button.onclick = () => {
            this.viewer.loadScene(this.homeScenePath);
            button.style.display = 'none';
        }
        button.style.position = 'absolute';
        button.style.top = '4px';
        button.style.right = '4px';
        this.viewerContainer.getElementsByClassName('pnlm-ui')[0].appendChild(button);
        this.homeBtn = button;
    }

    setCenterPosition() {
        this.pitch = this.viewer.getPitch();
        this.yaw = this.viewer.getYaw();
    }

    addScene(panoramaPath) {
        let scene = {
            'panorama': panoramaPath
        }
        this.viewer.addScene(panoramaPath, scene);
    }

    loadScene(panoramaPath) {
        if (!(panoramaPath in this.viewer.getConfig()['scenes']))
            this.addScene(panoramaPath);
        this.viewer.loadScene(panoramaPath);
        this.currentScenePath = panoramaPath;
    }

    displayCross() {
        let hotSpotDebugIcon = document.getElementsByClassName('pnlm-sprite pnlm-hot-spot-debug-indicator')[0];
        hotSpotDebugIcon.style.display = this.editingMode ? 'block': 'none';
    }

    addHotSpot(scene = this.currentScenePath, spotType, spotId = -1, transitionScene) {
        let id = spotId != -1? spotId: this.viewer.getConfig()["hotSpots"].length;

        spotType == 'info' ? 
            this.addInfoSpot(scene, this.pitch, this.yaw, this.text, id): 
            this.addTransitSpot(scene, this.pitch, this.yaw, this.text, id, transitionScene);
        this.applyTransitionClicks();
    }
    
    addInfoSpot(scene, pitch, yaw, text, id) {
        let that = this;
        this.viewer.addHotSpot({
            'pitch': pitch,
            'yaw': yaw,
            'type': 'info',
            'text': text,
            'id': id,
            'clickHandlerFunc': function() {
                that.getHotSpotInfo(this);
            }
        }, scene);
    }
    
    getHotSpotInfo(spot) {
        if (this.editingMode) {
            this.currentSpot = spot;
            this.pitch = spot.pitch;
            this.yaw = spot.yaw;
            this.text = spot.text;
        }
    }

    addTransitSpot(scene, pitch, yaw, text, id, transitionScene) {
        this.viewer.addHotSpot({
            'pitch': pitch,
            'yaw': yaw,
            'type': 'scene',
            'text': text,
            'id': id,
            'sceneId': transitionScene
        }, scene);
    }
    
    transitSpotClick(spot) {
        if (this.editingMode) {
            this.getHotSpotInfo(spot);
        }
        else {
            this.currentScenePath = spot.sceneId;
            this.homeBtn.style.display = this.currentScenePath == this.homeScenePath ? 'none' : 'block';
            this.loadScene(spot.sceneId);
        }
    }

    applyTransitionClicks() {
        this.viewer.getConfig().hotSpots.forEach(spot => {
            if (spot.type == 'scene') {
                spot.div.onclick = () => {
                    this.transitSpotClick(spot);
                }
            }
        });
    }

    moveHotSpot() {
        let spot = this.currentSpot;
        this.removeHotSpot();
        this.addHotSpot(this.currentScenePath, spot.type, this.pitch, this.yaw, this.text, spot.id, spot.sceneID);
        this.applyTransitionClicks();
        this.clearCurrentSpotInfo();
    }

    removeHotSpot() {
        let spots = this.viewer.getConfig()["hotSpots"];
        const index = spots.indexOf(this.currentSpot);
        if (index > -1) {
            this.viewer.removeHotSpot(this.currentSpot.id);
        }
        this.applyTransitionClicks();
        this.clearCurrentSpotInfo();
    }

    getSpotsFromScene(scene = this.currentScenePath) {
        if (scene in this.viewer.getConfig().scenes) {
            let data = this.viewer.getConfig().scenes[scene].hotSpots;
            return data;
        }

    }

    loadSpotsToScene(scene = this.currentScenePath, spots = undefined) {
        if (spots != undefined && scene in this.viewer.getConfig().scenes){
            spots.forEach(spot => {
                if (this.viewer.getConfig().hotSpots[spot.id] == undefined) {
                    this.pitch = spot.pitch;
                    this.yaw = spot.yaw;
                    this.text = spot.text;
                    this.addHotSpot(scene, spot.type, spot.id, spot.sceneId);
                }
            });
        }
    }
}