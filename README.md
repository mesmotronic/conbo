ConboJS is the best JavaScript MVC framework you've never heard of.

It is a lightweight MVC application framework for JavaScript for use with modern browsers which enables developers a take a structured, decoupled, class based approach to application development, in a way that should be be familiar to anyone with experience of languages like ActionScript/Flex, C#/XAML or Java.

Features include extendible classes, event bus, dependency injection, data binding, command pattern, pseudo-interfaces and an easy to use event model with scoped event handling, plus simple view state management.

Development of ConboJS is focussed on single page applications (SPA) and self-contained modules, like widgets and media players, where it can be used stand-alone or as an AMD module, but also offers a great base for server-side Node.js applications.

Browser support
---------------

ConboJS targets the two most recent major releases of Firefox, Chrome (desktop and Android), Safari (desktop and iOS) and Internet Explorer / Edge.

Modular namespace declaration
-----------------------------

ConboJS brings the familiar concepts of packages and imports to JavaScript in the form of modular namespaces, optimised to work as an alternative to the commonly used minification pattern, for example:

```javascript
// Utils.js
conbo('com.example.utils', console, function(console)
{
	var utils = this;
	
	utils.doSomething = function(value)
	{
		console.log(value);
	};
});

// Constants.js
conbo('com.example.app', function()
{
	var app = this;

	app.BEST_FRAMEWORK = 'ConboJS';
	app.SMILE = ':-)';
});

// Main.js
conbo('com.example.app', window, document, navigator, function(window, document, navigator, undefined)
{
	// Import data from other namespaces
	var app = this;
	var utils = conbo('com.example.utils');
	
	// Your app code goes here

	utils.doSomething(app.BEST_FRAMEWORK+' makes me '+app.SMILE);
});
```

Extendible classes
------------------

There's no messing about with prototypes in ConboJS, all of your classes simply extend from another, for example:

```javascript
var MyClass = conbo.Class.extend
({
	initialize: function()
	{
		console.log('Welcome to my class!');
	}
});
```

Or if you're using ES2015:

```javascript
class MyClass extends conbo.Class
{
	initialize()
	{
		console.log('Welcome to my class!');
	}
}
```

Interfaces
----------

In ConboJS, an interface is a code snippet, in the form of a JavaScript Object, that you can apply to a class and test against, for example:

```javascript

var MyInterface = { getStuff: conbo.notImplemented };
var MyClass = conbo.Class.extend({getStuff:function(){ return 'Stuff!'; }}).implement(MyInterface);
var myInstance = new MyClass();

conbo.instanceOf(myInstance, MyInterface); // true
```

Any interface method specified as `conbo.notImplemented` *must* be implemented and an error will be thrown if they are not.

Unlike interfaces in languages such as Java or ActionScript, however, interfaces in ConboJS can contain default functionality, which will be used if the class has not implemented the interface in full, for example:

```javascript

var MyInterface = { logSomething: function() { conbo.log('Something!'); } };
var MyClass = conbo.Class.extend().implement(MyInterface);
var myInstance = new MyClass();

myInstance.logSomething(); // Outputs: "Something!"
```

Decoupling & data binding
-------------------------

One of ConboJS's core aims is to enable developers to create highly decoupled, testable code.

To this end, the framework's ever expanding data binding features enable you to separate your HTML from your JavaScript, removing the need for direct references between the them using `cb-*` and custom, developer defined, attributes to automatically bind properties and events in the DOM to your View classes, for example:

**In your View class**

```javascript
example.MyView = conbo.View.extend
({
	myButtonLabel: 'Click me!',
	
	myClickHandler: function(event)
	{
		alert('You clicked a button!');
	}
});
```

**In your HTML**

```html
<div cb-view="MyView">
	<button cb-onclick="myClickHandler" cb-html="myButtonLabel"></button>
</div>
```

Or if you prefer to use custom tag names, simply use a hyphenated, lower case version of your `View` or `Glimpse` class name:

```html
<my-view>
	<button cb-onclick="myClickHandler" cb-html="myButtonLabel"></button>
</my-view>
```

Consistent event model
----------------------

You don't have to remember how many arguments each event handler should have, or which order they're supposed to be in, because ConboJS has a single, consistent DOM-like event model that offers predictable results.

All events fired by the framework are `conbo.ConboEvent` event objects, and you can easily create events of your own by using or extending the `conbo.Event` class, for example:

```javascript
foo.addEventListener("myEvent", this.myFunction, this);
foo.dispatchEvent(new conbo.Event("myEvent"));
```

ES2015
------

If you're already using ES2015, or a transpiler like [Babel](https://babeljs.io/), you can import ConboJS into your ES2015 projects in the same way as any other ES2015 module and all ConboJS classes can be used with the standard `class...extends` syntax:

```javascript
import {conbo} from 'conbo';

conbo('com.example.es2015', function(undefined)
{
	class MyClass extends conbo.Class
	{
		// Your code here
	}
	
	// Properties in the return Object are automatically added to the namespace (optional)
	return {MyClass:MyClass};
}
```

Dependencies
------------

**Conbo**: jQuery 1.7+

**Conbo Lite**: None

**Server Side**: None

Builds
------

**conbo.js** (17KB minified+gzipped): Includes everything you need to build dynamic web application, including HttpService, RemoteHash and RemoteList classes for working with web services, and History and Router classes for browser integration.

**conbo-lite.js** (8KB minified+gzipped): A super-lightweight subset featuring extendible classes and consistent event model. The aim of this subset is to offer the benefits of Conbo's class structure and event model to users who want to create otherwise framework independent modules and code libraries.

Builds are created using Grunt, which requires Node.js; all required modules can be installed by running "npm install" from the command line in the project folder.

The builds listed above can be created using the command `grunt`. Use `grunt watch`, or run `watch.cmd` (Windows) or `./watch.sh` (Mac, Linux) to auto-build as you edit.

**GitHub** https://github.com/mesmotronic/conbo
**Docs** https://conbo.mesmotronic.com/