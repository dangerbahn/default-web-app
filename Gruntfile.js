module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    banner: "/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ",
    /*
    * generates the icon font files, css & html demo based on contents of public/icons/source/svg
    * @module tasks
    * @class webfont
    */
    env: {
      dev: "http://localhost:4200/"
    },
    /*
    * @module tasks
    * @class copy
    */
    copy: {
      ios: {
        files: [{
          expand: true,
          cwd: "dist/",
          src: "**",
          dest: "../app-name/webapp"
        }]

      },
      android: {
        files: [{
          expand: true,
          cwd: "dist/",
          src: "**",
          dest: "../app/src/main/assets"
        }]

      }
    },
    /*
    * @module tasks
    * @class clean
    */
    clean: {
      temp: "temp/",
      options: { force: true },
      ios: "../app-name/webapp/",
      android: "../app/src/main/assets"
    },
    exec: {
      ember: 'ember s',
      bower_install: 'bower install',
      copy_config: 'cp -n ./app/example.config.js ./app/.config.js || :',
      emberLiveReloadDisabled: 'ember s --live-reload=false',
      build: 'ember build --prod',
      serve: 'EMBER_CLI_CORDOVA=0 ember serve'
    },
    cmq: {
      prod: {
        files: {
          'dist/assets': ['dist/assets/*.css']
        }
      }
    },
    cssmin: {
      prod: {
        files: [{
          expand: true,
          cwd: 'dist/assets',
          src: ['*.css'],
          dest: 'dist/assets',
          ext: '.css'
        }]
      }
    },
    autoprefixer: {
      options: {
        // Task-specific options go here.
      },
      multiple_files: {
          src: 'dist/assets/*.css'
      },
    },
  });
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-combine-media-queries');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadTasks('tasks');

  /*
  * combines multiple tasks into one task that generates the icon fonts, scss partial, html demo, png fallbacks & places the files in the appropriate location.
  * @module tasks
  * @class generate_icons
  */
  grunt.registerTask("init", ["exec:bower_install", "generate_config", "generate_scss"]);
  grunt.registerTask("default", ["generate_config", "generate_scss", "exec:serve"]);
  grunt.registerTask("serve", ["generate_scss", "exec:emberLiveReloadDisabled"]);
  grunt.registerTask("build_ios", ["exec:bower_install", "generate_scss", "exec:build", "cmq:prod", "cssmin:prod", "clean:ios", "copy:ios"]);
  grunt.registerTask("build_android", ["exec:bower_install", "generate_scss", "exec:build", "cmq:prod", "cssmin:prod", "autoprefixer:multiple_files", "clean:android", "copy:android"]);
};
