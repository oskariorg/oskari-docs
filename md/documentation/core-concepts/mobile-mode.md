# Mobile mode

Oskari supports mobile mode, which means that certain functionalities adapt to changes in map size. Mobile mode is made primarily for embedded maps (by making map plugins react to size/device), but it also works in main map view.

Functionalities in Oskari can use the global helper `Oskari.util.isMobile()` to detect how they should render themselves. The function also takes a boolean parameter where `Oskari.util.isMobile(true)´ returns if the user device looks like a mobile device. Without the parameter the window size is also considered so mobile mode can be triggered when the browser window size is small even on desktop computers.

Functionalities can react to size changes at runtime by listening an Oskari event called `MapSizeChangedEvent`.
