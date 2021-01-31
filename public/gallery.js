let folders = []
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

      for (i = 1; i < numberOfFiles + 1; i++) {
        let folder = []
        var storageRef = firebase.storage().ref(email + "/" + "item" + i);
        console.log(storageRef);

        storageRef.listAll().then(function (result) {
          result.items.forEach(function (item) {
            folder.push(item.getDownloadURL())
          });


        }).catch(function (error) {
          console.log(error)
        });
        folders.push(folder);
      }
    })
  console.log(folders);
}



function logout() {
  window.location.href = "index.html";

  firebase.auth().signOut();
  console.log("Success")
}