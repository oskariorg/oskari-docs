# Oskari Git process

This document describes the source management process used by the Oskari project. As internal development at [NLS](http://www.maanmittauslaitos.fi/en) uses a [​rather](http://nvie.com/posts/a-successful-git-branching-model/) [​well](http://jeffkreeftmeijer.com/2010/why-arent-you-using-git-flow/) [​documented](http://yakiloo.com/getting-started-git-flow/) [​branching](http://buildamodule.com/video/change-management-and-version-control-deploying-releases-features-and-fixes-with-git-how-to-use-a-scalable-git-branching-model-called-gitflow) [​model](http://vimeo.com/16018419) called ​[Git Flow](https://github.com/nvie/gitflow), this document emphasizes interfacing with external developers/teams instead of reiterating ​[Git Flow documentation](http://bit.ly/OUNRqg) readily available on the Web.

## Overview

![Oskari git flow overview](/images/documentation/gitflow.svg)

Read Atlassian's awesome [Git Flow documentation](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow) for more information.

## Branches & Repos

### master

* The latest stable release.
* Tagged according to Oskari's versioning scheme.
* Commits merged from hotfix and release branches.

### develop

* The work-in-progress next release.
* Commits merged from pull requests.

### feature/my-awesome-feature

* Development for a new feature
* These should be used in forks, not the official repositories
* Once the feature is completed the branch will be merged into develop
* See [how to contribute](how-to-contribute) for Git instructions

### release/x.y.z

* A release branch is opened as a code freeze some time before the next release based on the current develop-branch.
* Release branch should only include bugfixes to the features that will be in the next release.
* Any new features should be merged to develop-branch for a release after the next one.
* Once the release testing has been completed the branch will be merged into develop and master.

### hotfix/x.y.z

* When urgent bugfixes are required for the latest release a hotfix-branch is opened based on the current master-branch
* Once the fixes are completed the branch will be merged into develop and master

#### External branches

The branching model utilized by an external team is generally irrelevant to the process of handling external contributions. It is, however, assumed for the purposes of this document that there exists a continuous sequence of commits from the latest merge from Oskari branches on GitHub to the commit(s) presented for consideration for inclusion in Oskari proper. This is required in order to be able to rebase such commits on the **develop** branch.

Code acquired from external sources will be subject to adaptation (if deemed necessary), normal *feature testing* and bugfixes before it can be merged into the **develop** branch.

## Creating releases

For creating a branch for version x.y.z

    git checkout develop
    git pull
    git checkout -b release/x.y.z
    # TODO: Bump version at this point on the *release* branch (see below for instructions)

    # Get the version commit to develop
    git checkout develop
    git merge --no-ff release/x.y.z
    # TODO: Bump next development version on the *develop* branch (see below for instructions)
    # Checkout to the release branch
    git checkout release/x.y.z

Merging pull requests to release

    git pull https://github.com/zakarfin/oskari-frontend.git some-bugfix
    # git cherry-pick from develop etc
    git push origin release/x.y.z

Merging changes back to master

    git pull
    git checkout master
    git pull
    git merge --no-ff release/x.y.z
    git tag -a x.y.z -m "Release x.y.z"
    git push origin master
    git push origin --tags

Merging changes back to develop

    git checkout develop
    git pull
    git merge --no-ff release/x.y.z
    # possible merging of conflicts
    git push origin develop

Cleanup

    # remove local branch
    git branch -D release/x.y.z
    # remove remote branch
    git push origin :release/x.y.z

## Versioning the code

* Releases should move the minor version 1.50.0 -> 1.51.0
* Hotfixes should move the patch version so 1.50.0 -> 1.50.1

### Server

    # Checkout to branch that should have the version updated
    git checkout {branch}

    # Run the maven versions plugin to update version
    mvn -N versions:set -DnewVersion=x.y.z

    # Commit the changes to Git
    git add .
    git commit -m 'Bump version'
    git push

Develop branch version should always be the next version + "-SNAPSHOT". For an example if the version in master is "1.50.0", develop should be "1.51.0-SNAPSHOT".

### Frontend

    # checkout to branch that should have the version updated
    git checkout {branch}

    # Edit the version number on package.json
    nano package.json

    # Commit the changes to Git
    git add .
    git commit -m 'Bump version'
    git push

## Creating hotfixes

Much like creating releases except hotfixes are based on the master version (releases are based on develop).

For creating a branch for version x.y.z

    git checkout master
    git pull
    git checkout -b hotfix/x.y.z

Merging pull requests to hotfix

    # TODO: Bump version at this point (see below for instructions)
    git pull https://github.com/zakarfin/oskari-frontend.git hotfix/my-urgent-fix
    # git cherry-pick from develop etc
    git push origin hotfix/x.y.z

Merging changes back to master

    git pull
    git checkout master
    git pull
    git merge --no-ff hotfix/x.y.z
    git tag -a x.y.z -m "Hotfix x.y.z"
    git push origin master
    git push origin --tags


Merging changes back to develop

    git checkout develop
    git pull
    git merge --no-ff hotfix/x.y.z
    # possible merging of conflicts
    git push origin develop

Cleanup

    # remove local branch
    git branch -D hotfix/x.y.z
    # remove remote branch
    git push origin :hotfix/x.y.z
