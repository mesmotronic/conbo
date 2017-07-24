var View__templateCache = {};

/**
 * View
 * 
 * Creating a conbo.View creates its initial element outside of the DOM,
 * if an existing element is not provided...
 * 
 * @class		conbo.View
 * @augments	conbo.Glimpse
 * @author 		Neil Rackett
 * @param 		{object}	options - Object containing optional initialisation options, including 'attributes', 'className', 'data', 'el', 'id', 'tagName', 'template', 'templateUrl'
 * @fires		conbo.ConboEvent#ADD
 * @fires		conbo.ConboEvent#DETACH
 * @fires		conbo.ConboEvent#REMOVE
 * @fires		conbo.ConboEvent#BIND
 * @fires		conbo.ConboEvent#UNBIND
 * @fires		conbo.ConboEvent#TEMPLATE_COMPLETE
 * @fires		conbo.ConboEvent#TEMPLATE_ERROR
 * @fires		conbo.ConboEvent#CREATION_COMPLETE
 */
conbo.View = conbo.Glimpse.extend(
/** @lends 		conbo.View.prototype */
{
	/**
	 * @member		{object}	attributes - Attributes to apply to the View's element
	 * @memberOf	conbo.View.prototype
	 */
	
	/**
	 * @member		{string}	className - CSS class name(s) to apply to the View's element
	 * @memberOf	conbo.View.prototype
	 */
	
	/**
	 * @member		{object}	data - Arbitrary data Object
	 * @memberOf	conbo.View.prototype
	 */
	
	/**
	 * @member		{string}	id - ID to apply to the View's element
	 * @memberOf	conbo.View.prototype
	 */
	
	/**
	 * @member		{string}	tagName - The tag name to use for the View's element (if no element specified)
	 * @memberOf	conbo.View.prototype
	 */
	
	/**
	 * @member		{string}	template - Template to apply to the View's element
	 * @memberOf	conbo.View.prototype
	 */
	
	/**
	 * @member		{string}	templateUrl - Template to load and apply to the View's element
	 * @memberOf	conbo.View.prototype
	 */
	
	/**
	 * @member		{boolean}	templateCacheEnabled - Whether or not the contents of templateUrl should be cached on first load for use with future instances of this View class (default: true)
	 * @memberOf	conbo.View.prototype
	 */
	
	/**
	 * @member		{boolean}	autoInitTemplate - Whether or not the template should automatically be loaded and applied, rather than waiting for the user to call initTemplate (default: true)
	 * @memberOf	conbo.View.prototype
	 */
	
	/**
	 * Constructor: DO NOT override! (Use initialize instead)
	 * @param options
	 * @private
	 */
	__construct: function(options)
	{
		options = conbo.clone(options) || {};
		
		if (options.className && this.className)
		{
			options.className += ' '+this.className;
		}
		
		var viewOptions = conbo.union
		(
			[
				'attributes',
				'className', 
				'data', 
				'id', 
				'style', 
				'tagName', 
				'template', 
				'templateUrl',
				'templateCacheEnabled',
				'autoInitTemplate',
			],
			
			// Adds interface properties
			conbo.intersection
			(
				conbo.variables(this, true), 
				conbo.variables(options)
			)
		);
		
		conbo.setValues(this, conbo.pick(options, viewOptions));
		conbo.makeBindable(this, ['currentState']);
		
		this.context = options.context;
		this.__setEl(options.el || document.createElement(this.tagName));
	},

	__postInitialize: function(options)
	{
		__definePrivateProperty(this, '__initialized', true);
		
		this.__content =  this.el.innerHTML;
		
		if (this.autoInitTemplate !== false)
		{
			this.initTemplate();
		}
	},
	
	/**
	 * This View's element
	 */
	get el()
	{
		return this.__el;
	},
	
	/**
	 * Has this view completed its life cycle phases?
	 */
	get initialized()
	{
		return !!this.__initialized;
	},
	
	/**
	 * Returns a reference to the parent View of this View, based on this 
	 * View element's position in the DOM
	 */
	get parent()
	{
		if (this.initialized)
		{
			return this.__getParent('.cb-view');
		}
	},
	
	/**
	 * Returns a reference to the parent Application of this View, based on
	 * this View element's position in the DOM
	 */
	get parentApp()
	{
		if (this.initialized)
		{
			return this.__getParent('.cb-app');
		}
	},
	
	/**
	 * Does this view have a template?
	 */
	get hasTemplate()
	{
		return !!(this.template || this.templateUrl);
	},
	
	/**
	 * The element into which HTML content should be placed; this is either the 
	 * first DOM element with a `cb-content` or the root element of this view
	 */
	get content()
	{
		return this.querySelector('[cb-content]');
	},
	
	/**
	 * Does this View support HTML content?
	 */
	get hasContent()
	{
		return !!this.content;
	},
	
	/**
	 * A View's body is the element to which content should be added:
	 * the View's content, if it exists, or the View's main element, if it doesn't
	 */
	get body()
	{
		return this.content || this.el;
	},
	
	/**
	 * The context that will automatically be applied to children
	 * when binding or appending Views inside of this View
	 */
	get subcontext()
	{
		return this.__subcontext || this.context;
	},
	
	set subcontext(value)
	{
		this.__subcontext = value;
	},
	
	/**
	 * Uses querySelector to find the first matching element contained within the
	 * current View's element, but not within the elements of child Views
	 * 
	 * @param	{string}	selector - The selector to use
	 * @param	{boolean}	deep - Include elements in child Views?
	 * @returns	{Element}	The first matching element
	 */
	querySelector: function(selector, deep)
	{
		return this.querySelectorAll(selector, deep)[0];
	},
	
	/**
	 * Uses querySelectorAll to find all matching elements contained within the
	 * current View's element, but not within the elements of child Views
	 * 
	 * @param	{string}	selector - The selector to use
	 * @param	{boolean}	deep - Include elements in child Views?
	 * @returns	{array}		All elements matching the selector
	 */
	querySelectorAll: function(selector, deep)
	{
		if (this.el)
		{
			var results = conbo.toArray(this.el.querySelectorAll(selector));
			
			if (!deep)
			{
				var views = this.el.querySelectorAll('.cb-view, [cb-view], [cb-app]');
				
				// Remove elements in child Views
				conbo.forEach(views, function(el)
				{
					var els = conbo.toArray(el.querySelectorAll(selector));
					results = conbo.difference(results, els.concat(el));
				});
			}
			
			return results;
		}
		
		return [];
	},
	
	/**
	 * Take the View's element element out of the DOM
	 */
	detach: function() 
	{
		var el = this.el;
		
		if (el.parentNode)
		{
			el.parentNode.removeChild(el);		
			this.dispatchEvent(new conbo.ConboEvent(conbo.ConboEvent.DETACH));
		}
		
		return this;
	},
	
	/**
	 * Remove and destroy this View by taking the element out of the DOM, 
	 * unbinding it, removing all event listeners and removing the View from 
	 * its Context.
	 * 
	 * You should use a REMOVE event handler to destroy any event listeners,
	 * timers or other code you may have added.
	 */
	remove: function()
	{
		this.unbindView()
			.removeEventListener()
			;
		
		if (this.data)
		{
			this.data = undefined;
		}
		
		if (this.context)
		{
			this.context
				.uninjectSingletons(this)
				.removeEventListener(undefined, undefined, this)
				;
			
			this.context = undefined;
		}
		
		this.detach()
			.dispatchEvent(new conbo.ConboEvent(conbo.ConboEvent.REMOVE))
			;
		
		return this;
	},
	
	/**
	 * Append this DOM element from one View class instance this class 
	 * instances DOM element
	 * 
	 * @param 		view
	 * @returns 	this
	 */
	appendView: function(view)
	{
		if (arguments.length > 1)
		{
			conbo.forEach(arguments, function(view, index, list) 
			{
				this.appendView(view);
			},
			this);
			
			return this;
		}
		
		if (!(view instanceof conbo.View))
		{
			throw new Error('Parameter must be instance of conbo.View class');
		}
	
		this.body.appendChild(view.el);
		
		return this;
	},
	
	/**
	 * Prepend this DOM element from one View class instance this class 
	 * instances DOM element
	 * 
	 * @param 		view
	 * @returns 	this
	 */
	prependView: function(view)
	{
		if (arguments.length > 1)
		{
			conbo.forEach(arguments, function(view, index, list) 
			{
				this.prependView(view);
			}, 
			this);
			
			return this;
		}
		
		if (!(view instanceof conbo.View))
		{
			throw new Error('Parameter must be instance of conbo.View class');
		}
		
		var firstChild = this.body.firstChild;
		
		firstChild
			? this.body.insertBefore(view.el, firstChild)
			: this.appendView(view);
		
		return this;
	},
	
	/**
	 * Automatically bind elements to properties of this View
	 * 
	 * @example	<div cb-bind="property|parseMethod" cb-hide="property">Hello!</div> 
	 * @returns	this
	 */
	bindView: function()
	{
		conbo.BindingUtils.bindView(this);
		this.dispatchEvent(new conbo.ConboEvent(conbo.ConboEvent.BIND));
		return this;
	},
	
	/**
	 * Unbind elements from class properties
	 * @returns	this
	 */
	unbindView: function() 
	{
		conbo.BindingUtils.unbindView(this);
		this.dispatchEvent(new conbo.ConboEvent(conbo.ConboEvent.UNBIND));
		return this;
	},
	
	/**
	 * Initialize the View's template, either by loading the templateUrl
	 * or using the contents of the template property, if either exist
	 */
	initTemplate: function()
	{
		var template = this.template;
		
		if (!!this.templateUrl)
		{
			this.loadTemplate();
		}
		else
		{
			if (conbo.isFunction(template))
			{
				template = template(this);
			}
			
			if (conbo.isString(template))
			{
				this.el.innerHTML = template;
			}
			
			this.__initView();
		}
		
		return this;
	},
	
	/**
	 * Load HTML template and use it to populate this View's element
	 * 
	 * @param 	{String}	url			A string containing the URL to which the request is sent
	 */
	loadTemplate: function(url)
	{
		url || (url = this.templateUrl);
		
		var el = this.body;
		
		this.unbindView();
		
		if (this.templateCacheEnabled !== false && View__templateCache[url])
		{
			el.innerHTML = View__templateCache[url];
			this.__initView();
			
			return this;
		}
		
		var resultHandler = function(event)
		{
			var result = event.result;
			
			if (this.templateCacheEnabled !== false)
			{
				View__templateCache[url] = result;
			}
			
			el.innerHTML = result;
			this.__initView();
		};
		
		var faultHandler = function(event)
		{
			el.innerHTML = '';
			
			this.dispatchEvent(new conbo.ConboEvent(conbo.ConboEvent.TEMPLATE_ERROR));
			this.__initView();
		};
		
		conbo
			.httpRequest({url:url, dataType:'text'})
			.then(resultHandler, faultHandler, this)
			;
		
		return this;
	},
	
	toString: function()
	{
		return 'conbo.View';
	},

	
	/* INTERNAL */
	
	/**
	 * Set this View's element
	 * @private
	 */
	__setEl: function(el)
	{
		if (!conbo.isElement(el))
		{
			conbo.error('Invalid element passed to View');
			return;
		}
		
		var attrs = conbo.setValues({}, this.attributes);
		
		if (this.id && !el.id) 
		{
			attrs.id = this.id;
		}
		
		if (this.style) 
		{
			conbo.setValues(el.style, this.style);
		}
		
		var ep = __ep(el);
		
		el.cbView = this;
		
		ep.addClass('cb-view')
			.addClass(this.className)
			.setAttributes(attrs)
			;
		
		__definePrivateProperty(this, '__el', el);
		
		return this;
	},
	
	/**
	 * Populate and render the View's HTML content
	 * @private
	 */
	__initView: function()
	{
		if (this.hasTemplate && this.hasContent)
		{
			this.content.innerHTML = this.__content;
		}
		
		delete this.__content;
		
		this.dispatchEvent(new conbo.ConboEvent(conbo.ConboEvent.TEMPLATE_COMPLETE))
			.bindView()
			;
		
		conbo.defer(function()
		{
			this.dispatchEvent(new conbo.ConboEvent(conbo.ConboEvent.CREATION_COMPLETE));
		}, this);
		
		return this;
	},
	
	__getParent: function(selector) 
	{
		var el = __ep(this.el).closest(selector);
	    if (el) return el.cbView;
	},
	
});

__denumerate(conbo.View.prototype);
