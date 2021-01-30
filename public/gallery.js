window.onload = function () {
  this.getFiles();
}


function getFiles() {
  var email = localStorage.getItem("email_id");
  email = email.replaceAll(".", "");
  var storageRef = firebase.storage().ref(email + "/" + "item1");
  console.log(storageRef);



  storageRef.listAll().then(function (result) {
    console.log("AAA");
    result.items.forEach(function (folder) {
      console.log("BBB");
      displayFolder(folder);
    });


  }).catch(function (error) {
    console.log(error)
  });
}

function displayFolder(folder) {
  folder.getDownloadURL().then(function (url) {
    console.log(url);
  })
}

function logout() {
  window.location.href = "index.html";

  firebase.auth().signOut();
  console.log("Success")
}
