

function submitForm(){
  var formData = {};
  
  getData(formData, (formData) => {
      
    if(formData.message.value){
      
      if(!formData.author.value){formData.author.value = 'ANONYMOUS USER'}
      
      var http = new XMLHttpRequest();
      var url = 'https://garfield-comics.glitch.me/~POST';
      var params = `author=${formData.author.value}&message=${formData.message.value}`;
      http.open('POST', url, true);
      
      //Send the proper header information along with the request
      http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
      
      http.onreadystatechange = () => {//Call a function when the state changes.
          if(http.readyState == 4 && http.status == 200) {
              alert(http.responseText);
              window.location.replace('https://garfield-comics.glitch.me/');
          }
      }
      http.send(params);
    }else{alert('Please enter a message.');}
  })
}

async function getData(formData, _callback){
  formData = await {
    author: document.getElementById('feedbackAuthor'),
    message: document.getElementById('feedbackMessage')
  };
  _callback(formData);
}