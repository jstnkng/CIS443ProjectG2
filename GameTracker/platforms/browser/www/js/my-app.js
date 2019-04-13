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
  //if (document.getElementById("signupform"))
    document.getElementById("signupform").style.display = "none";
  //if (document.getElementById("login"))
    document.getElementById("login").style.display = "none";
  document.getElementById("logout").style.display = "block";
  window.location.href = 'MainPage.html';
  window.alert("Welcome " + currentUser.email);

}

var mesRef = firebase.database().ref('games');
function addGames(){
  var game = getVal('gametitle');
  var hrs = getVal('hours');
  var email = currentUser.email;
  var cType = getVal('console');
  saveMessage(game, hrs, email, cType);
}


function saveMessage(game, hours, email, cType){
  var newMesRef = mesRef.push();
  newMesRef.set({
    game:game,
    hours:hours,
    email:email,
    cType:cType
  });
  window.alert(game + " Added");
  document.getElementById("gametitle").value = "";
  document.getElementById("hours").value = "";
  document.getElementById("console").value = "";
  
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
var chart;

window.onload = function(){
  createChart();
  addAllGames();  
}
 
//Grabs data from database, then if it relevant to the user it puts into the respective arrays.
function addAllGames(){
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
          document.getElementById("WelcomeHeader").innerHTML = "Welcome " + email;
          }
          if (document.getElementById("UserName")){
            document.getElementById("UserName").innerHTML = email+"'s Profile";
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
          conType.style = "text-align: right;"
          gameRow.appendChild(title);
          gameRow.appendChild(hours);
          gameRow.appendChild(points);
          gameRow.appendChild(conType);
          

          if (document.getElementById("gamesList")){
            document.getElementById("gamesList").appendChild(gameRow);
          }

          var modifyGameRow = document.createElement("tr");
          var modifyTitle = document.createElement("td");
          var modifyHours = document.createElement("input");
          modifyTitle.innerHTML = game.title;
          modifyHours.type = "text";
          modifyHours.style = "text-align: center";
          modifyHours.value = game.hours;
          modifyGameRow.appendChild(modifyTitle);
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
      var gameHoursValue = gameRow.childNodes[1].value;
      var gameHours = parseInt(gameHoursValue);
      gameArray[i].hours = gameHours;
    }
  }
  gameArray.forEach(function(game){
    var gamesRef = firebase.database();
    gamesRef.ref("games/" + game.key).update({hours: game.hours});
    console.log(game.hours);
  })
}


