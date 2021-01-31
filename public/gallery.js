let length = []
window.onload = function () {
  this.getFiles();
}
async function getNumOfFolders() {
  const response = await fetch('/getNumOfFolders');
  const data = await response.json();
  return data.numberOfFiles
}

async function getFiles() {
  var email = localStorage.getItem("email_id");
  email = email.replaceAll(".", "");
  fetch('/getNumOfFolders')
    .then(res => res.json())
    .then(data => {
      numberOfFiles = data.numberOfFiles
      console.log("number of folders: " + numberOfFiles);

      for(i = 1;i<numberOfFiles+1;i++)
      {
      var storageRef = firebase.storage().ref(email + "/" + "item"+i);
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
    }})
}

function displayFolder(folder) {
  folder.getDownloadURL().then(function (url) {
    length.push(url);
    console.log(length);
  })
}

function logout() {
  window.location.href = "index.html";

  firebase.auth().signOut();
  console.log("Success")
}
