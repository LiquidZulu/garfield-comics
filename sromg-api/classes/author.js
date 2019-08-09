/**
 * @this Author
 */
class Author {


    /**
     * A class to generate author objects for given DOM objects
     * 
     * @constructor
     * @author      LiquidZulu
     * @param       {Object}document - DOM object for author page, set document.authNo if you want an accurate author number
     * @throws                       - Will throw an exception if one of the links in the comic list is more than 128 characters long before finding the comic
     */

    constructor(document){

        /**
         * @type     {String}
         */
        this.name = document.getElementsByTagName("H3")[0].innerHTML;

        /**
         * @type     {Number}
         */
        this.number = Number(document.authNo);

        /**
         * @type     {String}
         */
        this.bio = document.getElementsByTagName("P")[1].innerHTML;

        /**
         * @type     {Object}
         */
        this.comics = (() => {
            let list = document.getElementsByTagName("P")[2].innerHTML.split('|');
            
            /**
             * @property {Number[]} comics
             * @property {Number}   buffer
             */
            let toReturn = {comics: [], buffer: 0};

            for(var i=0; i < list.length; i++){

                if(i == list.length - 1){

                    let buffno = '';
                    let cont = true;
                    for(var j=5; cont; j++){
                        if(list[i][j] == ' '){
                            cont=false;
                        }else{
                            buffno += list[i][j];
                        }
                    }

                    toReturn.buffer = Number(buffno)
                }


                else{

                    let thisComic = '';
                    let cont = true;

                    for(var j=15; cont; j++){

                        if(j>=128) throw `Comic list index ${i} is too long to parse`
                        if(i == 0 && j==15) j+=15
                                
                        if(list[i].substring(j, j+7) == '?comic='){
                            cont=false;
                            j+=7;

                            while(list[i][j] !== '"' && list[i][j] !== "'"){
                                thisComic += list[i][j++]
                                if(j>=128) throw `Comic list index ${i} is too long to parse`
                            }
                        }
                    }

                    toReturn.comics.push(Number(thisComic));
                }
            }

            return toReturn;
        })()
    };


    /**
     * @type {String}
     */

    get getName(){
        return this.name;
    }


    /**
     * @type {String}
     */

    get getNumber(){
        return this.number;
    }


    /**
     * @type     {String}
     */

    get getBio(){
        return this.bio;
    }
    get getBiography(){
        return this.bio;
    }


    /**
     * @type {String}
     */

    get getComics(){
        return this.comics;
    }


    /**
     * @type     {String}
     * @param    {Number}n - array index to retreive
     */

    getComic(n){
        return this.comics[n];
    }
}

module.exports = Author