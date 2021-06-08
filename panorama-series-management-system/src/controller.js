import 'pannellum/src/js/pannellum';
import 'pannellum/src/js/libpannellum';

export default class Controller{
    
    constructor() {
        this.homeScenePath;
        this.editingMode = false;
        this.pitch = 0;
        this.yaw = 0;
        this.text = '';
        this.currentSpot;

        let viewerConfig = {
            'default': {
                'type': 'equirectangular',
                'hotSpots': [],
                'autoLoad': true
            },
            'scenes': [],
            "strings": {
                "loadButtonLabel": "Нажмите, чтобы <br>Загрузить<br>Панораму",
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
        };
        this.viewerContainer = document.createElement('div');
        this.viewerContainer.id = 'viewer-container';
        this.viewer = window.pannellum.viewer(this.viewerContainer, viewerConfig);
        this.viewer.on('load', () => {
            this.loadSpotsToScene();
            this.applyTransitionClicks();
        });

        this.createHomeButtton();
    }

    clearCurrentSpotInfo() {
        this.currentSpot = null;
    }

    setHomeScenePath(scenePath) {
        this.homeScenePath = scenePath;
    }

    getViewer() {
        return this.viewer;
    }

    getViewerContainer() {
        return this.viewerContainer;
    }

    setEditingMode(modeState) {
        this.editingMode = modeState;
    }

    createHomeButtton() {
        let button = document.createElement('input');
        button.type='button';
        button.id='homeButton'
        button.value = 'Home';
        button.style.border = '1px solid #999';
        button.style.padding = '2px 10px';
        button.style.display = 'none';
        button.style.background = 'white';
        button.style.borderColor = 'black';
        button.style.borderRadius = '20%';
        button.onclick = () => {
            this.viewer.loadScene(this.homeScenePath);
            button.style.display = 'none';
        }
        button.style.position = 'absolute';
        button.style.top = '4px';
        button.style.right = '4px';
        this.viewerContainer.getElementsByClassName('pnlm-ui')[0].appendChild(button);
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

    addHotSpot(spotType, spotId = -1, transitionScene) {
        let id = spotId != -1? spotId: this.viewer.getConfig()["hotSpots"].length;

        spotType == 'info' ? 
            this.addInfoSpot(this.pitch, this.yaw, this.text, id): 
            this.addTransitSpot(this.pitch, this.yaw, this.text, id, transitionScene);
        this.applyTransitionClicks();
    }
    
    addInfoSpot(pitch, yaw, text, id) {
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
        }, that.currentScenePath);
    }
    
    getHotSpotInfo(spot) {
        if (this.editingMode) {
            this.currentSpot = spot;
            this.pitch = spot.pitch;
            this.yaw = spot.yaw;
            this.text = spot.text;
        }
    }

    addTransitSpot(pitch, yaw, text, id, transitionScene) {
        this.viewer.addHotSpot({
            'pitch': pitch,
            'yaw': yaw,
            'type': 'scene',
            'text': text,
            'id': id,
            'sceneId': transitionScene
        });
    }
    
    transitSpotClick(spot) {
        if (this.editingMode) {
            this.getHotSpotInfo(spot);
        }
        else {
            this.currentScenePath = spot.sceneId;
            let homeButton = document.getElementById('homeButton');
            homeButton.style.display = this.currentScenePath == this.homeScenePath ? 'none' : 'block';
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
        this.addHotSpot(spot.type, this.pitch, this.yaw, this.text, spot.id, spot.sceneID);
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

    saveSpotsFromScene(scene = this.currentScenePath) {
        let data = JSON.stringify(this.viewer.getConfig()['scenes'][scene]['hotSpots']);
        localStorage.setItem(scene, data);
    }

    loadSpotsToScene(scene = this.currentScenePath) {
        let data = localStorage.getItem(scene);
        if (data != undefined){
            let spots = JSON.parse(data);
            spots.forEach(spot => {
                if (this.viewer.getConfig().hotSpots[spot.id] == undefined)
                this.addHotSpot(spot.type, spot.pitch, spot.yaw, spot.text, spot.id, spot.sceneId);
            });
        }
    }
}