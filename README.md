[![Build Status](https://travis-ci.org/mkay581/editable-content.svg?branch=master)](https://travis-ci.org/mkay581/editable-content)
[![npm version](https://badge.fury.io/js/editable-content.svg)](https://www.npmjs.com/package/editable-content)

# Editable Content

A custom element that makes its contents editable by changing itself into an text field, when a user clicks on it.

This library was created due to the current issues with the [`contenteditable` property in the specification](https://html.spec.whatwg.org/multipage/interaction.html#contenteditable).

## Installation

```bash
npm i editable-content
```

## Usage

```html
<script src="node_modules/editable-content/dist/editable-content.js"></script>
<editable-content>Change Me</editable-content>
```

Then, when clicking anywhere on the element, a text field will show allowing the user to change the text.

### Events

You can listen in on when the text field contents have changed.

```javascript
const element = document.querySelector('editable-content');
element.addEventListener('change', e => {
    // text has been changed
    console.log(e.detail.oldValue); // old value
    console.log(e.detail.newValue); // new value after change
});
element.addEventListener('edit', () => {
    // user has pressed enter or focused out of the element after changing the text
    console.log(e.detail.oldValue); // old value
    console.log(e.detail.newValue); // new value after change
});
```

### Styling

An `editing` attribute is applied to the element when the text inside of the element is in focus. So you
can style based on this attribute. The following turns the element's background to `blue` when
it is being edited.

```css
editable-content[editing] {
    background-color: blue;
}
```
