# How to contribute

The preferred way of contributing to Oskari codebase in a nutshell:

1. Familiarize yourself with the [license terms](/documentation/development/license) and submit a [CLA](https://github.com/oskariorg/oskari-docs/blob/master/documents/CLA.txt) if you have not done that previously
2. Fork the Oskari repository you want to contribute on GitHub into your own account.
3. Develop your code in a feature branch. For the curious, here's a look of the [internal git process used by NLS](/documentation/development/oskari-git-process) for Oskari development.
4. Notify us when the code is ready for QA and integration testing (GitHub pull request)

## Contributor License Agreement

Contributors are asked to provide a Contributor License Agreement for working on the project:

https://github.com/oskariorg/oskari-docs/blob/master/documents/CLA.txt

## Working with Git

### Starting

Fork the Oskari repository (([oskari-frontend](https://github.com/oskariorg/oskari-frontend), [oskari-server](https://github.com/oskariorg/oskari-server))) you want to contribute on GitHub into your own account. Clone the Git repository on your development environment and setup the official repository as another remote.

	git clone https://github.com/{your username}/{oskari repository}.git
	cd {oskari repository}
	git remote add oskari https://github.com/oskariorg/{oskari repository}.git


#### OR

Update your fork with the latest Oskari/continue contributing on previously initialized repository

	git checkout master
	git pull oskari master
	git push
	git checkout develop
	git pull oskari develop
	git push

### Developing

Starting development for a new feature on a new branch based on develop

	git checkout develop
	git checkout -b feature/my-awesome-feature
	# code away (see coding guidelines) with git adds/commits
	# remember lots of small commits are better than one big one
	# also describing commit messages are better than repeating the same msg n times
	git push origin feature/my-awesome-feature

Developing new functionality and fixing non-urgent issues should be based on the latest develop.
 These will be merged into master branch on the next release.

#### OR

Fix an issue of urgency on a new branch based on master

	git checkout master
	git checkout -b hotfix/my-very-urgent-fix
	# code away (see coding guidelines) with git adds/commits
	# remember lots of small commits are better than one big one
	# also describing commit messages are better than repeating the same msg n times
	git push origin hotfix/my-awesome-feature


Master branch always has the latest stable release version.
 Only submit pull requests for master if you would like to urgently fix a bug in the latest stable version.
 The code will be merged into a hotfix-branch, tested, possible combined with other pull requests and the version number is increased.


### Submit a pull request on GitHub

Before doing that, check these guidelines for common errors in code: [Tips and Guidelines](/documentation/development/guidelines)