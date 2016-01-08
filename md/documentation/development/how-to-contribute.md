# How to contribute

The preferred way of contributing to Oskari in a nutshell:

1. Familiarize yourself with the [license terms](/documentation/development/license)
2. Fork [oskari](https://github.com/nls-oskari/oskari), [oskari-server](https://github.com/nls-oskari/oskari-server) or [oskari-liferay](https://github.com/nls-oskari/oskari-liferay) on GitHub 
3. Develop your code in a feature branch. For the curious, here's a look of the [internal git process used by NLS](/documentation/development/oskari-git-process) for Oskari development.
4. Notify us when the code is ready for QA and integration testing (GitHub pull request, email, anything really) 
 
**Note! There's a difference for developing generic Oskari functionality and application specific functionality**

You should base your work on a released version (master branch) when creating applications, but any generic Oskari functionality should be based on the latest develop.

## Tips & tricks/guidelines

### Code
- Use english and descriptive names for variables/methods etc
- Format your code and use spaces instead of tabs
- Don't make long or overly complex methods - keep it simple
- Try to create generic functionalities that can be used by others. The application specific UI can be separated in most cases from the generic functionality.
- Try to keep functions self-contained with clear input and output and no side-effects when possible.
- Use existing features like PropertyUtil for oskari-server or the localization support from Oskari in the frontend instead of reinventing the wheel.
- Try to use existing libraries when creating new features. For each new framework added to the client side code the more end-users need to download to get the application.
- If you have developed a new feature please document your work: [Examples](/documentation/bundles).

### Commits
- Never commit on master - always work with the latest develop version
- Keep commits small and use descriptive comments
- This means you don't dump your entire feature from svn into single massive git commit.

### Pull requests
- Keep pull requests small/having a single feature
- Describe the pull request like you would describe the changes to a person who is not in the context of the problem.
- See https://github.com/blog/1943-how-to-write-the-perfect-pull-request
- Be very careful when making changes to existing sources (maven modules or frontend bundles) since it's easy to break an unexpected part of an app this way.
- Create separate pull request for changes to existing source with documentation what the change enables you to do.
- Entirely new features/functionalities should be created as new maven modules on oskari-server and bundles on frontend. Oskari-server uses layered naming for modules:
    - service-[functionality] as a library for the generic functionality
    - service-[functionality]-[plugin name] as a plugin part to enhance service-[functionality] with non-generic functionality
    - control-[functionality] as a wrapper for action routes/http-layer where you parse params and format a JSON response for the result of the operation.

## Be very careful when changing the API

For frontend this means request/event/conf/state/services
- Try to think of your new addition as a library especially the API. Keep it clean, simple and as self-contained as possible.
- Oskari requests should have mandatory parameters as the first parameters and any optional parameters should be gathered in to an options object with describing names. Any data in conf, state, requests or events should be serializable to JSON -> Don't send functions etc. If you need to send functions, use services instead.
For server: action_route params/response

**Any changes to API need to be documented always!**

[More guidelines](/documentation/development/guidelines)