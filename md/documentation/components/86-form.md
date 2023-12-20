# Form & FormInput

## Description

A Form is a passive container for zero or more FormInputs. It can trigger validation of all contained FormInputs and display and clear any errors reported by the FI's.

A FormInput is a smart wrapper for an input, capable of, for example, validating values with regexp, reporting errors and triggering functions on events like keypresses and focus changes.

![Form](/images/documentation/components/form.png)

## Usage

Simple one-field form

```javascript
var form = Oskari.clazz.create('Oskari.userinterface.component.Form'),
    anInput = Oskari.clazz.create('Oskari.userinterface.component.FormInput', 'input'),
    element = jQuery('div.formElement');

anInput.setPlaceholder('Placeholder text');
anInput.setRequired(true, 'Required field');
anInput.setContentCheck(true, 'Input contains illegal characters');
anInput.bindEnterKey(someInputHandler);
form.addField(anInput);

element.append(form.getForm());
```