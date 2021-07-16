# Panorama series management system
## About
This is a diploma project of management system for panorama series which uses:
- [Pannelum.js](https://pannellum.org) for viewing panoramas in browser;
- [Vue.js](https://ru.vuejs.org) as an interface framework;
- [Vuetify.js](https://vuetifyjs.com/en/) for interface to be prettier.
## Installation
1. Clone this project to your computer.
2. Write `npm install`  in your terminal to install necessary  dependencies.
3. Write `npm run serve` to run developer version or `npm run build` to building project.
## Page content
In loaded page you will see Pannellum.js viewer on the left side of the page and control menu on the right side. Control menu has:
1. Language selector (for now there are English and Russian versions) 
2. Starting panorama selector where you can select your rooting panorama.
3. Editor switch for enabling/disabling editing mode.
4. Cross coordinates button.
5. Mark type selector.
6. Panorama for transitioning selector.
7. Mark pitch, yaw and description input fields.
8. Control buttons for marks (plus for adding, minus removing and pencil for moving).
9. Save button to save changes (Further implementations to be done).
10. Input for json config file with marks on panoramas
11. Input for loading panoramas.

## How to use
1. Select your starting panorama in the first selector.
2. Change `panorama editing` switch for enabling/disabling editing mode.
3. Select mark type in `mark type`selector.
4. If you chose `transit` type, then you must select panorama for transitioning in selector below.
5. You can input coordinates manually or drag cross in the viewer (on left side of the page) at desired position and click `cross coordinates` button and values will be filled automatically.
6. Add some description text of your mark in `description` input.
7. Click `+` to add mark on panorama.
8. To remove mark you should enable editing mode, click on desired mark in your viewer on the left and click `-` button.
9. To move you should enable editing mode, click on desired mark in your viewer on the left, input new coordinates manually or by cross and click `pencil` button.
10. To enable transitioning between panoramas you should disable editing mode.
11. Usage json config file with must be done after adding all panoramas in input field.
