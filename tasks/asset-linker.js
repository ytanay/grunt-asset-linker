/*
 * asset-linker
 * https://github.com/ytanay/asset-linker
 *
 * Copyright (c) 2014 Yotam Tanay
 * Inspired by the work of zolmeister and scott-laursen
 * Licensed under the MIT license.
 */

'use strict';

var util = require('util');

var _AssetLinker = module.exports = function _AssetLinker(grunt){

	grunt.registerMultiTask('asset-linker', 'Autoinsert asset tags and distribution Id\'s in markup files.', function(){
		
		var options = this.options({ // Merge task-specific and/or target-specific options with these defaults.
			start: '<!--SCRIPTS-->',
			end: '<!--SCRIPTS END-->',
			template: '<script src="%s"></script>',
			root: '',
			relative: false,
			verifyExists: true, // Checks if files are present on the filesystem before injecting them
			host: undefined, // Allows Urls to be passed in
			attr: 'src', // The attribute in said tag which links to the distribution
			injector: function(path, id){ // This function gets called with a path and an id to inject in it
				
				if(!path){ // Just in case
					return '';
				}

				var parts = path.split('.'),
					current = parts[parts.length - 2];

				// Do we already have a id for this link?
				if(parts.length > 2 && current.length === id.length && /[0-9a-f]+/i.test(current)){ //Naively assume that id are hex based. Why not?
					parts[parts.length - 2] = id; // Replace the old id with the new one
					return parts.join('.');
				}

				if(parts.length < 2){ // If this path does not have an extension or is empty, we'll leave it as it is
					return path;
			}

				// Otherwise, we have a fresh link. Time to inject a tag in it!
				var ext = parts.pop();
				return parts.join('.') + '.' + id + '.' + ext; 

			}
		});

		if(options.tag){
			options.tag = new RegExp('<' + options.tag + '.*' + options.attr + '="(.+)".*>', 'gi');
			return this.files.forEach(function(file){ // As always, go through our file groups.
				grunt.file.expand({}, file.dest).forEach(function(path){ // And grab the relevant paths
					var page = grunt.file.read(path); // Get the file
					page = page.replace(options.tag, function(tag, src){ // And search through it, to find the tags we are looking for.
						//In each tag, replace the old attribute value, with the new injected attribute value;
						return tag.replace(options.attr + '="' + src + '"', options.attr + '="' + options.injector(src, options.id) + '"');
					});
					grunt.file.write(path, page); // Finally, write it back
				});
			});
		}

		this.files.forEach(function(group){

			var tags = group.src.filter(function(path){ // This filters the links we are trying to inject
					grunt.log.warn('cecking ' +  path)
					if(/^https?:\/\//.test(path)){ // If we are dealing with a valid url 
						return options.allowURL; // And we allow urls, go ahead, otherwise, skip it
					}

					if(grunt.file.exists(path)){ // We are dealing with a file or an invalid url, which is it?
						return true;
					}

					grunt.log.warn('Source path `' + path + '` is not a valid file or URL');
					return !options.verifyExists; // If this isn't a valid file/URL, we'll return based on us needing to check if the path is valid.
				}).map(function(path){ // This builds the tags around them

					if(/^https?:\/\//.test(path)){ // A bit redundant, I admit, but simpler than wrapping everything in objects.
						return util.format(options.template, path);
					}

					path = path.replace(options.root, ''); // Strip out the root path

					if(options.relative){ // If "relative" option is set, remove initial forward slash from file path
						path = path.replace(/^\//,'');
					}

					// For sanity's sake, we'll strip out line breaks to get a clean tag. We'll calculate the actualidentation in a bit.
					return util.format(options.template, path).replace(/(\r|\n)/g, ''); 
				});

			grunt.file.expand({}, group.dest).forEach(function(path){ // Grab the actual files we need to process
				var page = grunt.file.read(path);
				var start = page.indexOf(options.start); // Finds where the asset group starts 
				var end = page.indexOf(options.end, start); // And where it ends

				if(start !== -1 || end !== -1 || start < end){ // If we are missing one of the boundries, or they are otherwise messed up, bail out.
					var padding = grunt.util.linefeed; // The identation for this group. We always have a linebreak before each tag, so might as well add it now
					var index = start - 1; // The character right before our starting boundry
					
					while(/[^\S\n]/.test(page.charAt(index))){ // Now we work backwords from the start boundry tag, appending the necessary identation.
						padding += page.charAt(index);
						index -= 1;
					}

					// Now it's for real!
					var processed = page.substr(0, start + options.start.length) + // Grab everything before our boundry
						padding + 
						tags.join(padding) + // Add each one of our tags, with respect to the identation we calculated
						padding +
						page.substr(end); // And finally, grab everything after the boundry.

					grunt.file.write(path, processed); // Overwrite the file with what we created.
					grunt.log.writeln('File "' + path + '" processed. Injected ' + tags.length + ' ' + options.start + ' tags.');
				}
			});
		});
	});

};
