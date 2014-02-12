/**
 * Application
 * 
 * Base application class for client-side applications
 * 
 * @author		Neil Rackett
 */
conbo.Application = conbo.View.extend
({
	/**
	 * Default context class to use
	 * You'll normally want to override this with your own
	 */
	contextClass: conbo.Context,
	
	/**
	 * Constructor: DO NOT override! (Use initialize instead)
	 * @param options
	 */
	constructor: function(options)
	{
		options = _.clone(options) || {};
		options.view = options.view || this;
		
		if (!options.el)
		{
			var appName = this.toString().replace(/[\[\]']+/g, ''),
				el = conbo.$('[cb-app='+appName+']')[0];
			
			if (!!el) options.el = el;
		}
		
		this.context = options.context || new this.contextClass(options);
		
		conbo.View.prototype.constructor.apply(this, arguments);
	},
	
	/**
	 * Apply View classes to HTML elements based on their cb-view attribute
	 * @param	ns	Namespace of the view classes
	 */
	bindViews: function(ns)
	{
		if (!_.isObject(ns)) throw new Error('Invalid namespace');
		
		this.$('[cb-view]').each(this.bind(function(index, el)
		{
			var view = this.$(el).cbData('view'),
				viewClass = ns[view];
			
			if (!_.isFunction(viewClass)) return;
			new viewClass(this.context.addTo({el:el}));
		}));
		
		return this;
	},
	
	toString: function()
	{
		return '[conbo.Application]';
	},
});
