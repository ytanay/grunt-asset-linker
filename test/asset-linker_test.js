/*
 * asset-linker
 * https://github.com/ytanay/asset-linker
 *
 * Copyright (c) 2014 Yotam Tanay
 * Inspired by the work of zolmeister and scott-laursen
 * Licensed under the MIT license.
 */

'use strict';

var grunt = require('grunt');

exports['asset-linker'] = { // This is a highly naive way to test, but it's good enough for now.
  setUp: function(done) {
    done();
  },

  injector_test: function(test){
    test.expect(1);

    var actual = grunt.file.read('test/fixtures/injector.test.html');
    var expected = grunt.file.read('test/expected/injector.expected.html');
    test.equal(actual, expected, 'should inject applicable asset tags files into the file, with appropriate identation.');

    test.done();
  },

  tagger_test: function(test){
    test.expect(1);
    console.log('asserting!')
    var actual = grunt.file.read('test/fixtures/tagger.test.html');
    var expected = grunt.file.read('test/expected/tagger.expected.html');
    test.equal(actual, expected, 'should properly tag all <img> tags with the necessary distribution id');

    test.done();
  }
};
