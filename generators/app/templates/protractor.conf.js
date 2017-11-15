exports.config = {
    // A base URL for your application under test. Calls to protractor.get()
    // with relative paths will be prepended with this.
    baseUrl: 'http://localhost:50089/',

    capabilities: {
        'browserName': 'chrome',
        'chromeOptions': { 'args': ['--disable-extensions'] }
    },

    jasmineNodeOpts: {
        onComplete: null,
        isVerbose: false,
        showColors: true,
        includeStackTrace: true,
        defaultTimeoutInterval: 10000
    },

    options: {
        webdriverManagerUpdate: true
    },

    // Selector for the element housing the angular app - this defaults to
    // body, but is necessary if ng-app is on a descendant of  
    //rootElement: 'body'


    // The address of a running selenium server.
    seleniumAddress: 'http://localhost:4444/wd/hub',

    // Spec patterns are relative to the location of this config.
    specs: [
    './src/*.e2e.js'
    ],
};
