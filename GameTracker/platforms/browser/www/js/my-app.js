// Initialize app
var myApp = new Framework7();


// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we want to use dynamic navbar, we need to enable it for this view:
    dynamicNavbar: true
});

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {
    console.log("Device is ready!");
});


// Now we need to run the code that will be executed only for About page.

// Option 1. Using page callback for page (for "about" page in this case) (recommended way):
myApp.onPageInit('about', function (page) {
    // Do something here for "about" page

})

// Option 2. Using one 'pageInit' event handler for all pages:


// Option 2. Using live 'pageInit' event handlers for each page

//Initialize Fire Base






function getVal(id){
    return document.getElementById(id).value;
}

//document.getElementById('signUpForm').addEventListener('submit',signForm);
document.getElementById('login').addEventListener('submit', signForm);

function signForm(){
  
  var email = getVal('email');
  var pass = getVal('pass');
  

  firebase.auth().createUserWithEmailAndPassword(email, pass).catch(function(error){
    // Handle Errors here.
    var errorCode = error.code;
    
    var errorMessage = error.message;
    
  })

  
} 



function loginForm(){
  
  var email = getVal('email');
  var password = getVal('pass');

  firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // ...
  });

}

