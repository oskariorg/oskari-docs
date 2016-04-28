# Minifying JavaScript code for production

***NOTE!*** *this document is likely to change as the minification task gets refined to be more generally applicable.*

The `tools` directory in `Oskari` contains `Gruntfile.js` which has a grunt task `release` for minifying source code for production. It's in use in production releases of [Paikkatietoikkuna](http://www.paikkatietoikkuna.fi/) so currently it also validates the code, packs the icon images into one file, creates the API documentation and packages the archives found [here](/download):

    // validates the code (optional)
    grunt.task.run('validate');
    // copies the bundles etc. to the dist directory
    grunt.task.run('copy');
    // concatenates and minifies the JavaScript files
    grunt.task.run('compile');
    // compiles and minifies the stylesheets files
    grunt.task.run('compileAppCSS');
    // creates icons.png (optional)
    // assumes individual icon images to be found under your-application/icons
    // icons/icons.png and css/icons.css can afterwards be copied for instance from
    // Oskari/applications/paikkatietoikkuna.fi/full-map
    grunt.task.run('sprite');
    // creates the API docs (optional)
    grunt.task.run('oskaridoc');
    // packages the archives (optional)
    if (grunt.config.get('compress.options.fullMap')) grunt.task.run('compress');

Feel free to skip (comment out or delete the lines) the unnecessary steps so the task only does what you feel is sufficient.

## Usage

Make sure all the bundles you need are in the application setup file. You can look [here](https://github.com/nls-oskari/oskari/blob/master/applications/paikkatietoikkuna.fi/full-map/minifierAppSetup.json) for an example.

Assumes `grunt-cli` is set in the path:

    cd Oskari/tools
    grunt release:<version>:<path/to/minifier/application/setup.json>

As a result, a new directory `dist` is created where the task generates the minified code for the application under `<version>` directory.

## Troubleshooting

Graphicsmagick has to be installed for minification task. If not, you will probably get the following error:

    Generating CSS Sprite...
    Fatal error: spawn ENOENT