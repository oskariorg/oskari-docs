# Frontend-tools

There are some helpful tools under Oskari/tools folder under the oskari-frontend reposityry. To use them you need to:

1) install nodejs version 5+ (tested on 5.x and 6.x)

2) run `npm install` under Oskari/tools folder.

This will generate node_modules folder under Oskari/tools which can be removed and recreated by running npm install again. You will only need to do this once (or any time the tools are upgraded). There are some additional requirements based on the tools that you want to use:

## Minify code

The minifying process also generates a sprite image for the generic tools icons used in Oskari. This requires an additional software to be installed called [GraphicsMagick](http://www.graphicsmagick.org/). Pretty any version has worked for us. The latest that we've used is `1.3.25`, but earlier versions have worked as well without any modification. See install instructions at the end of the page.

# Minifying JavaScript code for production

Minifying the code means that all the files that are needed to build the app are put in a single file and all the "human-friendly" names are changed to be more compact. This will reduce the startup time for the end-user dramatically. With the default download and sample application you can run `npm run build` to generate the minified Javascript files. This will result in `Oskari/dist/servlet` folder being generated.

This works by reading a minifierAppSetup.json file that should match the appsetup (bundle-collection) used on the website including any dynamic (role-based) bundles that are added on the fly. So basically all the bundles you want to use. Here's an example for the basic [geoportal appsetup](https://github.com/nls-oskari/oskari/blob/master/applications/sample/servlet/minifierAppSetup.json) and for an [embedded map](https://github.com/nls-oskari/oskari/blob/master/applications/sample/servlet_published_ol3/minifierAppSetup.json). These are used when running just `npm run build`. If you take a look at the package.json [script-definitions for builds](https://github.com/nls-oskari/oskari/blob/master/tools/package.json) you can see that you can also specify the version and the minifierAppSetups to use for your needs by running a modified command from what are used as the script shortcuts.

The easiest modification with most benefit is changing the minifierAppSetup.json files to only include the bundles that you are using. This reduces the amount of code the end-user needs to load. You can also safely rename the "version" folder from `dist/servlet` to `dist/1.0` or similar. Note that you will need to tell the server what client version to serve. This is done by modifying the `oskari-ext.properties` file:

    # this will toggle minified code on (false) and off (true)
    development=false
    # this will link the correct version of the frontend for the user (if you renamed 'servlet' to '1.0' use 'dist/1.0')
    oskari.client.version=dist/servlet

If the code changes you can do `npm run build` again to create new minified result. You will need to do this when updating the new version or after changing any custom code/bundles you want to use.

### Internal workings of Gruntfile (for the curious)

The `tools` directory in `Oskari` contains `Gruntfile.js` which has a grunt task `release` for minifying source code for production. It's in use in production releases of [Paikkatietoikkuna](http://www.paikkatietoikkuna.fi/), [demo.oskari.org](http://demo.oskari.org) among others. It also validates the code, processes SCSS-files to CSS-files and packs the icon images into one file (png sprite).

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

Feel free to skip (comment out or delete the lines) the unnecessary steps so the task only does what you feel is sufficient.

## Troubleshooting

Graphicsmagick has to be installed for minification task. If not, you will probably get the following error:

    Generating CSS Sprite...
    Fatal error: spawn ENOENT

We've installed graphicsmagick with these steps on Redhat/Centos 6:

    # https://gist.github.com/paul91/9008409
    # Install build dependencies
    sudo yum install -y gcc libpng libjpeg libpng-devel libjpeg-devel ghostscript libtiff libtiff-devel freetype freetype-devel
    # Get GraphicsMagick source
    sudo wget http://ftp.icm.edu.pl/pub/unix/graphics/GraphicsMagick/1.3/GraphicsMagick-1.3.25.tar.gz
    tar zxvf GraphicsMagick-1.3.25.tar.gz
    # for png support check that these are installed
    sudo yum install libpng
    sudo yum install libpng-devel
    # Configure and compile
    cd GraphicsMagick-1.3.25
    sudo ./configure --enable-shared
    sudo make
    sudo make install

This will result in `gm` command to be available in `/usr/local/bin`. You need to make sure the user doing frontend minifications has this on path. We have added it by doing a startup-script:

    sudo nano /etc/profile.d/oskari.sh

With content:

    # GraphicsMagick installs in /usr/local/bin
    PATH=${PATH}:/usr/local/bin

## Known issues

### Styles don't work properly after minification

When using calc-function in SCSS-file the SASS-processing in Grunt removes spaces and

    height:calc(100% - 108px);

becomes

    height:calc(100%-108px);

Which breaks the functionality in the browser. To fix this you can use this in SCSS-file:

    height:  unquote("calc(100% - 108px)");

