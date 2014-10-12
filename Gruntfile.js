/*
 * asset-linker
 * https://github.com/ytanay/asset-linker
 *
 * Copyright (c) 2014 Yotam Tanay
 * Inspired by the work of zolmeister and scott-laursen
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>',
      ],
      options: {
        jshintrc: '.jshintrc',
      },
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp'],
    },

    // Configuration to be run (and then tested).
    'asset-linker': {
      injector_test: {
        options: {
          start: '<!--SCRIPTS-->',
          end: '<!--SCRIPTS END-->',
          template: '\n<script src="%s"></script>',
          root: 'test/'
        },
        files: {
          'test/fixtures/injector.test.html': 'httpgoogle'
        }
      },
      tagger_test: {
        options: {
          tag: 'img',
          attr: 'src',
          id: 'd41d8cd98f00b204e9800998ecf8427e' // An empty md5 hash
        },
        files: {
          'test/fixtures/tagger.test.html': 'test/fixtures/*.js'
        }
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/_test.js'],
    },

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result. 'asset-linker:injector_test', '
  grunt.registerTask('test', ['clean', 'asset-linker:injector_test', 'asset-linker:tagger_test']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
