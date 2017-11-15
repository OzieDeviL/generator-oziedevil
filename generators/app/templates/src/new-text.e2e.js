describe('Homepage', function () {
    it('should say Hello World', function () {
        // Load the AngularJS homepage.
        browser.get('');

        // Find the element with ng-model matching 'yourName' - this will
        // find the <input type="text" ng-model="yourName"/> element - and then
        // type 'Julie' into it.

        // Find the element with binding matching 'yourName' - this will
        // find the <h1>Hello {{yourName}}!</h1> element.
        var greeting = element(by.id('ozProtractorTest3'));

        // Assert that the text element has the expected value.
        // Protractor patches 'expect' to understand promises.
        expect(greeting.getText()).toMatch('Hello, Static Feature!');
    });

    //it('should type in SuccessfullTest', function () {
        //browser.get('/');
    //    element(by.id('ozProtractorTest2')).sendKeys('SuccessfullTest');
    //    var textInput = element(by.id('ozProtractorTest2'));
    //    expect(textInput.getText()).toMatch('SuccessfullTest');
    //});
});