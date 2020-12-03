class Controller{
    constructor(viewerContainer, pitch, yaw, spotText, spotChosenIndicator) {
        Controller.viewerContainer = viewerContainer;
        Controller.pitch = pitch;
        Controller.yaw = yaw;
        Controller.spotText = spotText;
        Controller.spotChosenIndicator = spotChosenIndicator;
        Controller.addPannellumViewer();
    }
    
    static addPannellumViewer(viewerContainer, pitch, yaw) {
        Controller.viewer = pannellum.viewer(viewerContainer, {
            'default': {
                'type': 'equirectangular',
                'basePath': 'panoramas/',
                'autoLoad': true,
                'author': 'Akopyan Aleksandr',
                'title': 'Customizable pannellum viewer',
                'hotSpots': []
            },
            'scenes': {}
        });
        Controller.viewer.on('load', function () {
            Controller.loadSpotsToScene();
            Controller.applyTransitionClicks();
        });
        let spotDebugIndicator = document.getElementsByClassName('pnlm-sprite pnlm-hot-spot-debug-indicator')[0];
        spotDebugIndicator.onclick = function() {
            pitch = Controller.viewer.getPitch();
            yaw = Controller.viewer.getYaw();
        };
        Controller.homeScene;
    }

    static addScene(panorama) {
        let scene = {
            'panorama': panorama
        }
        Controller.viewer.addScene(panorama, scene);
    }

    static loadPanorama(panorama) {
        if (panorama != 'Choose panorama') {
            if (!(panorama in Controller.viewer.getConfig()['scenes']))
                Controller.addScene(panorama);
            Controller.viewer.loadScene(panorama);
            Controller.currentScene = panorama;
        }    
    }

    static getHotSpotInfo(index) {
        let hotSpots = Controller.viewer.getConfig()['hotSpots'];
        let spot = hotSpots[index];
        Controller.pitch = spot.pitch;
        Controller.yaw = spot.yaw;
        Controller.spotText = spot.text;
        if (spot.type == 'scene')
            transitSelector.value = spot.sceneId;
        Controller.currentSpot = spot;
    }

    static editPanorama(isEditing) {
        let hotSpotDebugIcon = document.getElementsByClassName('pnlm-sprite pnlm-hot-spot-debug-indicator')[0];
        if (isEditing) {
            hotSpotDebugIcon.style.display = 'block';
        }
        else {
            hotSpotDebugIcon.style.display = 'none';
        }
    }

    static addHotSpot(spotType, pitch, yaw, text, spotId = -1, transitionScene) {
        let id = spotId != -1? spotId: Controller.viewer.getConfig()["hotSpots"].length;

        spotType == 'info' ? 
            Controller.addInfoSpot(pitch, yaw, text, id): 
            Controller.addTransitSpot(pitch, yaw, text, id, transitionScene);
    }
    
    static addInfoSpot(pitch, yaw, text, id) {
        Controller.viewer.addHotSpot({
            'pitch': pitch,
            'yaw': yaw,
            'type': 'info',
            'text': text,
            'id': id,
            'clickHandlerFunc': function() {
                Controller.infoSpotClick(this)
            }
        }, Controller.currentScene);
    }
    
    static infoSpotClick(spot) {
        if (Controller.editingMode) {
            Controller.getHotSpotInfo(spot.id);
        }
    }

    static addTransitSpot(pitch, yaw, text, id, transitionScene) {
        if (!transitionScene) {
            alert('You have to choose panorama to transit to')
        }
        else {
            Controller.viewer.addHotSpot({
                'pitch': pitch,
                'yaw': yaw,
                'type': 'scene',
                'text': text,
                'id': id,
                'sceneId': transitionScene
            });
        }
    }
    
    static transitSpotClick(spot) {
        if (Controller.editingMode) {
            Controller.getHotSpotInfo(spot.id);
        }
        else {
            Controller.currentScene = spot.sceneId;
            let homeButton = document.getElementById('homeButton');
            homeButton.style.display = Controller.currentScene == Controller.homeScene ? 'none' : 'block';
            Controller.loadPanorama(spot.sceneId);
        }
    }

    static applyTransitionClicks() {
        Controller.viewer.getConfig().hotSpots.forEach(spot => {
            if (spot.type == 'scene') {
                spot.div.onclick = function() {
                    Controller.transitSpotClick(spot);
                }
            }
        });
    }

    static moveHotSpot(pitch, yaw, text) {
        let spot = Controller.currentSpot;
        Controller.deleteHotSpot();
        Controller.addHotSpot(spot.type, pitch, yaw, text, spot.id, spot.sceneID);
        Controller.currentSpot = undefined;
    }

    static deleteHotSpot() {
        let spots = Controller.viewer.getConfig()["hotSpots"];
        const index = spots.indexOf(Controller.currentSpot);
        if (index > -1) {
            Controller.viewer.removeHotSpot(Controller.currentSpot.id);
        }
    }

    static saveSpotsFromScene(scene = Controller.currentScene) {
        let data = JSON.stringify(Controller.viewer.getConfig()['scenes'][scene]['hotSpots']);
        localStorage.setItem(scene, data);
    }

    static loadSpotsToScene(scene = Controller.currentScene) {
        let data = localStorage.getItem(scene);
        if (data != undefined){
            let spots = JSON.parse(data);
            spots.forEach(spot => {
                if (Controller.viewer.getConfig().hotSpots[spot.id] == undefined)
                    Controller.addHotSpot(spot.type, spot.pitch, spot.yaw, spot.text, spot.id, spot.sceneId);
            });
        }
    }
}
