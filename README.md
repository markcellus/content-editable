[![Build Status](https://travis-ci.org/mkay581/inline-edit-js.svg?branch=master)](https://travis-ci.org/mkay581/inline-edit-js)
[![npm version](https://badge.fury.io/js/inline-edit-js.svg)](https://badge.fury.io/js/inline-edit-js)
[![Bower version](https://badge.fury.io/bo/inline-edit-js.svg)](https://badge.fury.io/bo/inline-edit-js)

# Inline Edit JS

Easily convert HTML elements to editable text fields. It uses latest ECMAScript (ES) syntax and transpiled by Babel to
allow use in all modern browsers and on mobile devices.

## Usage

To use this package, just import it and pass an element when instantiating.

```html
<div id="my-text"></div>
```

```javascript
let el = document.getElementById('my-text');
let editable = new InlineEdit(el);
```

Then, when clicking anywhere on the element, a text field will show allowing the user to change the text.

### Listening for change event

You can also listen in on when the text field contents have changed.

```javascript
let el = document.getElementById('my-text');
let editable = new InlineEdit(el, {
    onChange: (newValue) => {
       // the value has changed
    }
});
```

