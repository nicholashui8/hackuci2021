function logout() {
  window.location.href = "index2.html";
  firebase.auth().signOut();
  console.log("Success")
}

function uploadPage(){
  window.location.href = "upload.html";
}

function galleryPage(){
  window.location.href = "gallery.html";
}

function help(){
  window.location.href = "help.html";
}
