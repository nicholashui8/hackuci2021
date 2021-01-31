var database = firebase.database();
window.onload = function () {
  this.getFiles();
  this.listOut();
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
        function writeUserData(folder) {
          firebase.database().ref(email+i).set({
            img : result.items[0].i,
            audio : result.items[1].i

          });
        }



      }).catch(function (error) {
        console.log(error)
      });
    }})
}
async function listOut(){
  var email = localStorage.getItem("email_id");
  console.log(firebase.database().ref(email + 1).once('value'));
  // console.log(folders);
  // let num = 0;
  // console.log(folders.length);
  //
  // folders.forEach(function(folder) {
  //   let gal = document.getElementById("displaying");
  //   if (num == 0 || num % 3 == 0) {
  //     let row = document.createElement("row");
  //     row.classList.add("row");
  //     gal.appendChild(row);
  //
  //   }
  //   let row = document.getElementsByClassName("row");
  //   row = row[row.length - 1];
  //   let pic = folder[0].i;
  //   let voice = folder[1].i;
  //   // creating the item div for each pic and mp3
  //   let col = document.createElement("div");
  //   col.classList.add("col-lg-3", "col-md-4", "col-sm-6");
  //   // creating image and appending to div
  //   let image = document.createElement('img');
  //   image.classList.add("galleryImage");
  //   image.src = folder[0].i;
  //   col.appendChild(image);
  //   // creating audio then appending to div
  //   let aud = document.createElement("audio");
  //   aud.classList.add("galleryAudio");
  //   let source = document.createElement("source");
  //   source.src = folder[1].i;
  //   aud.appendChild(source);
  //   col.appendChild(aud);
  //   row.appendChild(col);
  //   i++;
  // });
}

function displayFolder(folder) {
  folder.getDownloadURL().then(function (url) {
    folders.push(url);
    console.log(folders);
  })
}

function logout() {
  window.location.href = "index2.html";

  firebase.auth().signOut();
  console.log("Success")
}
