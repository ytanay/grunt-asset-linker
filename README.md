# asset-linker (grunt-asset-linker)

> Automatically inject tags of any kind into your markup, and tag distributions while you're at it.

## Getting Started
This plugin requires Grunt `~0.4.x`

When the task is run the destination file(s) is updated with script tags pointing to all the source files. The reason this plugin was built was to automate the process of inserting script tags when building large web apps.

```shell
npm install grunt-asset-linker --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-asset-linker');
```

## Using the "asset-linker" task

### Overview
In your project's Gruntfile, add an `asset-linker` linker block like so:

```js
grunt.initConfig({
  'sails-linker': {
    default: {
      options: {
        start: '<!--SCRIPTS-->', // Asset boundry start
        end: '<!--SCRIPTS END-->', //Asset boundry end
        template: '<script src="%s"></script>',
        root: 'app/'
      },
      files: {
        // Target files, and specify which assets to inject into them.
        'app/index.html': ['app/public/scripts/**/*.js']
      },
    },
  },
})
```

Assuming you have the following files in the app/public/scripts directory:
+ init.js
+ my_awesome_library.js
+ vendor/jquery.min.js

The following file (app/index.html):
```html
<!doctype html>
<html lang="en">
<head>...</head>
<body>
  ...
  <!--SCRIPTS-->
  <!--SCRIPTS END-->
</body>
</html>
```

Would suddenly become
```html
<!doctype html>
<html lang="en">
<head>...</head>
<body> 
  ...
  <!--SCRIPTS-->
  <script src="init.js"></script>
  <script src="my_awesome_library.js"></script>
  <script src="vendor/jquery.min.js"></script>
  <!--SCRIPTS END-->
</body>
</html>
```

(See how the `/app` was stripped out? That's because we specified it as the root above)


### Options

#### options.start
Type: `String`
Default value: `'<!--SCRIPTS-->'`

Asset tags will be placed between this boundry, and `options.end`

#### options.end
Type: `String`
Default value: `'<!--SCRIPTS END-->'`

The lower boundry for the asset groups

#### options.template
Type: `String`
Default value: `'<script src="%s"></script>'`

The template used to insert the links to assets. Notice that the first formatting operator (`%s`) will be replaced with the actual link

#### options.root
Type: `String`
Default value: `''`

The root of the application. Links are relative to this folder.

#### options.relative
Type: `Boolean`
Default value: `false`

Reference files using a relative URI instead of an absolute one.

#### options.verifyExists
Type: `Boolean`
Default value: `true`

Whether or not to verify that the specified files to inject actually exist on the filesystem.

#### options.verifyExists
Type: `Boolean`
Default value: `true`

Whether or not to verify that the specified files to inject actually exist on the filesystem.

