var meta = require('./meta.js');

module.exports = (`
<!DOCTYPE html>
<html>
	
	<head>
	
		<title>${meta.title}</title>
        <meta name="description" content="${meta.desc}"/>
        <meta name="keywords" content="${meta.keywords}"/>
		<meta name="theme-color" content="#FF9900">
        <link rel='stylesheet' href='/style.css'/>
        
        <link rel="icon" type="image/png" href="http://media.liquidzulu.xyz/garf/GarfieldOnlyThirdPanel.png"/>
        
        
        <!-- Facebook Open Graph -->
	    <meta name="og:title" content="${meta.title}" />
	    <meta name="og:description" content="${meta.desc}" />
	    <meta name="og:image" content="http://media.liquidzulu.xyz/garf/GarfieldOnlyThirdPanel.png" />
	    <meta name="og:type" content="article" />
	    <meta name="og:url" content="${meta.url}" />
	    <!-- Facebook Open Graph end -->
	    
	    
	    
	    <!-- Twitter Card Tags -->
	
		<meta name="twitter:card" content="summary_large_image">
		<meta name="twitter:site" content="@LiquidZulu">
		<meta name="twitter:creator" content="@LiquidZulu">
		<meta name="twitter:title" content="${meta.title}">
		<meta name="twitter:description" content="${meta.desc}">
		<meta name="twitter:image" content="http://media.liquidzulu.xyz/garf/GarfieldOnlyThirdPanel.png">
	
	</head>
	
	<body>
		
    <h1 id='pageTitle'>Garfield Comics Bot</h1>
    <div class='buttonWrapper'><a href="${meta.invite}"><button type="button" class="invitebutton"><img src="https://discordapp.com/assets/1c8a54f25d101bdc607cec7228247a9a.svg" alt="Discord Logo">Add to Discord</button></a></div>
    <img src='http://media.liquidzulu.xyz/garf/GarfieldOnlyThirdPanel.png' id='backgroundImage'/>
    <center>
      <a href='${meta.source}' class='sourceURL'>Source Code</a>
      <div class='desc'>
        <p>Garfield Comics is a bot written in node using <a href='https://discord.js.org/#/'>Discord.js</a> and <a href='https://www.npmjs.com/package/twit'>Twit</a> by <a href='http://liquidzulu.xyz/'>LiquidZulu</a>. The bot has the capability to automatically post the daily Garfield comic and the daily <a href='http://www.mezzacotta.net/garfield/about.php'>SRoMG</a> comic through the use of a custom built and unique (as of writing this) API. In addition to this, the bot has a multitude of commands for finding entertaining comics as described in the helptext below or by typing '$help' in a channel the bot can message.</p>
      </div>
      <a href='./feedback' class='feedbackURL'>Send Me Feedback or Get Support</a><br/><br/>
      <a href='./API' class='feedbackURL'>API Reference</a>
    </center>
      
    <div class="helpText">
      <div class="helpTextInner" style='display: inline-block; position: relative;'>
        <div class="helpTextAuthorWrapper">
          <span class="helpTextAuthor">Garfield Comics Bot | By LiquidZulu</span>
        </div>
        
        <div class="helpTextMargin">
          <a tabindex="0" class="helpTextTitle" href="https://discordapp.com/oauth2/authorize?client_id=343741669507858442&amp;scope=bot&amp;permissions=540400640" rel="noreferrer noopener" target="_blank" role="button">Invite me to your server here</a>
        </div>
        
        <div class="helpTextDescription">
          
          <strong>---You can get support or send feedback <a href='https://garfield-comics.glitch.me/feedback'>here</a> or just DM this bot---</strong><br/><br/>
          
          All commands need to be prefaced with the prefix: '$' or '$$' for SRoMG specific commands. EXCEPT for 'Show Comic/SRoMG' which can be on their own and have any capitalisation. <strong>All commands case insensitive.</strong><br/>

          Alternatively, 'g.' can be used as a prefix where todays comic is g.today and you can search with g.YYYY-MM-DD
          HGrunt (ID: 396884008501510144), aka Metal Davis on Church of Jim Davis, syntax can also be used so:
          <strong>!garfeild // !gf // !gar [latest // YYYY-MM-DD]</strong>
        
        </div>
        
        
        <div class="helpTextFields">
          <div class="field">
            <div class="fieldTitle">Show Comic</div>
            <div class="fieldValue">Displays the daily comic.</div>
          </div>
          <div class="field">
            <div class="fieldTitle">Show SRoMG</div>
            <div class="fieldValue">Displays the daily comic.</div>
          </div>
          <div class="field">
            <div class="fieldTitle">$init garf/sromg</div>
            <div class="fieldValue">will set the channel sent in as the channel to send comics in daily</div>
          </div>
          <div class="field">
            <div class="fieldTitle">$RandComic</div>
            <div class="fieldValue">Displays a random Garfield comic.</div>
          </div>
          <div class="field">
            <div class="fieldTitle">$Search DATE DATE_FORMAT</div>
            <div class="fieldValue">Shows the comic from a specific date where DATE_FORMAT is the order of year month and day eg: YYYY-MM-DD. You can use upper or lower case and 1 or more characters but must use '-' to splt up the date.</div>
          </div>
          <div class="field">
            <div class="fieldTitle">$api || $source</div>
            <div class="fieldValue">Either $api or $source can be used to display the information website.</div>
          </div>
        </div>
      
      </div>
      
      <img alt="" src="https://images-ext-2.discordapp.net/external/5TIyba39663Lu5H3O6cduz4-b0sD9rkoiQoFnnlDIjs/https/b.thumbs.redditmedia.com/qB90pJUPuQExAp6bYbLAZrvGH1hO7U7bG0IrugEW13E.png?width=80&amp;height=70" style="width: 80px; height: 69px; display: inline-block; position: relative;">
        
    </div>
      
      
    <div id='LISENCE'>
      <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/3.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-nc-sa/3.0/88x31.png" /></a><span class='hide'><br />This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/3.0/">Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License</a>.</span>  
    </div>
      
      
	</body>
	
</html>
`);