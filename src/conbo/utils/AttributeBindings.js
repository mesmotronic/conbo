/**
 * Attribute Bindings
 * 
 * Functions that can be used to bind DOM elements to properties of Bindable 
 * class instances to DOM elements via their attributes
 * 
 * @example		<div cb-hide="property">Hello!</div>
 * @author 		Neil Rackett
 */
conbo.AttributeBindings = conbo.Class.extend
({
	initialize: function()
	{
		// Methods that can accept multiple parameters
		
		this.cbClass.multiple = true;
		this.cbStyle.multiple = true;
		
		// Methods that require raw attribute data instead of bound property values
		
		this.cbIncludeIn.raw = true;
		this.cbExcludeFrom.raw = true;
	},
	
	/**
	 * Can the given attribute be bound to multiple properties at the same time?
	 * @param 	{String}	attribute
	 * @returns {Boolean}
	 */
	canHandleMultiple: function(attribute)
	{
		var f = conbo.toCamelCase(attribute);
		
		return (f in this)
			? !!this[f].multiple
			: false;
	},
	
	/**
	 * Makes an element visible
	 * 
	 * @param value
	 * @param el
	 */
	cbShow: function(value, el)
	{
		this.cbHide(!value, el);
	},
	
	/**
	 * Hides an element by making it invisible, but does not remove
	 * if from the layout of the page, meaning a blank space will remain
	 * 
	 * @param value
	 * @param el
	 */
	cbHide: function(value, el)
	{
		var $el = $(el);
		
		!!value
			? $el.addClass('cb-hide')
			: $el.removeClass('cb-hide');
	},
	
	/**
	 * Include an element on the screen and in the layout of the page
	 * 
	 * @param value
	 * @param el
	 */
	cbInclude: function(value, el)
	{
		this.cbExclude(!value, el);
	},
	
	/**
	 * Remove an element from the screen and prevent it having an effect
	 * on the layout of the page
	 * 
	 * @param value
	 * @param el
	 */
	cbExclude: function(value, el)
	{
		var $el = $(el);
		
		!!value
			? $el.addClass('cb-exclude')
			: $el.removeClass('cb-exclude');
	},
	
	/**
	 * The exact opposite of HTML's built-in `disabled` property
	 * 
	 * @param value
	 * @param el
	 */
	cbEnabled: function(value, el)
	{
		el.disabled = !value;
	},
	
	/**
	 * Inserts raw HTML into the element, which is rendered as HTML
	 * 
	 * @param value
	 * @param el
	 */
	cbHtml: function(value, el)
	{
		$(el).html(value);
	},
	
	/**
	 * Inserts text into the element so that it appears on screen exactly as
	 * it's written by converting special characters (<, >, &, etc) into HTML
	 * entities before rendering them, e.g. "8 < 10" becomes "8 &lt; 10"
	 * 
	 * @param value
	 * @param el
	 */
	cbText: function(value, el)
	{
		$(el).html(conbo.encodeEntities(value));
	},
	
	/**
	 * Applies or removes a CSS class to or from the element based on the value
	 * of the bound property, e.g. cb-class="myProperty:class-name"
	 * 
	 * @param value
	 * @param el
	 */
	cbClass: function(value, el, options, className)
	{
		if (!className)
		{
			conbo.warn('cb-class attributes must specify one or more CSS classes in the format cb-class="myProperty:class-name"');
		}
		
		var $el = $(el);
		
		!!value
			? $el.addClass(className)
			: $el.removeClass(className);
	},
	
	/**
	 * Applies class(es) to the element based on the value contained in a variable. 
	 * Experimental.
	 * 
	 * @param value
	 * @param el
	 */
	cbClasses: function(value, el)
	{
		var $el = $(el);
		
		if (el.cbClasses)
		{
			$el.removeClass(el.cbClasses);
		}
		
		el.cbClasses = value;
		
		if (value)
		{
			$el.addClass(value);
		}
	},
	
	/**
	 * Apply styles from a variable
	 * 
	 * @param value
	 * @param el
	 */
	cbStyle: function(value, el, options, styleName)
	{
		if (!styleName)
		{
			conbo.warn('cb-style attributes must specify one or more styles in the format cb-style="myProperty:style-name"');
		}
		
		$(el).css(styleName, value);
	},
	
	/**
	 * Repeat the selected element
	 * 
	 * @param value
	 * @param el
	 */
	cbRepeat: function(values, el, options, itemRendererClassName)
	{
		var a, 
			args = conbo.toArray(arguments),
			$el = $(el),
			viewClass;
		
		options || (options = {});
		
		if (options.context && options.context.namespace)
		{
			viewClass = conbo.BindingUtils.getClass(itemRendererClassName, options.context.namespace);
		}
		
		viewClass || (viewClass = conbo.View);
		el.cbRepeat || (el.cbRepeat = {});
		
		elements = el.cbRepeat.elements || [];
		
		$el.removeClass('cb-exclude');
		
		if (el.cbRepeat.list != values && values instanceof conbo.List)
		{
			if (!!el.cbRepeat.list)
			{
				el.cbRepeat.list.removeEventListener('add remove change', el.cbRepeat.changeHandler);
			}
			
			el.cbRepeat.changeHandler = this.bind(function(event)
			{
				this.cbRepeat.apply(this, args);
			});
			
			values.addEventListener('add remove change', el.cbRepeat.changeHandler);
			el.cbRepeat.list = values;
		}
		
		switch (true)
		{
			case values instanceof Array:
			case values instanceof conbo.List:
				a = values;
				break;
				
			default:
				a = [];
				break;
		}
		
		if (elements.length)
		{
			$(elements[0]).before($el);
		}
		
		while (elements.length)
		{
			$(elements.pop()).remove();
		}
		
		a.forEach(function(value, index)
		{
			if (conbo.isObject(value) && !(value instanceof conbo.Hash))
			{
				value = new conbo.Hash(value);
			}
			
			var $clone = $el.clone().removeAttr('cb-repeat');
			
			var viewOptions = 
			{
				data: value, 
				el: $clone, 
				index: index,
				isLast: index == a.length-1
			};
			
			var view = new viewClass(conbo.extend(viewOptions, options));
			
			view.$el.addClass('cb-repeat');
			
			elements.push(view.el);
		});
		
		$el.after(elements);
		el.cbRepeat.elements = elements;
		
		!!elements.length
			? $el.remove()
			: $el.addClass('cb-exclude');
	},
	
	/**
	 * Enables the use of cb-onbind attribute to handle the 'bind' event 
	 * dispatched by the element after it has been bound by Conbo
	 * 
	 * @param value
	 * @param el
	 */
	cbOnbind: function(value, el)
	{
		el.addEventListener('bind', value);
	},
	
	/**
	 * Restricts text input to the specified characters
	 * 
	 * @param value
	 * @param el
	 */
	cbRestrict: function(value, el)
	{
		// TODO Restrict to text input fields?
		
		if (el.cbRestrict)
		{
			el.removeEventListener('keypress', el.cbRestrict);
		}
		
		el.cbRestrict = function(event)
		{
			if (event.ctrlKey)
			{
				return;
			}
			
			var code = event.keyCode || event.which;
			var char = event.key || String.fromCharCode(code);
			var regExp = value;
				
			if (!conbo.isRegExp(regExp))
			{
				regExp = new RegExp('['+regExp+']', 'g');
			}
			
			if (!char.match(regExp))
			{
				event.preventDefault();
			}
		};
		
		el.addEventListener('keypress', el.cbRestrict);
	},
	
	/**
	 * When used with a standard DOM element, the properties of the element's
	 * `dataset` (it's `data-*` attributes) are set using the properties of the 
	 * object being bound to it; you'll need to use a polyfill for IE <= 10
	 * 
	 * When used with a Glimpse, the Glimpse's `data` property is set to
	 * the value of the bound property. 
	 * 
	 * @param value
	 * @param el
	 */
	cbData: function(value, el)
	{
		if (el.cbGlimpse)
		{
			el.cbGlimpse.data = value;
		}
		else if (conbo.isObject(value))
		{
			conbo.setValues(el.dataset, value);
		}
	},
	
	/**
	 * Only includes the specified element in the layout when the View's `currentState`
	 * matches one of the states listed in the attribute's value; multiple states should
	 * be separated by spaces
	 * 
	 * @example		cb-include-in="happy sad melancholy"
	 * 
	 * @param 		value
	 * @param 		el
	 * @param 		options
	 */
	cbIncludeIn: function(value, el, options)
	{
		var view = options.view;
		if (!view) return;
		
		var method = options.useExclude
			? 'cbExclude'
			: 'cbInclude';
		
		var states = value.split(' ');
		
		var stateChangeHandler = function()
		{
			this[method](states.indexOf(view.currentState) != -1, el);
		};
		
		view.addEventListener('change:currentState', stateChangeHandler, this);
		stateChangeHandler.call(this);
	},
	
	/**
	 * Removes the specified element from the layout when the View's `currentState`
	 * matches one of the states listed in the attribute's value; multiple states should
	 * be separated by spaces
	 * 
	 * @example		cb-exclude-from="confused frightened"
	 * 
	 * @param 		value
	 * @param 		el
	 * @param 		options
	 */
	cbExcludeFrom: function(value, el, options)
	{
		this.cbIncludeIn(value, el, conbo.extend(options, {useExclude:true}));
	},
	
});
