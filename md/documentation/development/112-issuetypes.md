# Reporting issues and documenting plans for the future

Reporting a bug or unexpected behavior of an Oskari-based application you encounter is as simple as going to https://github.com/oskariorg/oskari-docs/issues and reporting an issue in GitHub. Note that we are also using GitHub issues for roadmap and communicating other development efforts. We are using labels to group the issues by type. If you are developing some new feature for Oskari you want to contribute to the repositories please create an issue for `roadmap`. If you want to make a large change to an existing functionality in Oskari please create an issue mentioning it as `Oskari improvement proposal` (OIP). If you would like to see something changed in Oskari but don't have plans for implementing it you can still create an issue and we will usually label it as `enhancement` or `wishlist`.

You can also ask or discuss about these on any of our [communication channels](/about) before/after creating an issue.

## Bug issues

Reported bugs found in the core Oskari-software (oskari-frontend and oskari-server repositories). You should include any helpful information like Oskari version, browser information, steps to reproduce etc. Describe what you were trying to do and what happened, the environment, data and other related information to make it easier to debug the issue and help solving it.

## Roadmap issues

Tell the community you are developing a new feature for Oskari in a few words. Even a heading might suffice if details are not clear. A roadmap issue requires a responsible party (funding/contributor known). The PSC will vote for inclusion based on the description, but since roadmap issues need to have the will and execution in place it's mostly a documentary approval.

Note that even though the short description is approved without too many questions the actual implementation of the feature might have issues that block it from making the Oskari repository. Tihs might happen if the implementation is too application specific/not generic enough or would break the software in some way. This is why it's a good idea to be an active member communicating your efforts even while implementing it. For more information see the [Contribution](how-to-contribute), [Guidelines](guidelines) and [Review](review) pages.

## Wishlist/enhancement issues

Similar to roadmap items but you don't need to have a responsible party. Mostly just telling the community that Oskari would be better with this feature. Developers can then use these suggestions to enhance Oskari implementing suggested changes and creating pull requests for the implementation.

## OIP-issues

When contributing actual code usually simple pull requests are enough to get the work done. However if you for example want to change how Oskari works at its core you should create an Oskari improvement proposal. The issue should describe the proposed changes very clearly (even on code level), what impact it will have and what are the reasons for the change. The PSC will vote on any OIPs.
