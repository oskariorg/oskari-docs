# Configuration options for vector feature layers

Vector features can come from WFS or OGC API Features endpoint and displaying them can be customized with a config on the [database table](https://oskari.org/db/tables/oskari_maplayer.html) `oskari_maplayer`.

For example localized names can be given for feature properties with a JSON-configuration on the `attributes` column.

For example consider a GeoJSON presentation of a vector feature like this:

```
{
    geometry: {...},
    properties: {
        NAME: 'Place name',
        LINK: 'https://my.place/241',
        IMG: 'https://my.place/241.png'
        RENT: '100€/day',
        DESCRIPTION: 'This is a nice place'
    }
}
```
You could configure `oskari_maplayer.attributes` with:
```json
{
  "data": {
    "filter": [
      "NAME",
      "IMG",
      "DESCRIPTION",
      "RENT"
      "LINK"
    ],
    "locale": {
      "en": {
        "RENT": "Rental price",
        "LINK": "More information"
      },
      "fi": {
        "RENT": "Vuokrahinta",
        "LINK": "Lisätietoja"
      }
    },
    "format": {
      "NAME": {
        "type": "h2",
        "noLabel": true
      },
      "DESCRIPTION": {
        "type": "p",
        "noLabel": true
      },
      "IMG": {
        "type": "image",
        "noLabel": true,
        "params": {
            "link": true
        }
      },
      "LINK": {
        "type": "link"
      }
    }
  },
  "maxFeatures": 1000,
  "namespaceURL": "http://www.oskari.org"
}
```

Where:
- `data` see below for details *optional*
- `maxFeatures` limit for features that is requested from service (defaults to ?) *optional*
- `namespaceURL` The feature namespace URI (needs more details where this is used) *optional*

## Data

- `filter` configures what properties are shown and in what order (refers to actual property names of the feature)
- `locale` is an object with keys based on language codes. The language objects are used to map a user-friendly name for the actual properties name.
- `format` has keys based on the property names with objects that can define `type` to decide how to show/format the property value. It can also include `noLabel` property if you don't want to show the property label to the user and only show the value of the property.

### Filter

You can also configure the filter with language specific handling:
```json
{
  "data": {
    "filter": {
        "default": [
            "name",
            "link",
            "image_url"
        ],
        "fi": [
            "name_fi",
            "link",
            "image_url"
        ],
        "en": [
            "name_en",
            "link",
            "image_url"
        ]
    },
    ...
  }
}
```

### Format

Recognized types include:
- `link` renders an a-tag using the value as href-attribute
- `image` renders an img-tags using the value for src-attribute. The image can also be wrapped to a link-tag so it can be opened in another tab using the params option seen above.
- html-tags like h1-h5, p, i, b, em

An application based on Oskari can also add handling for additional types in their code base with [ValueFormatters](https://github.com/oskariorg/oskari-frontend/blob/2.5.1/bundles/mapping/mapmodule/plugin/getinfo/ValueFormatters.js): 
```
import { setFormatter } from './path/to/ValueFormatters';
setFormatter('title', (value) => `<h1>${value}</h1>`);
```
The above would add a formatter for type `title` that wraps the value to an h1-tag.
