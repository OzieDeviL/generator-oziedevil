/// <binding />
module.exports = function (grunt) {

    //documentation for grunt task config https://gruntjs.com/configuring-tasks
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        //documentation for grunt-karma config https://github.com/karma-runner/grunt-karma
        karma: {
            unit: {
                configFile: 'karma.conf.js',
                background: true,
                singlerun: false
            }
        },
        protractor: {
            config: './protractor.conf.js'
        },
        watch: {
            files: ['./src/**.js'],
            tasks: ['karma:unit:run']
        },
    });

    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-protractor-runner');

    grunt.registerTask('devBackground', ['karma', 'watch']);
    grunt.registerTask('e2e', ['protractor']);
};