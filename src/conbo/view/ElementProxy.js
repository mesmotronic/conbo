/**
 * Element Proxy
 * 
 * Wraps an Element to add cross browser or simplified functionality;
 * think of it as "jQuery nano"
 * 
 * @class		ElementProxy
 * @memberof	conbo
 * @augments	conbo.EventProxy
 * @author 		Neil Rackett
 * @deprecated	This class will be replaced by standard HTML5 functionality in future and may be removed without notice
 * @param 		{Element} el - Element to be proxied
 */
conbo.ElementProxy = conbo.EventProxy.extend(
/** @lends conbo.ElementProxy.prototype */
{
	/**
	 * Returns object containing the value of all attributes on a DOM element
	 * 
	 * @returns		{Object}
	 * 
	 * @example
	 * ep.attributes; // results in something like {src:"foo/bar.jpg"}
	 */
	getAttributes: function()
	{
		var el = this.__obj;
		var a = {};
		
		if (el)
		{
			conbo.forEach(el.attributes, function(p)
			{
				a[conbo.toCamelCase(p.name)] = p.value;
			});
		}
		
		return a;
	},
	
	/**
	 * Sets the attributes on a DOM element from an Object, converting camelCase to kebab-case, if needed
	 * 
	 * @param 		{Element}	obj - Object containing the attributes to set
	 * @returns		{conbo.ElementProxy}
	 * 
	 * @example
	 * ep.setAttributes({foo:1, bar:"red"});
	 */
	setAttributes: function(obj)
	{
		var el = this.__obj;
		
		if (el && obj)
		{
			conbo.forEach(obj, function(value, name)
			{
				el.setAttribute(conbo.toKebabCase(name), value);
			});
		}
		
		return this;
	},
	
	/**
	 * @see #getAttributes
	 */
	get attributes()
	{
		return this.getAttributes();
	},
	
	/**
	 * @see #setAttributes
	 */
	set attributes(value)
	{
		return this.setAttributes(value);
	},
	
	/**
	 * Returns object containing the value of all cb-* attributes on a DOM element
	 * 
	 * @returns		{Array}
	 * 
	 * @example
	 * ep.cbAttributes.view;
	 */
	get cbAttributes()
	{
		var el = this.__obj;
		var a = {};
		
		if (el)
		{
			conbo.forEach(el.attributes, function(p)
			{
				if (p.name.indexOf('cb-') === 0)
				{
					a[conbo.toCamelCase(p.name.substr(3))] = p.value;
				}
			});
		}
		
		return a;
	},
	
	/**
	 * Add the specified CSS class(es) to the element
	 *  
	 * @param 		{string}	className - One or more CSS class names, separated by spaces
	 * @returns		{conbo.ElementProxy}
	 */
	addClass: function(className)
	{
		var el = this.__obj;
		
		if (el instanceof Element && className)
		{
			var classNames = className.trim().split(' ');

			// IE11 doesn't support multiple parameters
			while (className = classNames.pop())
			{
				el.classList.add(className);
			}
		}
		
		return this;
	},
	
	/**
	 * Remove the specified CSS class(es) from the element
	 * 
	 * @param 		{string|function}		className - One or more CSS class names, separated by spaces, or a function extracts the classes to be removed from the existing className property
	 * @returns		{conbo.ElementProxy}
	 */
	removeClass: function(className)
	{
		var el = this.__obj;
		
		if (el instanceof Element && className)
		{
			if (conbo.isFunction(className))
			{
				className = className(el.className);
			}
			
			var classNames = className.trim().split(' ');

			// IE11 doesn't support multiple parameters
			while (className = classNames.pop())
			{
				el.classList.remove(className);
			}
		}
		
		return this;
	},
	
	/**
	 * Is this element using the specified CSS class?
	 *  
	 * @param 		{string}	className - CSS class name
	 * @returns		{boolean}
	 */
	hasClass: function(className)
	{
		var el = this.__obj;
		
		return el instanceof Element && className
			? el.classList.contains(className)
			: false;
	},
	
	/**
	 * Finds the closest parent element matching the specified selector
	 *  
	 * @param 		{string}	selector - Query selector
	 * @returns		{Element}
	 */
	closest: function(selector)
	{
		var el = this.__obj;
		
		if (el)
		{
			var matchesFn;
			
			['matches','webkitMatchesSelector','mozMatchesSelector','msMatchesSelector','oMatchesSelector'].some(function(fn) 
			{
				if (typeof document.body[fn] == 'function') 
				{
					matchesFn = fn;
					return true;
				}
				
				return false;
			});
			
			var parent;
			
			// traverse parents
			while (el)
			{
				parent = el.parentElement;
				
				if (parent && parent[matchesFn](selector)) 
				{
					return parent;
				}
				
				el = parent;
			}
		}
	},
	
});
