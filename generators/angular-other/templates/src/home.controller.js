'use strict';
import { app } from './app.module.js';
import './feature.service.js';

export default app
    .controller('homeController', HomeController);

HomeController.$inject = ['$location'];

function HomeController($location) {
    var vm = this;
    vm.title = 'home';
    vm.hello = 'Hello, Watched World!'
    console.log($location);
};
