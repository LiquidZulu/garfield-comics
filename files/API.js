var meta = {
	title: 'Garfield Comics API',
	desc: 'Webpage for Garfield Comics Discord bot API.',
	keywords: 'garfield,comics,discord,bot,square,root,of,minus,garfield,sromg,lasagnacat,jim,davis,first,church,of,the,latter,day,garfieldists,API,SRoMG API',
	url: 'https://garfield-comics.glitch.me/API',
	invite: 'https://discordapp.com/oauth2/authorize?client_id=343741669507858442&scope=bot&permissions=540400640',
  source: 'https://glitch.com/edit/#!/garfield-comics'
}

module.exports = (`
${'<!DOCTYPE html>'}
<html>
  
  <head>
    
    <!-- Create a simple CodeMirror instance -->
    <script src="https://codemirror.net/lib/codemirror.js"></script>
    <link rel="stylesheet" href="https://codemirror.net/lib/codemirror.css">
    <link rel="stylesheet" href="https://codemirror.net/addon/fold/foldgutter.css" />
    <script src="https://codemirror.net/lib/codemirror.js"></script>
    <script src="https://codemirror.net/addon/fold/foldcode.js"></script>
    <script src="https://codemirror.net/addon/fold/foldgutter.js"></script>
    <script src="https://codemirror.net/addon/fold/brace-fold.js"></script>
    <script src="https://codemirror.net/addon/fold/xml-fold.js"></script>
    <script src="https://codemirror.net/addon/fold/indent-fold.js"></script>
    <script src="https://codemirror.net/addon/fold/markdown-fold.js"></script>
    <script src="https://codemirror.net/addon/fold/comment-fold.js"></script>
    <script src="https://codemirror.net/mode/javascript/javascript.js"></script>
    <script src="https://codemirror.net/mode/xml/xml.js"></script>
    <script src="https://codemirror.net/mode/css/css.js"></script>
    <script src="https://codemirror.net/mode/htmlmixed/htmlmixed.js"></script>
    <script src="https://codemirror.net/mode/python/python.js"></script>
    <script src="https://codemirror.net/mode/markdown/markdown.js"></script>

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
    

    <h1 id='pageTitle'><a id='pageTitle' href='../'>${meta.title}</a></h1>
    <img src='http://media.liquidzulu.xyz/garf/GarfieldOnlyThirdPanel.png' id='backgroundImage'/>
    <center>
      <div class='desc'>
        This page contains documentation for the Garfield Comics API, thus far you can use this API to access the custom built SRoMG API and any future API's I make for this bot will be detailed here. <br/><br/>You can access a JSON discord embed for a specific SRoMG comic by going to https://garfield-comics.glitch.me/~SRoMG/[?date=XXXXX // ?SRoMG_NUM=XXXXX // ?url=URL_OF_SRoMG] where you either pass in a date which can be a Javascript Date object or a string in the form YYYY-MM-DD or you can pass in SRoMG_NUM which is the comic number ie 2812 which is the 2812th comic at: <a href='http://www.mezzacotta.net/garfield/?comic=2812'>http://www.mezzacotta.net/garfield/?comic=2812</a>. <br/><strong>If you don't wish to cut a query for SRoMG comic down to the number or the date you can pass in either the image url i.e. http://www.mezzacotta.net/garfield/comics/XXXX.png or the webpage i.e. http://www.mezzacotta.net/garfield/?comic=XXXX.<br/>RegExp is used to extract the necessary data from this url so all that needs to be in tact is either ["?comic="] or ["XXXX.png"] and any capitilasation can be used in the url.</strong>
      </div><br/><br/>
      <textarea rows='18' wrap='off' id="API_TEST_TEXTAREA" name='API_TEST_TEXTAREA' class='apiTest'>
${require('./API_TEST.js').discord_js}</textarea><br/><br/>
      <textarea rows='18' wrap='off' id="API_TEST_TEXTAREA_DISCORD_IO" name='API_TEST_TEXTAREA_DISCORD_IO' class='apiTest'>
${require('./API_TEST.js').discord_io}</textarea><br/><br/>
      <textarea rows='18' wrap='off' id="API_TEST_TEXTAREA_ERIS" name='API_TEST_TEXTAREA_ERIS' class='apiTest'>
${require('./API_TEST.js').eris}</textarea><br/><br/>
      <textarea rows='18' wrap='off' id="API_TEST_TEXTAREA_PSEUDOCODE" name='API_TEST_TEXTAREA_PSEUDOCODE' class='apiTest'>
${require('./API_TEST.js').pseudocode}</textarea><br/><br/>
      <a href='./feedback' class='feedbackURL'>Send Me Feedback or Get Support</a>
    </center>
    
    <script>
      try{
        var textarea = document.getElementById('API_TEST_TEXTAREA');
      }catch(e){console.error(e)}finally{
        window.editor = CodeMirror.fromTextArea(textarea, {
          lineNumbers: true,
          theme: 'eclipse',
          mode: 'javascript',
          lines: 17,
          rows: 17,
          smartIndent: false,
          indentWithTabs: true,
          indentUnit: 0,
          direction: 'ltr',
          extraKeys: {"Ctrl-Q": function(cm){ cm.foldCode(cm.getCursor()); }},
          foldGutter: true,
          gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
          matchBrackets: true
        });
        window.editor.foldCode(CodeMirror.Pos(13, 0));
      }
      
      try{
        var textarea = document.getElementById('API_TEST_TEXTAREA_DISCORD_IO');
      }catch(e){console.error(e)}finally{
        window.editor = CodeMirror.fromTextArea(textarea, {
          lineNumbers: true,
          theme: 'eclipse',
          mode: 'javascript',
          lines: 17,
          rows: 17,
          smartIndent: false,
          indentWithTabs: true,
          indentUnit: 0,
          direction: 'ltr',
          extraKeys: {"Ctrl-Q": function(cm){ cm.foldCode(cm.getCursor()); }},
          foldGutter: true,
          gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
          matchBrackets: true
        });
        window.editor.foldCode(CodeMirror.Pos(13, 0));
      }
      
      try{
        var textarea = document.getElementById('API_TEST_TEXTAREA_ERIS');
      }catch(e){console.error(e)}finally{
        window.editor = CodeMirror.fromTextArea(textarea, {
          lineNumbers: true,
          theme: 'eclipse',
          mode: 'javascript',
          lines: 17,
          rows: 17,
          smartIndent: false,
          indentWithTabs: true,
          indentUnit: 0,
          direction: 'ltr',
          extraKeys: {"Ctrl-Q": function(cm){ cm.foldCode(cm.getCursor()); }},
          foldGutter: true,
          gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
          matchBrackets: true
        });
        window.editor.foldCode(CodeMirror.Pos(13, 0));
      }
      
      try{
        var textarea = document.getElementById('API_TEST_TEXTAREA_PSEUDOCODE');
      }catch(e){console.error(e)}finally{
        window.editor = CodeMirror.fromTextArea(textarea, {
          lineNumbers: true,
          theme: 'eclipse',
          mode: 'text/x-markdown',
          lines: 17,
          rows: 17,
          smartIndent: false,
          indentWithTabs: true,
          indentUnit: 0,
          direction: 'ltr',
          extraKeys: {"Ctrl-Q": function(cm){ cm.foldCode(cm.getCursor()); }},
          foldGutter: true,
          gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
          matchBrackets: true
        });
        window.editor.foldCode(CodeMirror.Pos(13, 0));
      }
    </script>
      
  </body>

  

</html>

`);