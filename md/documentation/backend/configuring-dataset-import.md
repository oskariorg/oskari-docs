#Configuring dataset import

This document describes how to set up an advanced dataset import functionality.

##Introduction

GPX and MIF/MID dataset import is implemented with GeoTools OGR plugin. To be able to use it, the GDAL library file is required to be available. For more information about GDAL, see http://www.gdal.org/.

##Linux

The Linux version of GDAL including the needed so library file is probably available from the package repository of your distribution. For example, on RPM-based distributions the following command is likely to perform the required installation:

    yum install gdal

GDAL can also be compiled from the source code, see http://trac.osgeo.org/gdal/wiki/DownloadSource. The Linux version was tested successfully with GDAL 1.9.2 and 1.11.0.

##Windows

The Windows GDAL dll file and dependency dll files can be downloaded e.g. at http://www.gisinternals.com under the Downloads/Stable Releases. Download latest package for your environment e.g. release-1800-x64-gdal-1-11-1-mapserver-6-4-1.zip. Unzip downloaded file. The GDAL dll (e.g. bin/gdal111.dll) file needs to be renamed as gdal.dll or referenced in the environment variable GDAL_LIBRARY_NAME. The directory of the dll files is required in the PATH environment variable. The Windows version was tested successfully with GDAL 1.11.0.

##Reference

For further reference, see the OGR GeoTools plugin guide at http://docs.geotools.org/stable/userguide/library/data/ogr.html. There you can read more detailed instructions about environment variables that you might need to set in other environments.
