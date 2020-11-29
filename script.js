let app = {

}

let div = document.createElement('div');
div.id = 'app';

document.getElementsByTagName('body')[0].appendChild(div);
Vue.createApp(app).mount('#app');