'use strict';
import { app } from './app.module.js';

export default app
    .service('featureService', FeatureService);

FeatureService.$inject = ['$location'];

function FeatureService($location) {
    let svc = this;
    svc.title = 'feature';
    
    svc.getText = _getText;

    ////////////////////////////////////
    function _getText() {
        return 'Hello, Feature!';
    }
};
