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

function getVal(id){
  return document.getElementById(id).value;
}
function clearVal(id){
  document.getElementById(id).value = '';
}

document.getElementById('btnSignup').addEventListener('click', signForm);

function signForm(){
  
  var email = getVal('emailNew');
  var pass = getVal('confirm');
  var didItWork = true;

  firebase.auth().createUserWithEmailAndPassword(email, pass).catch(function(error){
    // Handle Errors here.
    var errorCode = error.code;
    didItWork = false;
    var errorMessage = error.message;
    console.log(errorMessage);
  })
 
  if(didItWork){
    clearVal('emailNew');
    clearVal('passwordSignIn');
    clearVal('confirm');
  }
  else{
    window.alert('Account Creation was not successful');
  }
  
} 

document.getElementById('btnLogin').addEventListener('click', loginForm);

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
document.getElementById('btnSignout').addEventListener('click', signout);

function signout(){
  firebase.auth().signOut().then(function() {
    // Sign-out successful.
  }).catch(function(error) {
    // An error happened.
  });
}

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
          // User is signed in.
  if (!firebase.auth().currentUser.emailVerified){
    user.sendEmailVerification().then(function() {
      // Email sent.
      window.alert("Verification email sent");
      firebase.auth().signOut().then(function() {
          //Signed out
      }).catch(function(error) {
        // An error happened.
      });
    }).catch(function(error) {
      window.alert("Please verify your email");
    });
  }
  else{
    LogUserIn();
  }

function getUser(){
  return firebase.auth().currentUser();
}