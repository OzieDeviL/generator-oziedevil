'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const rootPkg = require('./templates/package.json');
const glob = require('glob');
// Const _ = require('lodash');

module.exports = class extends Generator {
  constructor(args, options) {
    super(args, options);
    // I can't figure out why, but putting a core node module in the require statements up top does not place it in the closure scope below
    // but it shows up if you place it in the generator like this. This is probably a bad idea.
    this.path = require('path');
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
          chalk.red(' oziedevil') +
          ". It's a work in progress"
      )
    );

    // Need this to allow the filter function in moduleName to have access to lodash's camelCase function
    // const camelcase = _.camelCase;
    const prompts = [
      {
        type: 'input',
        name: 'moduleName',
        message: 'What would you like to name the new angular module?',
        // AddValidation for angular component name
        // filter: function (str) {
        //  return camelcase(str)
        // },
        default: 'app'
      },
      // Add prefixing ability later
      {
        type: 'input',
        name: 'destinationPathExt',
        message:
          'Specify a destination directory for the new angular module, relative to the current directory',
        // AddValidation for directory
        default: './src',
        store: true
      },
      // In the future add functionality to conditionally create the webpack index and the webpack spec index
      {
        type: 'input',
        name: 'webpackIndexPath',
        message:
          'Specify the path to the webpack entry point, relative to the current directory',
        // This needs to be modded to include everything under the ./ directory, but the glob function is giving me shit right now
        // choices: glob.sync('./!(node_modules)**/*.js', { cwd: this.destinationRoot() }),
        default: './src/webpack.index.js',
        store: true
      },
      {
        type: 'input',
        name: 'webpackSpecsIndexPath',
        message:
          'Specify the path to the webpack entry point used for testing, relative to the current directory',
        // This needs to be modded to include everything under the ./ directory, but the glob function is giving me shit right now
        // choices: glob.sync('./!(node_modules)**/*.js', { cwd: this.destinationRoot() }),
        default: './src/webpack-specs.index.js',
        store: true
      },
      {
        type: 'input',
        name: 'pkgJsonDevDeps',
        message:
          'Provide devDependencies/versions, in JSON format, to add to package.json.\nDo not including angular-mocks\ne.g. { "some-devDependency" : "version" }',
        default: '{}',
        filter: function(str) {
          return JSON.parse(str);
        },
        // Storing the answer results in a yeoman error, because it expects a string
        store: false
      },
      {
        type: 'input',
        name: 'pkgJsonDeps',
        message:
          'Provide dependencies/versions, in JSON format, to add to package.json.\nDo not including angular\ne.g. { "some-dependency" : "version" }',
        // Test default: '{"angular-translate-csv" : "0.8.3","angular-translate": "2.16.0"}',
        default: '{}',
        filter: function(str) {
          return JSON.parse(str);
        },
        // Storing the answer results in a yeoman error, because it expects a string
        store: false
      },
      {
        type: 'input',
        name: 'importPkgDeps',
        message:
          'Provide an array, in JSON format, of dependencies to include in the module\'s import statements\ne.g. ["angular-translate", "angular-translate-csv"]',
        // Test default: 'angular-translate-csv,angular-translate',
        default: '[]',
        filter: function(str) {
          return JSON.parse(str);
        },
        // Storing the answer results in a yeoman error, because it expects a string
        store: false
      },
      {
        type: 'input',
        name: 'ngNonSrcDeps',
        message:
          'Provide an array, in JSON format, of packages to include in the di array for this module.',
        // Test default: 'angular-translate',
        default: '[]',
        filter: function(str) {
          return JSON.parse(str);
        },
        // Storing the answer results in a yeoman error, because it expects a string
        store: false
      }
    ];

    // Guard to make sure there are existing ng Modules for there to be any dependencies on
    if (
      glob.sync('./src/**.module.js', { cwd: this.destinationRoot() }) &&
      glob.sync('./src/**.module.js', { cwd: this.destinationRoot() }).length > 0
    ) {
      // The basename funciton is needed in the filter function below
      var basename = this.path.basename;
      prompts.push({
        type: 'checkbox',
        name: 'ngSrcDeps',
        message:
          'check the ng Modules which the new angular module will have a dependencies on',
        choices: glob.sync('./src/**.module.js', { cwd: this.destinationRoot() }),
        // We only want the name, webpack will guess at the extension and is configured in the reolve.modules option to look in all the src directories for dependencies
        filter: function(arr) {
          return Array.from(arr, ngSrcDep => basename(ngSrcDep, '.js'));
        },
        store: true
      });
    }

    return this.prompt(prompts).then(props => {
      // Props object consists of keys drawn from the name functions above and corresponding values from user input, available to templates
      this.props = props;
    });
  }

  writing() {
    // There are package dependencies already in this template's package.json
    // these lines supplement those with the user-inputted dependencies
    const pkgJson = {
      dependencies: Object.assign(rootPkg.dependencies, this.props.pkgJsonDeps),
      devDependencies: Object.assign(rootPkg.devDependencies, this.props.pkgJsonDevDeps)
    };
    // This does the actual insertion into the existing project's package.json file'
    this.fs.extendJSON(
      this.destinationPath(this.options.generateInto, 'package.json'),
      pkgJson
    );

    // Add the new module file to the import statements in the webpack entry point
    if (this.props.webpackIndexPath.length > 0) {
      this.fs.append(
        this.path.resolve(this.destinationPath(), this.props.webpackIndexPath),
        "import '" + this.props.moduleName + ".module'"
      );
    }

    // Add the new module file to the import statements in the webpack entry point used for testing
    if (this.props.webpackSpecsIndexPath.length > 0) {
      this.fs.append(
        this.path.resolve(this.destinationPath(), this.props.webpackSpecsIndexPath),
        "import '" + this.props.moduleName + ".module.spec'"
      );
    }

    // Augment the user-inputted packages with the hard-coded package dependencies, for use in the import statements of the module.js file
    if (this.props.importPkgDeps && Object.keys(pkgJson.dependencies).length > 0) {
      this.props.importPkgDeps = this.props.importPkgDeps.concat(
        Object.keys(pkgJson.dependencies)
      );
    }
    // Write a new module file from the module template file
    this.fs.copyTpl(
      this.templatePath('./src/module-name.module.ejs'),
      this.path.resolve(
        this.destinationPath(),
        this.props.destinationPathExt,
        this.props.moduleName + '.module.js'
      ),
      {
        props: this.props
      }
    );

    // //write a new module test file from the module template file
    this.fs.copyTpl(
      this.templatePath('./src/module-name.module.spec.ejs'),
      this.path.resolve(
        this.destinationPath(),
        this.props.destinationPathExt,
        this.props.moduleName + '.module.spec.js'
      ),
      {
        props: this.props
      }
    );

    // Didn't end up needing this after implementing webpack's module resolve feature.
    // function importRelPathHelper(importingJSModulePath, newNGFileExtensions, gen) {
    //  return '.\/' + gen.path.posix.relative(
    //    gen.path.posix.resolve(gen.destinationPath(), gen.path.posix.dirname(importingJSModulePath)),
    //    gen.path.posix.resolve(gen.destinationPath(), gen.props.destinationPathExt, gen.props.moduleName + newNGFileExtensions));
    // }
  }

  install() {
    this.installDependencies({
      bower: false,
      npm: false,
      yarn: true
    });
  }
};
