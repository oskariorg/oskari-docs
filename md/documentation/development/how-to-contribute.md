# How to contribute

The preferred way of contributing to Oskari codebase in a nutshell:

1. Familiarize yourself with the [license terms](/documentation/development/license) and submit a [CLA](https://github.com/oskariorg/oskari-docs/blob/master/documents/CLA.txt) if you have not done that previously
2. Fork the Oskari repository you want to contribute on GitHub into your own account.
3. Develop your code in a feature branch. For the curious, here's a look of the [Oskari Git process](/documentation/development/oskari-git-process).
4. Notify us when the code is ready for QA and integration testing (GitHub pull request)

## Contributor License Agreement

Contributors are asked to provide a Contributor License Agreement for working on the project:

https://github.com/oskariorg/oskari-docs/blob/master/documents/CLA.txt

## Working with Git

Code and documentation contributions are done with pull requests for the appropriate repositories (front, server, support-site). When implementing a feature you should consider if the implementation is generic in a sense that it's usable outside your customized application. If the implementation is generic it should be placed on the core-repositories. Remember you can always ask the community for opinions.

If your implementation requires some external service or API that is not accessible to the public etc or if you think no-one else might not benefit from the code as it's too application-specific it propably shouldn't be in the core-repositories. The options then is use the community-repository if you feel that the code could be made more generic at a later stage (maybe even by another contributor) or the repository for your application if it's just too app-specific.

Code that is not maintained will be migrated from core to the community-repository and code from community-repository can be "promoted" to the core. Mostly it's about someone maintaining the code and it being generic enough.

Check these guidelines for common errors: [Tips and Guidelines](/documentation/development/guidelines)

### Starting

Fork the Oskari repository ([oskari-frontend](https://github.com/oskariorg/oskari-frontend), [oskari-server](https://github.com/oskariorg/oskari-server)) you want to contribute on GitHub into your own account. Clone the Git repository on your development environment and setup the official repository as another remote.

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

* Fix one thing at a time - Do not batch up multiple unrelated changes into a single patch. If you want to fix multiple issues work on them separately and submit separate patches for them.
* Ensure the patch only contains changes relevant to the issue you are trying to fix. A common mistake is to include whitespace and formatting changes along with the relevant changes. These changes, while they may seem harmless, make the patch much harder to read.

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
	git push origin hotfix/my-very-urgent-fix


Master branch always has the latest stable release version.
 Only submit pull requests for master if you would like to urgently fix a bug in the latest stable version.
 The code will be merged into a hotfix-branch, tested, possible combined with other pull requests and the version number is increased.


### Submit a pull request on GitHub

* Visit your GitHub repository page and issue the pull request.
* Core developers will Review the patch and may require changes or improvements to it prior to it being accepted.
* It will be up to the submitter to amend the pull request and keep it alive until it gets merged.
* Please be patient as pull requests are often reviewed in spare time so turn-around can be a little slow.
* Make sure your code works with the latest for the branch you are working on.
* Take a look at the [Review guidelines](review)