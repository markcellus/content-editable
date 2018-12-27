[![Build Status](https://travis-ci.org/mkay581/editable-content.svg?branch=master)](https://travis-ci.org/mkay581/editable-content)
[![npm version](https://badge.fury.io/js/editable-content.svg)](https://www.npmjs.com/package/editable-content)

# Editable Content

A custom element that makes its contents editable by changing itself into an text field, when a user clicks on it.

This library was created to support features missing in [the `contenteditable` property specification](https://html.spec.whatwg.org/multipage/interaction.html#contenteditable) and to alleviate its [inconsistent browser implementations](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Editable_content#Differences_in_markup_generation).

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
element.addEventListener('edit', (e) => {
    const {textContent, previousTextContent} = e.detail;
    element.textContent = textContent; // update the element to new value
    console.log(previousTextContent); // old value
});
```

| Event  | Type          | Description                                                                                                                                                                                                                                                  |
| ------ | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `edit` | `CustomEvent` | Fired with a custom event when the text value has been successfully changed to a new value. The event `detail` will include both a `textContent` field that contains the updated value and a `previousTextContent` field that contains the last-known value. |

Of course, all of the other [events supported by any HTMLElement](https://html.spec.whatwg.org/multipage/webappapis.html#globaleventhandlers) are still available.

### Styling

An `editing` attribute is applied to the element when the text inside of the element is in focus. So you
can style based on this attribute. The following turns the element's background to `blue` when
it is being edited.

```css
editable-content[editing] {
    background-color: blue;
}
```

### Attributes

| Attribute   | Type      | Default | Description                                                                                                                    |
| ----------- | --------- | ------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `readonly`  | `Boolean` | `false` | Whether the text should be editable or not.                                                                                    |
| `multiline` | `Boolean` | `false` | Whether pressing enter should create a newline. If this is set to `true`, pressing enter will update the value to the new one. |


### Formatting

If you would like for line breaks or any other formatting to be respected, just apply `white-space` css property.

```css
editable-content {
    white-space: pre;
}
