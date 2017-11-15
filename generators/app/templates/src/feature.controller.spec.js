import './feature.controller.js';
import './feature.controller.js'

describe('featureController', function () {
    beforeEach(angular.mock.module('app'));
    var ctrl;
    beforeEach(inject(function ($controller) {
    ctrl = $controller('featureController');
    }))

    it('should have a property called title', function () {
        expect(ctrl.title).toBeDefined();
    })

    it('\'s title should be feature', function () {
        expect(ctrl.title).toEqual('feature');
    })


});