var meta = {
	title: 'Garfield Comics Feedback',
	desc: 'Send feedback and suggestions to me if you wish to see changes to the bot. Alternatively you can recieve support for any issues you may be having',
	keywords: 'garfield,comics,discord,bot,square,root,of,minus,garfield,sromg,lasagnacat,jim,davis,first,church,of,the,latter,day,garfieldists',
	url: 'https://garfield-comics.glitch.me/feedback',
	invite: 'https://discordapp.com/oauth2/authorize?client_id=343741669507858442&scope=bot&permissions=540400640',
  source: 'https://glitch.com/edit/#!/garfield-comics'
}

module.exports = `
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
    
    <h1 id='pageTitle'>Send me Feedback or ask Support Questions</h1>
    <div class='formWrapper'>
      <input type='text' name='feedbackAuthor' id='feedbackAuthor' class='feedbackAuthor' placeholder='Your name'/>
      <textarea type='text' name='feedbackMessage' id='feedbackMessage' class='feedbackMessage' placeholder='Input feedback here' rows='16'></textarea>
      <button type="button" class="submitButton" id='submit' onClick='submitForm()'>Submit</button>
    </div>
    <img src='http://media.liquidzulu.xyz/garf/GarfieldOnlyThirdPanel.png' id='backgroundImage'/>
    <center>
      <div class='desc'>
        <p>${meta.desc}</p>
      </div><br/><br/>
      <a href='${meta.source}' class='sourceURL'>Source Code</a>
    </center>
    
    <script async src='./feedback-client.js'></script>
    
  </body>
      
</html>
`