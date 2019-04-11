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

var currentUser;

function AddGamesPage(){
  window.location.href = 'AddGamesPage.html';
}
function ProfilePage(){
  window.location.href = 'ProfilePage.html';
}
function AboutPage(){
  window.location.href = 'about.html';
}
function MainPage(){
  window.location.href = 'MainPage.html';
}

function getVal(id){
    return document.getElementById(id).value;
}

document.getElementById('btnLogin').addEventListener('click',loginForm);
document.getElementById('btnSignup').addEventListener('click', signForm);
document.getElementById('btnSignout').addEventListener('click', signOut);
document.getElementById('btnProfilePage').addEventListener('click', ProfilePage);
document.getElementById('btnAddGamesPage').addEventListener('click', AddGamesPage);
document.getElementById('btnAboutPage').addEventListener('click', AboutPage);
document.getElementById('btnMainPage').addEventListener('click', MainPage)

function signForm(){
  
  var email = getVal('emailNew');
  var pass = getVal('confirm');
  var pass1 = getVal('passwordSignIn');

  if (pass == pass1){

    firebase.auth().createUserWithEmailAndPassword(email, pass).catch(function(error){
      // Handle Errors here.
      var errorCode = error.code;
      
      var errorMessage = error.message;

      window.alert(errorMessage)
      
    })  
  }
  else{
    window.alert("Passwords do not match")
  }
} 



function loginForm(){
  
  var email = getVal('email');
  var password = getVal('pass');
  
  firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    window.alert(errorMessage)
    // ...
  });

  

}

function signOut(){
  firebase.auth().signOut().then(function() {
    LogUserOut();
  }).catch(function(error) {
    // An error happened.
  });
}

function LogUserOut(){
  window.alert("Signed Out");
  window.location.href = 'index.html';
}

function LogUserIn(){
  document.getElementById("signupform").style.display = "none";
  document.getElementById("login").style.display = "none";
  document.getElementById("logout").style.display = "block";
  window.location.href = 'MainPage.html';
  window.alert("Welcome " + currentUser.email);

}

firebase.auth().onAuthStateChanged(function(user) {
  currentUser = user;
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
  } else {
    // No user is signed in.

  }
});
