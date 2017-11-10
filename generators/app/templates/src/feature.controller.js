'use strict';
import { app } from './app.module.js';
import './feature.service.js';

export default app.controller('featureController', FeatureController);

FeatureController.$inject = ['$location'
                            , 'featureService'];
function FeatureController($location
                            , featureService) {
    var vm = this;
    vm.title = 'feature';
    vm.text = null;

    _activate();
    //////////////////////////////////////

    function _activate() {
        vm.text = featureService.getText();
    }
};
