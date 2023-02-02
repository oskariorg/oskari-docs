# Customizing index map icon

The icon is displayed on published maps on the button that toggles the index map.

You can overwrite the images for dark and light themes with CSS (for example on the overwritten.css file when indexmap_icon_dark.png and indexmap_icon_light.png are on the same folder) with:
```
div.mapplugin.indexmap .indexmapToggle[class$=-dark] div.icon {
	background-image: url('indexmap_icon_light.png');
}
div.mapplugin.indexmap .indexmapToggle[class$=-light] div.icon {
	background-image: url('indexmap_icon_dark.png');
}
```

If the image's sides are not even or it is too large, you might also need the following style:
```
background-size: contain;
```
