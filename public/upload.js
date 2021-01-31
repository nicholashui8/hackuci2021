window.onload = function () {
  document.getElementById('display').style.display = "none";
}

document.querySelectorAll(".drop-zone__input").forEach((inputElement) => {
  const dropZoneElement = inputElement.closest(".drop-zone");

  dropZoneElement.addEventListener("click", (e) => {
    inputElement.click();
  });

  inputElement.addEventListener("change", (e) => {
    if (inputElement.files.length) {
      updateThumbnail(dropZoneElement, inputElement.files[0]);
    }
  });

  dropZoneElement.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZoneElement.classList.add("drop-zone--over");
  });

  ["dragleave", "dragend"].forEach((type) => {
    dropZoneElement.addEventListener(type, (e) => {
      dropZoneElement.classList.remove("drop-zone--over");
    });
  });

  dropZoneElement.addEventListener("drop", (e) => {
    e.preventDefault();

    if (e.dataTransfer.files.length) {
      inputElement.files = e.dataTransfer.files;
      updateThumbnail(dropZoneElement, e.dataTransfer.files[0]);
    }

    dropZoneElement.classList.remove("drop-zone--over");
  });
});

/**
 * Updates the thumbnail on a drop zone element.
 *
 * @param {HTMLElement} dropZoneElement
 * @param {File} file
 */
function updateThumbnail(dropZoneElement, file) {
  let thumbnailElement = dropZoneElement.querySelector(".drop-zone__thumb");

  // First time - remove the prompt
  if (dropZoneElement.querySelector(".drop-zone__prompt")) {
    dropZoneElement.querySelector(".drop-zone__prompt").remove();
  }

  // First time - there is no thumbnail element, so lets create it
  if (!thumbnailElement) {
    thumbnailElement = document.createElement("div");
    thumbnailElement.classList.add("drop-zone__thumb");
    dropZoneElement.appendChild(thumbnailElement);
  }

  thumbnailElement.dataset.label = file.name;

  // Show thumbnail for image files
  if (file.type.startsWith("image/")) {
    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = () => {
      thumbnailElement.style.backgroundImage = `url('${reader.result}')`;
    };
  } else {
    thumbnailElement.style.backgroundImage = null;
  }
}


document.getElementById("submit-button").addEventListener("click", () => {
  showSpinner()
  document.getElementById("submit-button").disabled = true;

  const selectedFile = document.getElementById('input-button').files[0];
  //const selectedFile = "asf"
  console.log("upload button has been clicked")
  //checks if user has uploaded image
  if (selectedFile !== undefined) {
    console.log(selectedFile);
    const fd = new FormData();
    fd.append('image', selectedFile);

    let folder = []
    // send `POST` request (upload image to backend)
    fetch('/api', {
      method: 'POST',
      body: fd
    })
      .then(res => res.json())
      .then(data => {
        let folderNumber = data.numberOfFolders.toString()
        console.log(folderNumber)
        hideSpinner()
        var email = localStorage.getItem("email_id");
        email = email.replaceAll(".", "");
        var storageRef = firebase.storage().ref(email + "/" + "item" + folderNumber);
        console.log(email + "/" + "item" + folderNumber)
        storageRef.listAll()
          .then((result) => {

            console.log(result.items[0])
            result.items[0].getDownloadURL()
              .then(url => {
                console.log(url)
                document.getElementById('display').style.display = "block";
                document.getElementById('audioPlayer').src = url;

              })
              .then(() => {
                result.items[1].getDownloadURL()
                  .then(url => {
                    console.log(url)
                    document.getElementById('display').style.display = "block";
                    document.getElementById('audioPlayer').src = url;

                  })
              })
          })
          .catch(err => console.log(err))
        // storageRef.listAll().then(function (result) {
        //   result.items.forEach(function (item) {
        //     console.log("AAA");
        //     folder.push(item.getDownloadURL())
        //   });
        //console.log(folder[0])
        //document.getElementById('display').src = folder[0].i;
        //document.getElementById('display').style.display = "block";
















        document.getElementById("submit-button").disabled = false;
        var email = localStorage.getItem("email_id");
        email = email.replaceAll(".", "");

      })
      .catch(err => console.error(err));
  } else {
    console.log("User has not uploaded image");
  }
});

function showSpinner() {
  document.getElementById('spinner').style.display = 'block';
}

function hideSpinner() {
  document.getElementById('spinner').style.display = 'none';
}

function logout() {
  window.location.href = "index2.html";

  firebase.auth().signOut();
  console.log("Success")
}
