# Oskari development

How to get set up your Oskari development environment

### 1. GitHub, the collaboration platform

The Oskari source code is stored in several separate Git repositories hosted under the [oskariorg](https://github.com/oskariorg) organization on GitHub.

The source code projects on GitHub also facilitate collaboration through hosting the project's
external bug / ticket trackers.

Source code contributions to the project should be sent in as GitHub Pull Requests to the relevant
repository's "develop" branch, according to the Git Flow branch policies.

Pull Requests and the merging thereof are amply documented in the GitHub documentation.

You will need to install `git` to actively participate to the development
process.

#### 1.1 Collaboration activities

Register a personal account at GitHub.

Watch:

<iframe width="560" height="315" src="http://www.youtube.com/embed/ijaaL_G6Jgo" frameborder="0" allowfullscreen></iframe>

Fork the oskariorg/oskari and oskariorg/oskari-server repositories, and check out the source code
from your forks to your local computer.

Read Atlassian's [Git Flow documentation](https://www.atlassian.com/git/tutorials/comparing-
workflows/gitflow-workflow).

Create a new feature branch with `git checkout -b feature/[name]` and publish/push it into your own GitHub
repository as a feature branch.

Please make sure to configure your Git tooling so that any new files, or changes to old files, use
only UNIX End-Of-Line markers, and never DOS/Windows End-Of-Line markers.

#### 1.2 Oskari source code

The `github.com/oskariorg/oskari-frontend` repository contains the frontend JavaScript, CSS and HTML source
code. It assumes being served from webserver path /Oskari with a capital O so you can checkout the repository under the name `Oskari` or configure the webserver to do this. The [Jetty bundle](/download) is configured properly for this.

The `github.com/oskariorg/oskari-server` contains the Oskari serverside code.

#### 1.3 Licensing

The Oskari source code is dual licensed with [EUPL](https://github.com/oskariorg/oskari-server/raw/master/LICENSE-EUPL.pdf)
and the [MIT](https://github.com/oskariorg/oskari-server/blob/master/LICENSE-MIT.txt) licenses, which are made available in the source code
repositories.

Not all of the source code files contain a license header.

* * *

### 2. Software development tools

#### 2.1 Java development tools

A large part of the Oskari software development process consists of adding new features to the
backend server, using the Java development environment.

The principal tools necessary for Java development are:

  * Java Development Kit (JDK) 8
  * Maven 3.5.0

You will need to install those tools in the manner relevant to your development platform,
principally Linux, Mac OS X or Windows with Cygwin.

For Java files, the project uses indentation of 4 spaces, and the so-called Sun-Style with the
exception of maximum line length of 120 characters.

#### 2.2 Java development tools, validation

A properly installed Java Development Kit should report version 8, or some update version of it, in
response to the command line command


    java -version

Maven, on the other hand, should report both its own version, as well as the Java version, in
reponse to the command line command


    mvn --version

#### 2.3 JavaScript and HTML development tools

The Oskari frontend consists of JavaScript code, HTML, as well as internationalization and
localisation data files.

The frontend JavaScript and CSS files are stored in the Git version control repository in
structured, and easy to manage hierarchies. These are later compiled into small deployment packages
using Node.js tooling.

Therefore, a developer must install a platform-appropriate Node.js execution and runtime
environment, along with the NPM package manager.

#### 2.4 Databases

The primary Oskari server components store their data on PostgreSQL 9.x+ databases, and perform some
of the spatial analysis of the data on the database layer, using the PostGIS extension.

Some of the backend functionality cache data on a Redis server.

Again, these components should be installed locally, in a platform-appropriate manner. On Linux,
using `apt-get` or `yum`, on Mac OS X using Homebrew, and on Windows, installer EXE or MSIs.

The PostGIS extension must be separately enabled on each database it is invoked on. Please follow
the relevant documentation.

To validate a successful installation of these tools, use either the `psql` command line tool, or a
GUI tool, if you prefer, to connect to the PostgreSQL server.

To validate a successful installation of PostGIS, use your connection to the PostgreSQL database to
execute the PostGIS version query


    SELECT PostGIS_full_version();

Your Redis installation can be checked with the command line command


    redis-cli info

#### 2.5 Application server - Jetty

The Oskari server builds into a WAR file executed inside a servlet runner.

A good servlet runner for development and production is Jetty 8 / 9, but the application can just as
well be run on a properly configured Tomcat instance.

The `oskari-server/webapp-map` Maven project doesn't currently have the `org.eclipse.jetty:jetty-
maven-plugin` configured for running the application in an embedded container, but that should be
trivial to do for an active developer, who doesn't want to keep manually moving WAR files around to
test things.

The default application configuration settings reside in the `oskari.properties` configuration file in the
WAR `classes`-directory. These can be overridden with oskari-ext.properties file in the servers classpath (for example resources folder under {jetty.base}).

The servlet in the WAR will attempt to connect to a pre-existing PostgreSQL database using the
settings specified in the `oskari(-ext).properties` file.

* * *

### 3. Configuring and building the service

#### 3.1 Database creation and configuration

The PostgreSQL tools `createuser` and `createdb` should be used to create a new database user
`oskari` with a password. These settings should also be transferred to your `oskari-ext.properties` or
`tomcat-6.0.29/conf/server.xml` files.

After creating the database and starting the server the application creates the database schema and populates it with example content.

The documentation for the process of
[upgrading](/documentation/backend/upgrading) the database is also worth going
over.

#### 3.2 Building the backend

The development build for the backend is compiled and run using Maven, as described [in the
development documentation](/documentation/backend/setup-development).

* * *

