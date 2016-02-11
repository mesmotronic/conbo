/**
 * LocalList is a persistent List class that is saved into LocalStorage
 * or SessionStorage
 * 
 * @class		conbo.LocalList
 * @augments	conbo.List
 * @author 		Neil Rackett
 * @param 		{object} options - Object containing initialisation options, including 'name' (String) and 'source' (Array) of default options
 */
conbo.LocalList = conbo.List.extend(
/** @lends conbo.LocalList.prototype */
{
	constructor: function(options)
	{
		var defaultName = 'ConboLocalList';
		
		options = conbo.defaults(options || {}, {name:defaultName});
		
		var name = options.name;
		
		var storage = options.session 
			? window.sessionStorage
			: window.localStorage;
		
		if (name == defaultName)
		{
			conbo.warn('No name specified for '+this.toString+', using "'+defaultName+'"');
		}
		
		var getLocal = function()
		{
			return name in storage
				? JSON.parse(storage.getItem(name) || '[]')
				: options.source || [];
		};
		
		// Sync with LocalStorage
		this.addEventListener(conbo.ConboEvent.CHANGE, function(event)
		{
  			storage.setItem(name, JSON.stringify(this));
		}, 
		this, 1000);
		
		options.source = getLocal();
		
		conbo.List.prototype.constructor.call(this, options);
	},
	
	toString: function()
	{
		return 'conbo.LocalList';
	}
	
});

__denumerate(conbo.LocalList.prototype);
