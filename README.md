# Leaflet.AnimatedSearchBox

A simple Leaflet plugin that provides a collapsible search box.

![demo](assets/new_demo_cropped.gif)

Extend it to support up/down keys and scroll

![demo](assets/demo_scroll_arrow.gif)

### [Demos](https://luka1199.github.io/Leaflet.AnimatedSearchBox/examples/)

- [Basic Demo](https://luka1199.github.io/Leaflet.AnimatedSearchBox/examples/example1.html)
- [Fuse.js Demo](https://luka1199.github.io/Leaflet.AnimatedSearchBox/examples/example_fuse.html)

## Usage

- Include the [`Leaflet.AnimatedSearchBox.css`](https://github.com/luka1199/Leaflet.AnimatedSearchBox/releases/latest/download/Leaflet.AnimatedSearchBox.css
) file in the head section of your document:

```html
<link href="src/AnimatedSearchBox.css" rel="stylesheet">
```

- Include the [`Leaflet.AnimatedSearchBox.js`](https://github.com/luka1199/Leaflet.AnimatedSearchBox/releases/latest/download/Leaflet.AnimatedSearchBox.js
) file in your document:

```html
<script src="src/AnimatedSearchBox.js"></script>
```

- Add the [search icon](https://github.com/luka1199/Leaflet.AnimatedSearchBox/releases/latest/download/search_icon.png) image file to `img/search_icon.png`

- Create a new `L.Control.Searchbox` and add it to the map:

```javascript
var searchbox = L.control.searchbox({
    position: 'topright',
    expand: 'left'
}).addTo(map);
```

- with up/down and scroll support:

```javascript
var searchbox = L.control.searchbox({
    position: 'topright',
    expand: 'left',
    scrollbar: true,
    clearButton: true,
    maxHeight: '40vh',
    autocompleteFeatures: ['setValueOnClick', 'arrowKeyNavigation'],
}).addTo(map);
```

### Options

- `position`: Sets the position of the searchbox (Default: `'topright'`).  
- `expand`: Sets the direction in which the search box expands. (Default: `'left'`).  
- `collapsed`: Sets the initial state of the searchbox (Default: `false`).  
- `id`: Sets the id of the container of the searchbox.  
- `class`: Adds custom classes to the container of the searchbox.  
- `width`: Sets the width of the input field of the searchbox. (Example: `'450px'`)  
- `iconPath`: Sets the path for the search icon (Default: `'img/search_icon.png'`).
- `clearIconPath`: Sets the path for the clear icon, when clearButton = true (Default: automatically calculated based on iconPath).
- `listHeight`: sets height of dropdown list (Default: `'auto'`),
- `maxHeight`: sets the maximun height of dropdown list (Default: `'50vh'`),
- `scrollbar`: usefull in conjunction with maxHeigh to present all items in list within view (Default: `'false'`),
- `clearButton`: add a clear button (Default: `'false'`),
- `autocompleteFeatures`: Activates the given features (Default: `['setValueOnClick']`).  
Possible features:
  - `'setValueOnClick'`: Set the value of the searchbox to the value of the clicked autocomplete list item.
  - `'arrowKeyNavigation'`: Sets input value from dropdown list using up and down keys
  - `'setValueOnHover'`: Coming soon
  - `'setValueOnEnter'`: Coming soon

### Methods

```javascript
// Expand the searchbox
searchbox.show()

// Collapse the searchbox
searchbox.hide()

// Toogle the searchbox
searchbox.toggle()

// Returns true if searchbox is collapsed
searchbox.isCollapsed()

// Returns current value of the text field of the searchbox
searchbox.getValue()

// Sets the value of the text field of the search box
searchbox.setValue(value)

// Adds an item to the autocomplete list
searchbox.addItem(item)

// Adds items to the autocomplete list
searchbox.addItems(items)

// Sets items of the autocomplete list
searchbox.setItems(items)

// Clears the autocomplete list
searchbox.clearItems()

// Clears the text field of the search box
searchbox.clearInput()

// Clears the text field and the autocomplete list of the search box
searchbox.clear()

// Adds a listener function (handler) to a particular DOM event (event)
// of the input field of the searchbox
searchbox.onInput(event, handler);

// Removes a previously added listener function (handler) of a particular DOM event (event)
// from the input field of the searchbox
searchbox.offInput(event, handler);

// Adds a listener function (handler) to a particular DOM event (event)
// of the button of the searchbox
searchbox.onButton(event, handler);

// Removes a previously added listener function (handler) of a particular DOM event (event)
// from the button of the searchbox
searchbox.offButton(event, handler);

// Adds a listener function (handler) to a particular DOM event (event)
// of the autocomplete list
searchbox.onAutocomplete(event, handler);

// Removes a previously added listener function (handler) of a particular DOM event (event)
// from the autocomplete list
searchbox.offAutocomplete(event, handler);

```

## Planned features

- Add option to use `<datalist>` for autocomplete.
- Support for npm etc.
