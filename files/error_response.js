var responses = require('./responses_collection.js');
/**
 * @param {Object} [data]
 */

module.exports = class errResponse {
  constructor(response){
    
    if(typeof response !== 'string'){response = `${response}`}
    
    /**
     * @type {integer}
     */
    
    this.response = responses.find('code', response);
    
    
    /**
     * @type {string}
     */
    
    this.title = this.response.message;
    
    
    /**
     * @type {string}
     */
    
    this.desc = this.response.description;
    
    
    this.errPage = `
      ${"<!DOCTYPE html>"}
      <html>

        <head>

          <title>ERROR ${this.response.code}: ${this.title}</title>
          <link rel='stylesheet' href='https://garfield-comics.glitch.me/style.css'/>
          <link rel="icon" type="image/png" href="http://media.liquidzulu.xyz/garf/GarfieldOnlyThirdPanel.png"/>

        </head>


        <body>
  
          <h1 id='pageTitle'>HTTP ERROR ${this.response.code}: ${this.title}</h1>
          <img src='http://media.liquidzulu.xyz/garf/GarfieldOnlyThirdPanel.png' id='backgroundImage'/>
  
          <center>
            <a href='./' class='sourceURL'>Return to Homepage</a>
            <div class='desc'>
              <p>${this.desc}</p>
            </div>
          </center>
  
  
        </body>
      </html>`;
    
  }
  
  setTitle(title){
    this.title = title
  }
  
  setDesc(desc){
    this.desc = desc
  }
  
  setErrPage(errPage){
    this.errPage = errPage;
  }
}