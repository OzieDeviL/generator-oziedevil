import template from './template.module.js';

let testModule;

describe(template.name, function () {
  beforeEach(function () {
    testModule = template;
  });

  template.requires.forEach(dependency => {
    it('should have the dependency called ' + dependency, function () {
      expect(template.requires.filter(el => el === dependency).length.toEqual(1);
    });
  });

});
