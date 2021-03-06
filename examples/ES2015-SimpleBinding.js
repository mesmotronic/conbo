/**
 * Simple data binding example for ConboJS using ES2015 syntax
 * 
 * @author	Neil Rackett
 */
conbo(function()
{
	const ns = this;
	
	class MyApp extends conbo.Application
	{
		get template()
		{
			return /* html */ `
				<h1>Hello <span cb-bind="name" />!</h1>
				<p>My name is <input type="text" cb-bind="name" /></p>
			`;
		}
		
		/**
		 * You can't declare data properties in ES2015 classes, so you should
		 * declare them using the `declarations` method or user a get/set accessor
		 */
		declarations()
		{
			this.name = "Conbo";
		}
	}
	
	/*
	 * All properties of the return Object are added to the current namespace to enable them
	 * to be automatically instantiated, but you can declare classes in the format
	 * `ns.MyClass = class extends SuperClass { ... }` if you prefer
	 */
	return { MyApp };
	
});