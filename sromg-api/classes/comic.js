/**
 * @this Comic
 */
class Comic {


    /**
     * A class to generate comic objects for given DOM objects
     * 
     * @constructor
     * @author      LiquidZulu
     * @param       {Object}document - DOM object for comic page
     */

    constructor(document){
        
        let comic = document.getElementsByTagName('IMG')[1];
        let author = (() => {
            if(document.getElementsByTagName('A')[20].href.substring(0, 28) == '/garfield/author.php?author='){
                return document.getElementsByTagName('A')[20]
            }
            else{
                for(let a of document.getElementsByTagName('A')){
                    if(a.href.substring(0, 28) == '/garfield/author.php?author='){
                        return a
                    }
                }
            }
            return {
                innerHTML: undefined,
                href: ''
            }
        })();

        let ps = document.getElementsByTagName('P');
        let authorWritesI = (() => {
            for(var i=0; i<ps.length; i++){
                if(ps[i].innerHTML == `<b>The author writes:</b>`){
                    return i;
                }
            }

            return undefined;
        })()


        /**
         * Title of the comic
         * 
         * @type     {String}
         */
        this.name = comic.alt

        /**
         * Number of the comic
         * 
         * @type     {Number}
         */
        this.number = Number(comic.src.split('comics/')[1].split('.')[0])

        /**
         * Data on the actual image for the comic
         * 
         * @type     {Object}
         * @property {String}src - src of the image
         * @property {Number}x   - width of the image
         * @property {Number}y   - height of the image
         */
        this.image = {
            src: `http://www.mezzacotta.net${comic.src}`,
            x: Number(comic.width),
            y: Number(comic.height)
        }

        /**
         * Data for the author of the comic
         * 
         * @type     {Object}
         * @property {String}name   - Name of the author
         * @property {String}number - Authors number
         */
        this.author = {
            name: author.innerHTML,
            number: Number(author.href.split('=')[1])
        }

        /**
         * The provided transcription, no guarantee that this is accurate
         * 
         * @type     {String}
         */
        this.transcription = document.getElementsByTagName('P')[authorWritesI-1].innerHTML

        /**
         * The authors notes on the comic WITH ALL HTML TAGS STILL INCLUDED, you may want to translate this to markdown applicable to your solution
         * 
         * @type     {String}
         */
        this.authorWrites = (() => {
            let AN = '';
            let cont = true;

            for(var i=authorWritesI+1; cont; i++){
                if(ps[i] !== undefined && i<128){
                    if(/\[\[Original/.exec(ps[i].innerHTML) == null && i<128){
                        AN += ps[i].innerHTML
                    }
                    else{
                        return AN
                    }
                }
                else{
                    return AN
                }
            }
        })()

        /**
         * An array of objects of each of the original strips along with the link to that comics image, will not work for dates past 2099 so if you are an alien from the far future the you may want to edit the regex below this comment
         * 
         * @type     {Object[]}
         */
        this.originalStrips = (() => {
            let strips = [];
            let stripsDone = [];
            let as = document.getElementsByTagName('A');

            for(var a of as){
                if(/(19|20){1}[0123456789]{2}-[0123456789]{2}-[0123456789]{2}/.test(a.innerHTML) && stripsDone.indexOf(a.innerHTML) == -1){
                    strips.push({strip: a.innerHTML, href: a.href});
                    stripsDone.push(a.innerHTML)
                }
            }

            return strips;
        })()
    
    }


    /**
     * @type     {String}
     * @see      this.name
     */

    get getName(){
        return this.name;
    }


    /**
     * @type     {String}
     * @see      this.number
     */

    get getNumber(){
        return this.number;
    }


    /**
     * @type     {Object}
     * @see      this.image
     */

    get getImage(){
        return this.image;
    }


    /**
     * @type     {Object}
     * @see      this.author
     */

    get getAuthor(){
        return this.author;
    }


    /**
     * @type     {String}
     * @see      this.transcription
     */

    get getTranscription(){
        return this.transcription;
    }


    /**
     * @type     {String}
     * @see      this.authorWrites
     */

    get getAuthorsNote(){
        return this.authorWrites;
    }
    get getAuthorWrites(){
        return this.authorWrites;
    }
    get getDescription(){
        return this.authorWrites;
    }
    get getDesc(){
        return this.authorWrites;
    }


    /**
     * @type     {Object[]}
     * @see      this.originalStrips
     */

    get getOriginalStrips(){
        return this.originalStrips;
    }
    get getStrips(){
        return this.originalStrips;
    }
    get getComicStrips(){
        return this.originalStrips;
    }
    get getComics(){
        return this.originalStrips;
    }
}

module.exports = Comic