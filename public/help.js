function help(){
  window.location.href = "help.html";
}

function logout() {
  window.location.href = "index.html";

  firebase.auth().signOut();
  console.log("Success")
}
