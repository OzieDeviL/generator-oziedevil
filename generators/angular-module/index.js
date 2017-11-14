'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const rootPkg = require('./templates/package.json');
const glob = require('glob');

module.exports = class extends Generator {
  constructor(args, options) {
    super(args, options);

    this.option('generateInto', {
      type: String,
      required: false,
      default: '',
      desc: 'Relocate the location of the generated files.'
    });
  }

  prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(
        'Welcome to ' +
          chalk.red('my web app generator') +
          chalk.red('generator-oziedevil') +
          ". It's a work in progress"
      )
    );
    // Generate
    const prompts = [
      {
        type: 'input',
        name: 'moduleName',
        message: 'What would you like to name the new angular module? Make it camelCase!',
        // AddValidation for angular component name
        default: 'app'
      },
      {
        type: 'input',
        name: 'destinationPathExt',
        message: 'Specify a destination directory for this file relative to /src',
        // AddValidation for directory
        default: './src',
        store: true
      },
      {
        type: 'input',
        name: 'webpackEntryPoint',
        message: 'Specify the file webpack is using as its entry point relative to ./',
        // AddValidation for directory
        default: './src/webpackEntryPoint.js',
        store: true
      },
      {
        type: 'input',
        name: 'pkgJsonDevDeps',
        message:
          'Provide a JSON string of devDependencies, with versioning, to add to package.json not including angular-mocks',
        default: '{"angular-1.5-cli" : "1.6.1","eu-tax-rate": "1.0.1"}',
        filter: function(str) {
          return JSON.parse(str);
        }
      },
      {
        type: 'input',
        name: 'pkgJsonDeps',
        message:
          'Provide a JSON string of dependencies, with versioning, to add to package.json not including angular',
        default: '{"angular-translate-csv" : "0.8.3","angular-translate": "2.16.0"}',
        filter: function(str) {
          return JSON.parse(str);
        }
      },
      {
        type: 'input',
        name: 'importPkgDevDeps',
        message:
          'Provide a comma-delimited list of devDependencies to import to this js module, not including angular-mocks, do not include spaces around commas',
        default: 'angular-1.5-cli,eu-tax-rate',
        filter: function(str) {
          return str.split(',');
        }
      },
      {
        type: 'input',
        name: 'importPkgDeps',
        message:
          'Provide a comma-delimited list of dependencies to import to this js module, not including angular-mocks, do not include spaces around commas',
        default: 'angular-translate-csv,angular-translate',
        filter: function(str) {
          return str.split(',');
        }
      },
      {
        type: 'input',
        name: 'ngNonSrcDeps',
        message:
          "enter a comma-delimited string of packages and native ngServices to include in the di array for this module. Leave out any dependencies from your src folder don't spaces around commas",
        default: '$http,$window,angular-translate',
        filter: function(str) {
          return str.split(',');
        }
      },
      {
        type: 'checkbox',
        name: 'ngSrcDeps',
        message:
          'check the ng Modules which the new angular module will have a dependencies on',
        choices: glob.sync('./src/**.module.js', { cwd: this.destinationRoot() }),
        store: true
      }
    ];

    return this.prompt(prompts).then(props => {
      // Props object consists of keys drawn from the name functions above and corresponding values from user input, available to templates
      this.props = props;
    });
  }

  writing() {
    const pkgJson = {
      dependencies: Object.assign(rootPkg.dependencies, this.props.pkgJsonDeps),
      devDependencies: Object.assign(rootPkg.devDependencies, this.props.pkgJsonDevDeps)
    };
    // Augment the user-inputted packages with the hard-coded package dependencies
    this.props.importPkgDevDeps = Object.keys(pkgJson.devDependencies);
    this.props.importPkgDeps = Object.keys(pkgJson.dependencies);

    this.fs.extendJSON(
      this.destinationPath(this.options.generateInto, 'package.json'),
      pkgJson
    );

    // Add the import statement to the webpack index.js file using append
    if (this.props.webpackEntryPoint.length > 0) {
      this.fs.append(
        this.destinationPath(this.props.webpackEntryPoint),
        'import { ' +
          this.props.moduleName +
          " } from './" +
          this.props.destinationPathExt +
          this.props.moduleName +
          ".module.js';"
      );
    }

    // The module template
    this.fs.copyTpl(
      this.templatePath('./src/template.module.js'),
      this.destinationPath(
        this.props.destinationPathExt +
          this.props.destinationPathExt +
          this.props.moduleName +
          '.module.js'
      ),
      {
        props: this.props
      }
    );
    // The module spec template
    this.fs.copyTpl(
      this.templatePath('./src/template.module.spec.js'),
      this.destinationPath(
        this.props.destinationPathExt +
          this.props.destinationPathExt +
          this.props.moduleName +
          '.module.spec.js'
      ),
      {
        props: this.props
      }
    );
    // This.fs.copy(this.templatePath('!(./template*|./**template.*)'), this.destinationPath());
  }

  install() {
    this.installDependencies({
      bower: false,
      npm: false,
      yarn: true
    });
  }
};
