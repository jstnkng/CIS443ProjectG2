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
var gameArray = [];
var hrArray = [];

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
document.getElementById('btnMainPage').addEventListener('click', MainPage);
document.getElementById('btnAdd').addEventListener('click', addGames);


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

if (document.getElementById("btnForgotPassword")){
  document.getElementById('btnForgotPassword').addEventListener('click', ResetPassword);
}

function ResetPassword(){
  var auth = firebase.auth();
  var emailAddress = document.getElementById("email").value;

auth.sendPasswordResetEmail(emailAddress).then(function() {
  window.alert("Check your inbox to reset your password!");
}).catch(function(error) {
  window.alert(error.message);
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
  window.location.href = 'index.html';
  if (document.getElementById('emailNew'))
    document.getElementById('emailNew').value = "";
  if (document.getElementById('passwordSignIn'))
    document.getElementById('passwordSignIn').value = "";
  if (document.getElementById('confirm'))
    document.getElementById('confirm').value = "";

}

function LogUserIn(){
  //if (document.getElementById("signupform"))
    document.getElementById("signupform").style.display = "none";
  //if (document.getElementById("login"))
    document.getElementById("login").style.display = "none";
  document.getElementById("logout").style.display = "block";
  window.location.href = 'MainPage.html';
}

var mesRef = firebase.database().ref('games');
function addGames(){
  var cType = getVal('console');
  var game = getVal('gametitle');
  var hrs = getVal('hours');
  var email = currentUser.email;
  var ddlConsoles = document.getElementById('console');
  if (ddlConsoles)
    var cType = ddlConsoles.options[ddlConsoles.selectedIndex].text;
  saveMessage(game, hrs, email, cType);
}


function saveMessage(game, hours, email, cType){
  var newMesRef = mesRef.push();
  newMesRef.set({
    cType:cType,
    game:game,
    hours:hours,
    email:email,
    cType:cType
  });
  document.getElementById("gametitle").value = "";
  document.getElementById("hours").value = "";
  document.getElementById("console").value = "";
  addAllGames();
}

firebase.auth().onAuthStateChanged(function(user) {
  currentUser = user;
  if (user) {
          // User is signed in.
  if (!firebase.auth().currentUser.emailVerified){
    user.sendEmailVerification().then(function() {
      // Email sent.
      window.alert("Verification email sent");
      LogUserOut();
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
var chart;

window.onload = function(){
  createChart();
  addAllGames();  
}
 
//Grabs data from database, then if it relevant to the user it puts into the respective arrays.
function addAllGames(){
  var modifyGamesList = document.getElementById("modifyGamesList");
  if (modifyGamesList){
    while (modifyGamesList.firstChild){
      modifyGamesList.removeChild(modifyGamesList.firstChild);
    }
  }
  var gamesRef = firebase.database().ref('games').orderByKey();
  gameArray.length = 0;
  hrArray.length = 0;
  var totalHours = 0;
  var totalPoints = 0;
  var counter = 0;
  var mostHours = 0;
  var leastHours = 999999;
  gamesRef.once('value').then(function(snapshot){
    snapshot.forEach(function (childSnapshot){  
        var email = childSnapshot.child('email').val();
        var gameTitle = childSnapshot.child('game').val();
        var hrs = childSnapshot.child('hours').val();
        var cType = childSnapshot.child('cType').val();
        if(email == currentUser.email){
          if (document.getElementById("WelcomeHeader")){
            if (currentUser.displayName)
              document.getElementById("WelcomeHeader").innerHTML = "Welcome " + currentUser.displayName + "!";
            else
              document.getElementById("WelcomeHeader").innerHTML = "Welcome!";
          }
          if (document.getElementById("userDisplayName")){
            document.getElementById("userDisplayName").value = currentUser.displayName;
            }
          var game = {key: childSnapshot.key, title: gameTitle, hours: hrs, consType: cType};
          counter++;
          var gameRow = document.createElement("tr");
          var title = document.createElement("td");
          var hours = document.createElement("td");
          var points = document.createElement("td");
          var conType = document.createElement('td');
          title.innerHTML = game.title;
          title.style="text-align: left;"
          hours.innerHTML = hrs;
          hours.style="text-align: right;"
          var gameHours = parseInt(hrs);
          totalHours += gameHours;
          var gamePoints = 5 + (0.5 * gameHours);
          totalPoints += gamePoints;
          points.innerHTML = gamePoints;
          points.style="text-align: right;"
          conType.innerHTML = cType;
          conType.style = "text-align: center;"
          gameRow.appendChild(title);
          gameRow.appendChild(conType);
          gameRow.appendChild(hours);
          gameRow.appendChild(points);
          

          if (document.getElementById("gamesList")){
            document.getElementById("gamesList").appendChild(gameRow);
          }

          var modifyGameRow = document.createElement("tr");
          var modifyTitle = document.createElement("td");
          var modifyConsole = document.createElement("td");
          var modifyHours = document.createElement("input");
          modifyTitle.innerHTML = game.title;
          modifyConsole.innerHTML = game.consType;
          modifyHours.type = "text";
          modifyHours.style = "text-align: center";
          modifyHours.value = game.hours;
          modifyGameRow.appendChild(modifyTitle);
          modifyGameRow.appendChild(modifyConsole);
          modifyGameRow.appendChild(modifyHours);

          if (document.getElementById("modifyGamesList")){
            document.getElementById("modifyGamesList").appendChild(modifyGameRow);
          }

          if (gameHours > mostHours){
            if (document.getElementById("GameMostPlayed")){
              document.getElementById("GameMostPlayed").innerHTML = gameTitle;
              mostHours = gameHours;
            }
          }

          if (gameHours < leastHours){
            if (document.getElementById("GameLeastPlayed")){
              document.getElementById("GameLeastPlayed").innerHTML = gameTitle;
              leastHours = gameHours;
            }
          }
          gameArray.push(game);
          if (chart){
          chart.options.data[0].dataPoints.push({ y: gameHours, label: gameTitle});
          chart.render();
          }
        }       
        
    });

    if (document.getElementById("totalHours"))
      document.getElementById("totalHours").innerHTML = totalHours; 
    if (document.getElementById("UserPoints")){
        document.getElementById("UserPoints").innerHTML = "Total Points: " + totalPoints;
        }
    if (document.getElementById("totalPoints"))  
      document.getElementById("totalPoints").innerHTML = totalPoints;
    console.log(gameArray);
    console.log(hrArray);
  });
}

function createChart() {
  if (document.getElementById("chartContainer")) {                                
  chart = new CanvasJS.Chart("chartContainer", {
      animationEnabled: true,
      theme: "light2",
      title: {
          text: "Hours Played By Game"
      },
      axisY: {
        title: "Hours"
      },
      data: [{
          type: "column",
          dataPoints: []
      }]
  });
  chart.render();
  } 
}

if(document.getElementById('btnSubmitChanges')){
  document.getElementById('btnSubmitChanges').addEventListener('click', changeHours);
}


function changeHours(){
  if(document.getElementById('modifyGamesList')){
    var myTable = document.getElementById('modifyGamesList');
    var tableRows = myTable.rows.length;
    for (var i = 0; i < tableRows; i++) {
      var gameRow = myTable.rows[i];
      var gameHoursValue = gameRow.childNodes[2].value;
      var gameHours = parseInt(gameHoursValue);
      gameArray[i].hours = gameHours;
    }
  }
  gameArray.forEach(function(game){
    var gamesRef = firebase.database();
    gamesRef.ref("games/" + game.key).update({hours: game.hours});
    console.log(game.hours);
  })

  window.alert("Saved changes");
}

if (document.getElementById("btnUpdateName")){
  document.getElementById('btnUpdateName').addEventListener('click', updateName);
}

function updateName(){
  currentUser.updateProfile({
    displayName: document.getElementById("userDisplayName").value,
  }).then(function() {
    window.alert("Profile update successfully");
  }).catch(function(error) {
    // An error happened.
  });
}

if (document.getElementById("btnUpdatePassword")){
  document.getElementById('btnUpdatePassword').addEventListener('click', ReAuthenticateUser);
}

function ReAuthenticateUser(){
  var credential = firebase.auth.EmailAuthProvider.credential(
    currentUser.email,
    document.getElementById("UserOldPassword").value
  );

  currentUser.reauthenticateAndRetrieveDataWithCredential(credential).then(function() {
    updatePassword();
  }).catch(function(error) {
   window.alert(error.message);
  });
}

function updatePassword(){
  var newPassword = document.getElementById("UserNewPassword").value;
    currentUser.updatePassword(newPassword).then(function() {
      window.alert("Password updated successfully");
      if (document.getElementById("UserNewPassword"))
        document.getElementById("UserNewPassword").value = "";
      if (document.getElementById("UserOldPassword"))
        document.getElementById("UserOldPassword").value = "";
      // Update successful.
    }).catch(function(error) {
      window.alert(error.message);
    });
}


