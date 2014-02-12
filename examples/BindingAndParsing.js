/**
 * Binding and parsing example for Conbo.js
 * @author	Neil Rackett
 */
(function()
{
	/**
	 * Switch conbo.Hash for conbo.Model if you need web services
	 */
	var MyModel = conbo.Hash.extend
	({
		defaults: 
		{
			price: 1234.567
		}
	});
	
	var InputView = conbo.View.extend
	({
		tagName: 'p',
		
		/**
		 * Properties with a value of undefined that have been mapped to 
		 * singletons in the context are automatically injected
		 */
		myModel: undefined,
		
		initialize: function()
		{
			this.$el.html('Type a number here: <input type="text" cb-bind="myModel.price" />');
			this.bindView();
		}
	});
	
	var OutputView = conbo.View.extend
	({
		tagName: 'h1',
		
		/**
		 * Properties with a value of undefined that have been mapped to 
		 * singletons in the context are automatically injected
		 */
		myModel: undefined,
		
		initialize: function()
		{
			this.$el.html('It cost <span cb-bind="myModel.price" cb-parse="parseCurrency" />!');
			this.bindView(); // Automatically binds cb-bind values in HTML to class properties
			
			/*
			// This could also be written as:
			this.$el.html('Hello <span/>!');
			conbo.BindingUtils.bindElement(this.myModel, 'name', this.$('span'), this.parseCurrency);
			*/
		},
		
		/**
		 * Parses the input value into a formatted currency value, e.g. 1234.56 --> �1,234.56
		 * @param 	value
		 * @returns	{String}
		 */
		parseCurrency: function(value)
		{
			var n = parseFloat(value), 
				c = 2, 
				d = '.', 
				t = ',', 
				s = n < 0 ? '-' : '', 
				i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + '', 
				j = (j = i.length) > 3 ? j % 3 : 0;
			
			return '&pound;' + s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
		 }
	});
	
	var MyContext = conbo.Context.extend
	({
		/**
		 * Entry point
		 */
		initialize: function()
		{
			this.mapSingleton('myModel', MyModel);
		}
	});
	
	var MyApp = conbo.Application.extend
	({
		/**
		 * Application will automatically use an instance of this class as 
		 * the application's context (event bus); uses vanilla conbo.Context
		 * if not specified
		 */
		contextClass: MyContext,
		
		/**
		 * Entry point
		 */
		initialize: function()
		{
			this.render();
		},
		
		render: function()
		{
			this.appendView
			(
				new InputView(this.context.addTo()), 
				new OutputView(this.context.addTo())
			);
			
			return this;
		}
	});
	
	var app = new MyApp();
	
	document.body.appendChild(app.el);
	
})();