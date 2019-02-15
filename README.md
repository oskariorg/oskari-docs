# Oskari support site

[Oskari](http://www.oskari.org/) Map Application Framework aims to provide a framework and a collection of functionality-enhancing bundles and plugins for rapid development of feature-rich GI web applications.

Documentation available at [http://www.oskari.org].

# Reporting issues

All Oskari-related issues should be reported here: https://github.com/oskariorg/oskari-docs/issues

# Contributing

Please read the [contribution guidelines](http://oskari.org/documentation/development/how-to-contribute) before contributing pull requests to the Oskari project.

## Copyright and license

Copyright 2014 - present NLS under dual license MIT (included LICENSE.md) and [EUPL v1.1](https://joinup.ec.europa.eu/software/page/eupl/licence-eupl)
(any language version applies, English version is included in https://github.com/oskariorg/oskari-docs/blob/master/documents/LICENSE-EUPL.pdf).

------------------

## Installation

```
// clone the repository
cd oskari-docs
npm install
node app
```

Additionally, if you want the `.less` and `.js` files to be compiled to and linked from `/public`, run `gulp` in the main directory.

## Structure

Documentation and guides are in `md` directory as `markdown` documents. After creating a new document remember to reference it from either a page in `views/documentation.jade` or `views/guides.jade` (or another appropriate place) or from another document.

When added under `md/documentation` or `md/guides` the page is automatically routed to `/documentation/<file location without the md extension>` or `/guides/<file location without the md extension>`, respectively.

All the other content should be placed in the `.jade` templates under `views/`. Also, please see the `routes.js` for details on how the content gets rendered.

### Updating the RPC-client for example page

1. Update the "oskari-rpc" dependency version in package.json
2. Run `npm update oskari-rpc`
3. Run `npm run build-rpc`

This updates the public/js/rpc/rpc-client.min.js file

### Generating API documentation for Oskari version

1. Clone oskari-frontend git-repository next to oskari.org repository (at the same folder level)
2. Checkout to specific tag/version on the Oskari repository you want to create docs for
2. Run `VERSION=1.45.0 npm run docs`

This generates files under generated/api/[version] folder.

# Generating database documentation

A mini-site documenting the database structure can be generated with a [custom fork of Schemaspy](https://github.com/oskariorg/schemaspy). Java 8 or newer is required. Command `npm run db` generates documentation into directory `generated/db` by connecting to a database instance and reading its structure. By default a database named `oskaridb` on localhost is used, but any Oskari database instance can be used by changing `schemaspy/conf.properties`. The generated db documentation is mapped to route `/db/`.
