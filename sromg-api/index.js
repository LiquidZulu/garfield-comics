const FLAGS = require('./const/FLAGS.js');

/**
 * Parent object for this module
 * 
 * @author   LiquidZulu
 * @see      event_handler
 * @property {event_handler}META - Main container for the API functions, event driven to avoid async hell
 * @property {String}version     - module version
 */

module.exports = {

    META:    require('./events/events.js'),
    FLAGS:   FLAGS,
    version: "2.0.0",
    Comic:   require('./classes/comic.js'),
    author:  require('./classes/author.js')
}