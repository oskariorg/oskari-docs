# Review

Reviewing code is an invaluable process that is used to ensure that code meets an acceptable level of quality prior to being included in an Oskari release.

Many of the following has been adopted from the [GeoServer](http://docs.geoserver.org/latest/en/developer/policies/review.html) project as the rules they have are very pragmatic.

## Informal Code review

For Oskari developers there is no hard policy relating to code review such that every line of code needs to be reviewed, over time we have adopted the following practice:

* if the change is to a core module and the developer does not have core commit access it requires a pull request and formal review
* if the change is non-trivial and to a core module, it should be be handed as a pull-request
* if the change is local to a module the developer maintains it usually does not require a review
* community modules are a playground for experimentation - collaborate with the module maintainer as appropriate

In general a code review is always welcome and if there is a question as to whether a change should be reviewed or not, always err on the side of getting it reviewed.

## Pull Request Review Guide

This guide provides guidance to help pull requests be reviewed in a consistent fashion (and help ensure we do not forget anything).

Before you start:

* Double check the [Guidelines](/documentation/development/guidelines) policy capturing requirements for submitted code.
* Be clear when reviewing between directives (iso speak MUST,FIX,SHALL) and suggestions or ideas for improvements (iso speak SHOULD, MAY, IDEA).
* As a reviewer we must balance between not having enough time for thorough review, and the desire to provide quick feedback.

## Initial Checks

The following checks can be performed quickly and represent common mistakes or oversites. These quick checks can be performed by anyone as an initial inspection.

<div class="panel panel-info"><div class="panel-heading">**Note:** Providing an initial check, while better than no follow up at all, may seem petty and discouraging to the contributor. It is a good idea to state that this is only quick feedback - while either more time or an appropriate expert is found.</div></div>

* _Contribution agreement on file._ Check if the contribution requires a contribution agreement, and if it matches the requisites, verify that a contribution agreement has been provided to Oskari, if not, demand for one.
* _Presence of tests._ Given a large code base, that pretty much nobody really can hope to master fully, the large number of external contributors, as well as focused changes to the code base, and the fast evolution of the code base, tests are really the only line of defense against accidental breakage of the contributed functionality. That is why we always demand to have at least one test, it’s not a “punishment”, but a basic guarantee that the fix or new functionality being contributed will still be there, and working, a bare few months later. So always check there is at least one test, one that would break in a evident way if there ever was a regression in the contributed code.
* _Presence of documentation._ For functional, user or protocol facing changes, check that some basic documentation has been contributed. Almost nobody will know functionality is there if we don’t have documentation on how it works. As a plus, documentation will help you understand quicker what is getting contributed, both from a high level view, and as a guide though the changes being made.
* _Presence of a proposal, if required._ For any large change our process demands a formal proposal to be made and discussed in the community before a pull request gets made. If the pull request is made anyways, point them to the process and warn that the community might eventually request changes in the approach
* _No commented out code sections._ The version control is able to tell differences between existing and past versions of a certain file, thus, the commit should not contain commented out code sections.
* _Javadocs and comments._ Public classes and methods should have a minimum of javadoc (a simple sentence explaning what the method or class does will be sufficient), difficult parts of the code should have some comments explaining what the code does (how it does it, is evident by the code). Comments should be professional (no personal opinions or jokes), current to the code (no need to explain what was there before, unless there is a high risk of it coming back), with no reference to the comment author (in case we need to know that information, a git blame will do)
* _Code formatting._ The project uses the standard code formatting from IntelliJ IDEA. It’s basically the official Java coding conventions (spaces instead of tabs) with “long” lines.
* _Reformats and other changes obfuscating the actual patch._ We recommend contributors to limit changes to a minimum and avoid reformatting the code, even if the existing code is not following the existing coding conventions. Reformats can be put in separate commits if necessary.

## Extensive Review

The key point of a review is to make sure that Oskari remains stable (does not regress in behaviour) and that the codebase remains flexible and maintainable into the future.

<div class="panel panel-info"><div class="panel-heading">**Note:** This review often requires some experience with the code being modified, and will require more time and focus than the initial check described in the previous section.</div></div>

* _Backwards compatibility._ The change being proposed should not hamper backwards compatibility, any changes to the especially to the frontend API needs to be documented in the Changelog and any major server changes need to be mentioned in the MigrationGuide.
* _Performance._ The change should not introduce evident performance regressions. This is not to say that every pull request must be load tested, but some attention should be paid during the review to changes that might be damaging in those respects, looking for CPU hungry code or heavy memory allocation.
* _Leaks._ A java server side application like Oskari should be able to run for months uninterrupted, thus particular attention should be paid to resource control, in particular resources that ought to to closed (files, connections, pools in general), significant allocation of classes with finalizers.
* _Thread safety._ Oskari-server is, like all Java server side application, serving one request per thread. In this respect thread safety is of paramount importance. Be on the lookout for lazy initialization, stateful classes shared among threads, thread locals that fail to be properly cleaned at the end of the request, and static fields and data structures in general.
* _Good usage and fit with the existing code and architecture._ The code is easier to understand and maintain when it follows common pattern across the code base, and when there is little or no code duplication. Check the pull request for conformance with the existing code, and proper usage of existing facilities.
* _Proper module usage._ There is often a strong temptation to put new functionality in core as opposed to a new community module. If this is the case, verify the functionality is indeed core worthy, that is, relevant for many users, properly documented, has core developers interested in maintaining it long term, and heavily tested.
* _IP checks._ When there is evidence that some of the code is coming from a different code base, check the contributor actually has the rights to donate it to Oskari, and that the original licence is compatible (or that the author owns the code, and can thus relicense it under the MIT/EUPL terms).
* _Current Java version and library usage._ Check the new code uses the current version of Java (e.g. foreach, try with resources, generics, lambdas), and current library facilities (JUnit, Spring) instead of using outdated structures, rolling its own replacements or adding new dependencies. Attention should be paid to patterns that while elegant, might incur in significant overhead in performance sensitive areas of the code (e.g., arrays vs collection, inheritance and overridden methods, and other forms of abstraction above the “bare metal”).
* _Malicious code._ While unlikely, a pull request might contain malicious code to create, by design or accident, openings in the security of Oskari that an external attacker might use. Attention should be paid to input checks, XML expansion attacks, reflection through serialization (which can be used to generate a remote execution attack).

# Core commit access/reviewer status

The second allows a developer to make commits to the core modules of Oskari. Being granted this stage of access takes time, and is obtained only after the developer has gained the trust of the other core committers.

The process of obtaining core commit access is far less mechanical than the one to obtain community commit access. It is based solely on trust. To obtain core commit access a developer must first obtain the trust of the other core committers.

The way this is typically done is through continuous code review of patches. After a developer has submitted enough patches that have been met with a positive response, and those patches require little modifications, the developer will be nominated for core commit access.

There is no magic number of patches that make the criteria, it is based mostly on the nature of the patches, how in depth the they are, etc... Basically it boils down to the developer being able to show that they understand the code base well enough to not seriously break anything.

The reviewer status is tracked with GitHub teams:

- Frontend: https://github.com/orgs/oskariorg/teams/frontend-review
- Server: https://github.com/orgs/oskariorg/teams/server-review