(function (factory, window) {

    // define an AMD module that relies on 'leaflet'
    if (typeof define === 'function' && define.amd) {
        define(['leaflet'], factory);

        // define a Common JS module that relies on 'leaflet'
    } else if (typeof exports === 'object') {
        module.exports = factory(require('leaflet'));
    }

    // attach your plugin to the global 'L' variable
    if (typeof window !== 'undefined' && window.L) {
        window.L.YourPlugin = factory(L);
    }
}(function (L) {
    L.Control.Searchbox = L.Control.extend({
        options: {
            class: '',
            id: '',
            position: 'topright',
            expand: 'left',
            collapsed: true,
            width: null,
            iconPath: 'img/search_icon.png',            
            autocompleteFeatures: ['setValueOnClick'],
            listHeight: 'auto',
            maxHeight: '50vh',
            scrollbar: false,
            clearButton: false,

        },

        onAdd: function (map) {
            this._create();

            this._collapsed = this.options.collapsed;
            if (this.options.collapsed) {
                this.hide();
            }

            L.DomEvent.disableClickPropagation(this._container);

            L.DomEvent.on(this._input, 'click', this._onInputClick, this);
            L.DomEvent.on(this._input, 'keydown', this._onInputKeyDown, this);
            L.DomEvent.on(this._input, 'keyup', this._onInputKeyUp, this);
            L.DomEvent.on(this._button, 'click', this._onClick, this);
            if (this.options.clearButton) {
                L.DomEvent.on(this._clearbutton, 'click', this._onClearClick, this);
            }

            // Autocomplete behaviour
            this.onAutocomplete('click', function (e) {
                this._onListItemClick(e);
                // Autocomplete behaviour
                if (this.options.autocompleteFeatures.includes('setValueOnClick')) {
                    this.setValue(e.target.innerText);
                }
            });
            

            return this._container;
        },

        onRemove: function (map) {

        },


        getValue: function () {
            return this._input.value
        },

        setValue: function (value) {
            this._input.value = value;
            return this
        },

        addItem: function (item) {
            if (this._items.length > 0) {
                let prioritem = this._items[this._items.length-1];
                L.DomUtil.removeClass(prioritem, 'lastitem');
            }
            var listItem = L.DomUtil.create('li', 'leaflet-searchbox-autocomplete-item', this._autocomplete);
            L.DomUtil.addClass(listItem, 'lastitem');

            //listItem.textContent = item;
            listItem.innerHTML = item;
            this._items.push(listItem);

            

            L.DomUtil.addClass(this._searchboxWrapper, 'open');

            return this
        },

        addItems: function (items) {
            for (var i = 0; i < items.length; i++) {
                this.addItem(items[i]);
            }

            return this
        },

        setItems: function (items) {
            this.clearItems();
            this.addItems(items);

            return this
        },

        clearItems: function () {
            this._autocomplete.innerHTML = '';
            this._items = [];
            this._dd_index = null;

            L.DomUtil.removeClass(this._searchboxWrapper, 'open');

            return this
        },

        hide: function () {
            L.DomUtil.addClass(this._container, "collapsed");
            this._input.blur();
            this._button.blur();
            setTimeout(() => {
                this._collapsed = true;
            }, 600);

            return this;
        },

        show: function () {
            L.DomUtil.removeClass(this._container, "collapsed");
            setTimeout(() => {
                this._collapsed = false;
            }, 600);

            return this;
        },

        toggle: function () {
            if (L.DomUtil.hasClass(this._container, "collapsed")) {
                this.show();
            } else {
                this.hide();
            }

            return this;
        },

        isCollapsed: function () {
            return L.DomUtil.hasClass(this._container, "collapsed")
        },

        clearInput: function () {
            this._input.value = '';

            return this
        },

        clear: function () {
            this.clearInput();
            this.clearItems();

            return this;
        },

        onInput: function (event, handler) {
            L.DomEvent.on(this._input, event, handler, this);

            return this
        },

        offInput: function (event, handler) {
            L.DomEvent.off(this._input, event, handler, this);

            return this
        },

        onButton: function (event, handler) {
            var wrapper = this._buttonHandlerWrapper(handler);
            L.DomEvent.on(this._button, event, wrapper, this);

            return this
        },

        offButton: function (event, handler) {
            var wrapper = this._buttonHandlerWrapper(handler);
            L.DomEvent.off(this._button, event, wrapper, this);

            return this
        },

        onAutocomplete: function (event, handler) {
            L.DomEvent.on(this._autocomplete, event, handler, this);

            return this
        },

        offAutocomplete: function (event, handler) {
            L.DomEvent.off(this._autocomplete, event, handler, this);

            return this
        },

        _onInputClick: function (e) {
            e.stopPropagation(); //prevent a hypothetical map click when click on buttons (usefull if a click outside searchbox is used to collapse searchbox)
        },

        _handleKeyDown(e) {
            if (this.options.autocompleteFeatures.includes('arrowKeyNavigation')) {
                if (e.keyCode == 38) {
                    //up               
                    e.stopImmediatePropagation(); //prevent accidentally trigger of fuzzy search if implemented
                    this._previousListItem();
                }
                else if (e.keyCode == 40) {
                    //down
                    e.stopImmediatePropagation(); //prevent accidentally trigger of fuzzy search if implemented
                    this._nextListItem();
                }
                else if (e.keyCode == 27) {
                    //escape
                    e.stopImmediatePropagation(); //prevent accidentally trigger of fuzzy search if implemented
                    this._input.value = '';
                }
            }
        },

        _handleKeyUp(e) {
            if (this.options.autocompleteFeatures.includes('arrowKeyNavigation')) {
                if (e.keyCode == 38) {
                    e.stopImmediatePropagation(); //prevent accidentally trigger of fuzzy search if implemented
                }
                else if (e.keyCode == 40) {
                    e.stopImmediatePropagation(); //prevent accidentally trigger of fuzzy search if implemented
                }
                else if (e.keyCode == 27) {
                    e.stopImmediatePropagation(); //prevent accidentally trigger of fuzzy search if implemented
                }
            }
        },

        _onInputKeyDown: function (e) {            
            this._handleKeyDown(e);
        },

        _onInputKeyUp: function (e) {            
            this._handleKeyUp(e);
        },

        _onClick: function (e) {
            e.stopPropagation(); //prevent a hypothetical map click when click on buttons (usefull if a click outside searchbox is used to collapse searchbox)
            if (this._collapsed) {
                this.show();
                this._input.focus();
            }
        },

        _onClearClick: function (e) {
            e.stopPropagation(); //prevent a hypothetical map click when click on buttons (usefull if a click outside searchbox is used to collapse searchbox)                       
            this.clearInput();
            this._input.focus();
        },

        _onListItemClick: function (e) {
            e.stopPropagation(); //prevent a hypothetical map click when click on buttons (usefull if a click outside searchbox is used to collapse searchbox)                          
        },

        _buttonHandlerWrapper: function (handler) {
            return function () {
                if (!this._collapsed) {
                    handler();
                }
            }
        },

        _create: function () {
            this._container = L.DomUtil.create('div', 'leaflet-control leaflet-searchbox-container');
            if (this.options.class != '') {
                L.DomUtil.addClass(this._container, this.options.class);
            }
            if (this.options.id != '') {
                this._container.id = this.options.id;
            }

            this._searchboxWrapper = L.DomUtil.create('div', 'leaflet-searchbox-wrapper', this._container);


            if (this.options.expand == 'left') {
                this._createInput('left');
                if (this.options.clearButton) {
                    this._createClearButton('right');
                }
                this._createButton('right');
            } else if (this.options.expand == 'right') {
                this._createButton('left');
                if (this.options.clearButton) {
                    this._createClearButton('left');
                }              
                this._createInput('right');
            }
            this._createAutocomplete();
        },

        _createInput: function (position) {
            this._input = L.DomUtil.create(
                'input',
                'leaflet-searchbox leaflet-searchbox-' + position,
                this._searchboxWrapper);
            this._input.setAttribute('type', 'text');
            if (this.options.width != null) {
                this._input.style.width = this.options.width;
            }
        },

        _createButton: function (position) {
            this._button = L.DomUtil.create(
                'button',
                'leaflet-searchbox-button leaflet-searchbox-button-' + position,
                this._searchboxWrapper);
            this._button.setAttribute('type', 'button');
            this._button.style.width = this.options.height;
            this._button.style.height = this.options.height;
            this._icon = L.DomUtil.create('img', 'leaflet-searchbox-icon', this._button);
            this._icon.setAttribute('src', this.options.iconPath);
        },

        _createClearButton: function (position) {
            this._clearbutton = L.DomUtil.create(
                'button',
                'leaflet-searchbox-clearbutton leaflet-searchbox-clearbutton-' + position,
                this._searchboxWrapper);
            this._clearbutton.setAttribute('type', 'button');
            this._clearbutton.style.width = this.options.height;
            this._clearbutton.style.height = this.options.height;
            this._clearicon = L.DomUtil.create('img', 'leaflet-searchbox-icon', this._clearbutton);            
            //if no specific icon path set for clear button, then calculate it based on iconPath
            if (!this.options.clearIconPath && this.options.iconPath) {
                this.options.clearIconPath = 'img/x-icon.png'; //default value
                let index = this.options.iconPath.lastIndexOf('/');
                if (index >= 0) {
                    this.options.clearIconPath = this.options.iconPath.substring(0,index+1) + 'x-icon.png';
                }
            }
            this._clearicon.setAttribute('src', this.options.clearIconPath);
        },

        _createAutocomplete: function () {
            this._autocomplete = L.DomUtil.create(
                'ul',
                'leaflet-searchbox-autocomplete', 
                this._container);
                this._autocomplete.style.height = this.options.listHeight;
                this._autocomplete.style.maxHeight = this.options.maxHeight;
                if (this.options.scrollbar) {
                    this._autocomplete.style.overflowY = 'auto';
                }
            this._items = [];

        },

        _nextListItem: function () {
            if (this._items.length > 0) {
                let gotoNext = false; //use this flag to prevent unnecessary action
                if (typeof this._dd_index == 'number') {
                    this._items[this._dd_index].classList.remove('leaflet-searchbox-highlight-item');
                    if (this._dd_index < this._items.length - 1) {
                        this._dd_index++;
                        gotoNext = true;
                    }
                }
                else {
                    this._dd_index = 0;
                    gotoNext = true;
                }

                if (gotoNext) {
                    this.setValue(this._items[this._dd_index].innerText);
                    this._items[this._dd_index].classList.toggle('leaflet-searchbox-highlight-item');
                }
            }
        },

        _previousListItem: function () {
            if (this._items.length > 0) {
                if (typeof this._dd_index == 'number') {
                    this._items[this._dd_index].classList.remove('leaflet-searchbox-highlight-item');
                    if (this._dd_index > 0) {
                        this._dd_index--;
                        this.setValue(this._items[this._dd_index].innerText);
                        this._items[this._dd_index].classList.toggle('leaflet-searchbox-highlight-item');
                    }
                }
            }
        },


    });

    return L.Control.Searchbox;
}, window));

L.control.searchbox = function (options) {
    return new L.Control.Searchbox(options);
}