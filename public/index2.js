// firebase.auth().signOut().then(() => {
//   console.log("Success")
// }).catch((error) => {
//   console.log("Error")
// });
function logout() {
  window.location.href = "index.html";
  firebase.auth().signOut();
  console.log("Success")
}
