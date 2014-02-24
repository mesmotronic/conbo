/* 
 * A quick tweak for Lo-Dash/Underscore.js to enable it to differentiate
 * between functions and classes
 * 
 * @author		Neil Rackett
 */

var _isFunction = _.isFunction;

_.isClass = function(value)
{
	return value instanceof conbo.Class;
};

_.isFunction = function(value)
{
	return _isFunction(value) && !_.isClass(value);
};