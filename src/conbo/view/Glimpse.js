/**
 * Glimpse
 * 
 * A lightweight element wrapper that has no dependencies, no context and 
 * no data binding, but is able to apply a super-simple template.
 * 
 * It's invisible to View, so it's great for creating components, and you 
 * can bind data to it using the `cb-data` attribute to set the data 
 * property of your Glimpse
 * 
 * @class		Glimpse
 * @memberof	conbo
 * @augments	conbo.EventDispatcher
 * @author 		Neil Rackett
 * @param 		{Object} options - Object containing initialisation options
 */
conbo.Glimpse = conbo.EventDispatcher.extend(
/** @lends conbo.Glimpse.prototype */
{
	/**
	 * Constructor: DO NOT override! (Use initialize instead)
	 * @param options
	 * @private
	 */
	__construct: function(options)
	{
		this.__setEl(options.el || document.createElement(this.tagName));
		
		if (options.context)
		{
			this.context = options.context;
		}
		
		if (this.template)
		{
			this.el.innerHTML = this.template;
		}
	},
	
	/**
	 * The default `tagName` is `div`
	 */
	get tagName()
	{
		return this.__tagName || 'div';
	},
	
	set tagName(value)
	{
		__definePrivateProperty(this, '__tagName', value);
	},
	
	/**
	 * The class's element
	 */
	get el()
	{
		return this.__el;
	},
	
	toString: function()
	{
		return 'conbo.Glimpse';
	},
	
	/**
	 * Set this View's element
	 * @private
	 */
	__setEl: function(el)
	{
		var attrs = conbo.setValues({}, this.attributes);
		
		if (this.id && !el.id) 
		{
			attrs.id = this.id;
		}
		
		el.className += ' cb-glimpse '+(this.className || '');
		el.cbGlimpse = this;
		
		for (var attr in attrs)
		{
			el.setAttribute(conbo.toKebabCase(attr), attrs[attr]);		
		}		
		
		if (this.style)
		{
			el.style = conbo.setValues(el.style, this.style);
		}
		
		__definePrivateProperty(this, '__el', el);
		
		return this;
	}
	
});

__denumerate(conbo.Glimpse.prototype);
