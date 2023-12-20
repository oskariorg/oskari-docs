## Sprite icons

Note! This documentation has been mostly moved from another page and might be outdated!

---

The minifying process also generates a sprite image for the generic tools icons used in Oskari. This requires an additional software to be installed called [GraphicsMagick](http://www.graphicsmagick.org/). Pretty any version has worked for us. The latest that we've used is `1.3.25`, but earlier versions have worked as well without any modification. See install instructions at the end of the page.

## Troubleshooting

We've installed graphicsmagick with these steps on Redhat/Centos 6:

    # https://gist.github.com/paul91/9008409
    # Install build dependencies
    sudo yum install -y gcc libpng libjpeg libpng-devel libjpeg-devel ghostscript libtiff libtiff-devel freetype freetype-devel
    # Get GraphicsMagick source
    sudo wget http://ftp.icm.edu.pl/pub/unix/graphics/GraphicsMagick/1.3/GraphicsMagick-1.3.25.tar.gz
    tar zxvf GraphicsMagick-1.3.25.tar.gz
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
