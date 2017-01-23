/**
 * Cached regex for stripping a leading hash/exclamation/slash and trailing space.
 * @private
 */ 
var routeStripper = /^#!|^[#\/]|\s+$/g;

/**
 * Cached regex for stripping leading and trailing slashes.
 * @private
 */
var rootStripper = /^\/+|\/+$/g;

/**
 * Cached regex for removing a trailing slash.
 * @private
 */
var trailingSlash = /\/$/;

/**
 * conbo.History handles cross-browser history management using the 
 * onhashchange event and hash-bang URL fragments
 * 
 * @see https://developer.mozilla.org/en-US/docs/DOM/window.onhashchange
 * @class		conbo.History
 * @augments	conbo.EventDispatcher
 * @author 		Neil Rackett
 */
conbo.History = conbo.EventDispatcher.extend(
/** @lends conbo.History.prototype */
{
	/**
	 * Has the history handling already been started?
	 */
	started: false,
	
	/**
	 * Constructor: DO NOT override! (Use initialize instead)
	 * @param options
	 * @private
	 */
	__construct: function(options)
	{
		this.handlers = [];
		this.bindAll('checkUrl');
		
		if (typeof window !== 'undefined')
		{
			this.location = window.location;
			this.history = window.history;
		}
		
		if (!!options.context)
		{
			this.context = options.context;
		}
	},
	
	/**
	 * Whether or not Conbo's History class is supported by the current browser
	 */
	get isSupported()
	{
		return 'onhashchange' in window;
	},
	
	/**
	 * Gets the true hash value. Cannot use location.hash directly due
	 * to bug in Firefox where location.hash will always be decoded.
	 */
	getHash: function(window)
	{
		if (window || this.location)
		{
			var match = (window || this).location.href.match(/#!?(.*)$/);
			return match ? match[1] : '';
		}
	},
	
	/**
	 * Get the cross-browser normalized URL fragment, either from the
	 * URL, the hash, or the override.
	 */
	getFragment: function(fragment)
	{
		fragment || (fragment = this.getHash());
		return fragment.replace(routeStripper, '');
	},
	
	/**
	 * Start the hash change handling, returning `true` if the current
	 * URL matches an existing route, and `false` otherwise.
	 */
	start: function(options)
	{
		if (this.started)
		{
			throw new Error("conbo.history has already been started");
		}
		
		this.started = true;
		this.fragment = this.getFragment();
		
		window.addEventListener('hashchange', this.checkUrl);
		
		if (!(options || {}).silent)
		{
			return this.loadUrl();
		}
		
		this.dispatchEvent(new conbo.ConboEvent(conbo.ConboEvent.STARTED));
		
		return this;
	},
	
	/**
	 * Disable conbo.history, perhaps temporarily. Not useful in a real app,
	 * but possibly useful for unit testing Routers.
	 */
	stop: function()
	{
		window.removeEventListener('hashchange', this.checkUrl);
		this.started = false;
		
		this.dispatchEvent(new conbo.ConboEvent(conbo.ConboEvent.STOPPED));
		
		return this;
	},
	
	/**
	 * Add a route to be tested when the fragment changes. Routes added
	 * later may override previous routes.
	 */
	route: function(route, callback)
	{
		this.handlers.unshift({route:route, callback:callback});
		
		return this;
	},
	
	/**
	 * Checks the current URL to see if it has changed, and if it has,
	 * calls `loadUrl`
	 */
	checkUrl: function(e)
	{
		var changed = this.getFragment() !== this.fragment;
		
		if (changed)
		{
			this.loadUrl() || this.loadUrl(this.getHash());
		}
		
		this.dispatchEvent(new conbo.ConboEvent(conbo.ConboEvent.NAVIGATE));
		
		return !changed;
	},
	
	/**
	 * Attempt to load the current URL fragment. If a route succeeds with a
	 * match, returns `true`. If no defined routes matches the fragment, returns `false`.
	 */
	loadUrl: function(fragmentOverride)
	{
		var fragment = this.fragment = this.getFragment(fragmentOverride);
		
		var matched = conbo.some(this.handlers, function(handler)
		{
			if (handler.route.test(fragment))
			{
				handler.callback(fragment);
				return true;
			}
		});
		
		return matched;
	},
	
	/**
	 * Save a fragment into the hash history, or replace the URL state
	 * if the 'replace' option is passed. You are responsible for properly
	 * URL-encoding the fragment in advance.
	 * 
	 * The options object can contain `trigger: true` if you wish to have the
	 * route callback be fired (not usually desirable), or `replace: true`, if
	 * you wish to modify the current URL without adding an entry to the history.
	 */
	navigate: function(fragment, options)
	{
		if (!this.started) return false;
		
		if (!options || options === true)
		{
			options = {trigger: options};
		}
		
		fragment = this.getFragment(fragment);
		
		if (this.fragment === fragment) 
		{
			return;
		}
		
		this.fragment = fragment;
		this.__updateHash(this.location, fragment, options.replace);
		
		if (options.trigger) 
		{
			this.loadUrl(fragment);
		}
		
		return this;
	},
	
	toString: function()
	{
		return 'conbo.History';
	},
	
	/**
	 * Update the hash location, either replacing the current entry, or
	 * adding a new one to the browser history.
	 * 
	 * @private
	 */
	__updateHash: function(location, fragment, replace)
	{
		if (replace)
		{
			var href = location.href.replace(/(javascript:|#).*$/, '');
			location.replace(href + '#!/' + fragment);
		}
		else
		{
			location.hash = '#!/' + fragment;
		}
	}
	
}).implement(conbo.IInjectable);

__denumerate(conbo.History.prototype);

/**
 * Default instance of the History class
 */
if (document)
{
	conbo.history = new conbo.History();
}
