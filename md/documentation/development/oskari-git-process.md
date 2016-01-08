# Oskari Git process

This document describes the source management process used by the Oskari project. As internal development at [NLS](http://www.maanmittauslaitos.fi/en) uses a [​rather](http://nvie.com/posts/a-successful-git-branching-model/) [​well](http://jeffkreeftmeijer.com/2010/why-arent-you-using-git-flow/) [​documented](http://yakiloo.com/getting-started-git-flow/) [​branching](http://buildamodule.com/video/change-management-and-version-control-deploying-releases-features-and-fixes-with-git-how-to-use-a-scalable-git-branching-model-called-gitflow) [​model](http://vimeo.com/16018419) called ​[Git Flow](https://github.com/nvie/gitflow), this document emphasizes interfacing with external developers/teams instead of reiterating ​[Git Flow documentation](http://bit.ly/OUNRqg) readily available on the Web.

### Overview

![Oskari git overview](/images/documentation/git_overview.png)

### Branches & Repos

#### NLS internal branches

* **master**
    * branch head is the latest release
    * no development work
    * commits are merged from **release** (and possibly **hotfix**) branches
    * tagged according to a calendar-based scheme

* **develop**
    * head is the work-in-progress next release
    * no direct development work
    * commits merged from **feature** branches

* **feature**
    * normal development happens here
    * usually one branch per task/feature/bug
    * generally local development, rarely pushed to a remote unless a collaborative effort is required
    * feature testing is done here, before merging (rebasing) back to **develop**

* **release**
    * testing, bugfixing and quality assurance
    * release testing is done here, before merging to **master** *and* **develop**

* **import**
    * adaptation and quality assurance of features/bugfixes implemented by external developers
    * essentially **feature** branches seeded by external commits

* **hotfix** (omitted from diagram)
    * fixes for blocker issues discovered after merging a **release** branch to **master**
    * branched from **master**, merged to **master** and **develop**
    * a symptom of insufficient release *testing*

#### Branches on Github

* **master**
    * the latest public release
    * a subset (file-wise) of the internal **master**
    * commits merged from **develop** on Github
    * tagged according to Oskari's versioning scheme

* **develop**
    * the next public release
    * work in progress
    * a subset (file-wise) of the internal **develop** branch
    * commits merged (daily) from internal **develop**

#### External branches

The branching model utilized by an external team is generally irrelevant to the process of handling external contributions. It is, however, assumed for the purposes of this document that there exists a continuous sequence of commits from the latest merge from Oskari branches on Github to the commit(s) presented for consideration for inclusion in Oskari proper. This is required in order to be able to rebase such commits on the internal **develop** branch.

Code acquired from external sources will be subject to adaptation (if deemed necessary), normal *feature testing* and bugfixes before it can be merged into the internal **develop** branch.