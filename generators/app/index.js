'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');

module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(
        'Welcome to ' + chalk.red('my web app generator') + ". It's a work in progress"
      )
    );

    const prompts = [
      // {
      //  type: 'input',
      //  name: 'projectPrefix',
      //  message: 'Provide a prefix for html class, angular components, and the like',
      //  default: 'oz',
      //  store: true
      // },
      {
        type: 'input',
        name: 'projectName',
        message: 'What is the project name, for package.json',
        default: this.appname.toLowerCase().replace(' ', '-'),
        // Validate that the name entered is okay for package.json
        validate: function(input) {
          var done = this.async();
          setTimeout(function() {
            if (!/^(?:@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/.test(input)) {
              done(
                'name must fit the standards provided by npm package.json docs https://docs.npmjs.com/files/package.json#name'
              );
              return;
            }
            done(null, true);
          }, 100);
        },
        store: true
      },
      {
        type: 'input',
        name: 'version',
        message: 'Enter the version number for package.json',
        default: '0.1.0',
        store: true
      },
      {
        type: 'input',
        name: 'description',
        message: 'Enter a description of the project for package.json',
        default: 'A web app',
        store: true
      }
    ];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      // Props object consists of keys drawn from the name functions above and corresponding values from user input
      this.props = props;
    });
  }

  writing() {
    this.fs.copyTpl(this.templatePath('*.+(json|js)'), this.destinationPath('./'), {
      title: ', World',
      props: this.props
    });
    this.fs.copy(this.templatePath('./src'), this.destinationPath('./src'));
  }

  install() {
    this.installDependencies({
      bower: false,
      npm: false,
      yarn: true
    });
  }
};
