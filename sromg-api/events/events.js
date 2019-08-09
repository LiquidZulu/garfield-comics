const EventEmitter = require('events');
const { JSDOM }    = require('jsdom');
const got          = require('got');
const FLAGS        = require('../const/FLAGS.js');
const Author       = require('../classes/author.js');
const Comic        = require('../classes/comic.js');


/**
 * wrapper for got calls, supports promises and functions
 * 
 * @author LiquidZulu, freenode
 * @param  {String}link  - The URL to read
 * @param  {Function}_cb - optional callback
 */

function readPage(link, _cb) {
    const prom = got(link);
    if(_cb) prom.then(_cb) 
    else return prom;
}


/**
 * Main container for the API functions, event driven to avoid async hell
 * 
 * @author  LiquidZulu
 * @extends {EventEmitter}
 */

class event_handler extends EventEmitter {


    init(ARGS){

        if(!ARGS){
            return;
        }
        
        try{

            switch(!!(ARGS.FLAGS & FLAGS.META_PARSER_PARSE_AUTHOR)){

                case true:{
                    {
                        this.initAuth(ARGS)
                          .then(r => {

                            switch(r){

                                case true:{
                                    {
                                        this.emit("AUTH_INIT_SUCCESS", this.author);

                                        if(!(ARGS.FLAGS & FLAGS.META_PARSER_NO_LOGS) && !(ARGS.FLAGS & FLAGS.META_PARSER_NO_EVENT_LOGS)){
                                            console.log(`NEW EVENT: AUTH_INIT_SUCCESS`);
                                        }
                                    }
                                    break;
                                }
    
                                case false:{
                                    {
                                        this.emit("AUTH_INIT_FAILURE", this.err);

                                        if(!(ARGS.FLAGS & FLAGS.META_PARSER_NO_LOGS) && !(ARGS.FLAGS & FLAGS.META_PARSER_NO_EVENT_LOGS)){
                                            console.log(`NEW EVENT: AUTH_INIT_FAILURE`);
                                        }
                                    }
                                    break;
                                }
                            };
                          })
                    }
                    break;
                }

                case false:{
                    {
                        this.initComic(ARGS)
                          .then(r => {

                            switch(r){

                                case true:{
                                    {
                                        this.emit("COMIC_INIT_SUCCESS", this.comic);

                                        if(!(ARGS.FLAGS & FLAGS.META_PARSER_NO_LOGS) && !(ARGS.FLAGS & FLAGS.META_PARSER_NO_EVENT_LOGS)){
                                            console.log(`NEW EVENT: COMIC_INIT_SUCCESS`);
                                        }
                                    }
                                    break;
                                }

                                case false:{
                                    {
                                        this.emit("COMIC_INIT_FAILURE", this.err);

                                        if(!(ARGS.FLAGS & FLAGS.META_PARSER_NO_LOGS) && !(ARGS.FLAGS & FLAGS.META_PARSER_NO_EVENT_LOGS)){
                                            console.log(`NEW EVENT: COMIC_INIT_FAILURE`);
                                        }
                                    }
                                    break;
                                }
                            }
                          });
                    }
                    break;
                }
            }

        }catch(e){
            try{
                if(!(ARGS.FLAGS & FLAGS.META_PARSER_NO_LOGS)){
                    throw (`SRoMG_META failed to init in constructor for following reason: ${e}`);
                }
            }catch(e){
                console.log(e)
                this.err = e;
            }
        }
    }


    /**
     * inits based on input being for author as indicated by the flags
     * 
     * @author  LiquidZulu
     * @param   {Object}ARGS - An object containig arguments for instantiating meta class
     * @returns {Boolean}    - Boolean indicating success of function
     */

    async initAuth (ARGS) {
        try{

            let res = await readPage(`http://www.mezzacotta.net/garfield/author.php?author=${ARGS.n}`)
            const { document } = (new JSDOM(res.body)).window;

            this.author = new Author(document)
            return true;

        }catch(e){
            try{
                if(!(ARGS.FLAGS & FLAGS.META_PARSER_NO_LOGS)){
                    throw (`SRoMG_META.event_handler failed to complete initAuth() for following reason: ${e}`);
                }
            }catch(e){
                console.log(e)
                this.err = e;
                return false;
            }
        }
    }


    /**
     * inits based on input being for comic as indicated by the flags
     * 
     * @author  LiquidZulu
     * @param   {Object}ARGS - An object containig arguments for instantiating meta class
     * @returns {Boolean}    - Boolean indicating success of function
     */

    async initComic(ARGS){

        try{

            let res = await readPage(`http://www.mezzacotta.net/garfield/?comic=${ARGS.n}`)
            const { document } = (new JSDOM(res.body)).window;

            this.comic = new Comic(document);
            return true;

        }catch(e){
            try{
                if(!(ARGS.FLAGS & FLAGS.META_PARSER_NO_LOGS)){
                    throw (`SRoMG_META.event_handler failed to complete initComic() for following reason: ${e}`);
                }
            }catch(e){
                console.log(e)
                this.err = e;
                return false;
            }
        }
    }


    /**
     * returns a Promise<Author> for a given author number
     * @param   {Number}n         - Author's number 
     * @returns {Promise<Author>}
     */

    async getAuthor(n){
        let res = await readPage(`http://www.mezzacotta.net/garfield/author.php?author=${n}`);
        const { document } = (new JSDOM(res.body)).window;
        return new Author(document);
    }


    /**
     * returns a Promise<Comic> for a given comic number
     * @param   {Number}n        - Comic's number 
     * @returns {Promise<Comic>}
     */

    async getComic(n){
        let res = await readPage(`http://www.mezzacotta.net/garfield/?comic=${n}`);
        const { document } = (new JSDOM(res.body)).window;
        return new Comic(document);
    }
};

module.exports = event_handler;

/**
 * Emitted after sucessfully instateating for a given author input.
 * this indicates that you may now process the information
 * 
 * @event AUTH_INIT_SUCCESS
 * @param {String}author    - identical to event_handler.author.
 * @see event_handler
 */


 /**
 * Emitted after unsucessfully instateating for a given author 
 * input. It is unlikely that the error originates from this
 * class so you may want to turn logs on to see whats happening.
 * 
 * @event AUTH_INIT_FAILURE
 * @param {String}err       - error information, identical to event_handler.err.
 * @see event_handler
 */



/**
 * Emitted after sucessfully instateating for a given comic input.
 * this indicates that you may now process the information
 * 
 * @event COMIC_INIT_SUCCESS
 * @param {String}author    - identical to event_handler.comic.
 * @see event_handler
 */


 /**
 * Emitted after unsucessfully instateating for a given comic input.
 * It is unlikely that the error originates from this class so you 
 * may want to turn logs on to see whats happening.
 * 
 * @event COMIC_INIT_FAILURE
 * @param {String}err       - error information, identical to event_handler.err.
 * @see event_handler
 */