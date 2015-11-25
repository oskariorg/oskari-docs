# Pull request best practices


This page is for Oskari contributors. A contributor is anyone who wants contribute code, documentation, or tests to Oskari project.



#### The preferred way of contributing to Oskari in a nutshell:

1. Familiarize yourself with the [license terms](/documentation/development/license)
2. Fork [oskari](https://github.com/nls-oskari/oskari), [oskari-server](https://github.com/nls-oskari/oskari-server) on GitHub 
3. Develop your code in a feature branch 
4. Notify us when the code is ready for QA and integration testing (GitHub pull request, email, anything really) 

[Here](/documentation/development/oskari_git_process) is Oskari git process


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


### To save our work we wish that you use some practices described below:

* If you have developed a new feature. Please document your work in some level. You can see some examples in http://oskari.org/documentation/bundles

* Think little bit fore hand what are you going to contribute and try to keep it small or compact (we don’t wish to have a pull request which has changes to all over Oskari  :)  )

* Use code formatter. If you are developing backend code using eclipce or Idea you might want install a code formatter plugin.



Now!  happy coding. We are waiting your contribution!!!  :)
	



