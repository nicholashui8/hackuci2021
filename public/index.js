firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // User is signed in.
        var user = firebase.auth().currentUser;

        if (user != null) {
            localStorage.setItem("email_id", user.email);
            window.location.href = "userHome.html";
            var email_id = user.email;
            const userInfo = {
                email: user.email.replaceAll(".", ""),
            }
            console.log("Logging in: " + userInfo.email)
            fetch('/confirmLogin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userInfo),
            })
                .then(res => res.json())
                .then(data => console.log(data))
                .catch(err => console.error(err));
        }

    } else {
        document.getElementById("login_div").style.display = "block";
    }
});

function login() {

    var userEmail = document.getElementById("email_field").value;
    var userPass = document.getElementById("password_field").value;

    firebase.auth().signInWithEmailAndPassword(userEmail, userPass).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;

        window.alert("Error : " + errorMessage);

        // ...
    });

}

function signup() {
    var userEmail = document.getElementById("email_field").value;
    var userPass = document.getElementById("password_field").value;

    firebase.auth().createUserWithEmailAndPassword(userEmail, userPass).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;

        window.alert("Error : " + errorMessage);

        // ...
    });
}


function logout() {
    window.location.href = "index2.html";

    firebase.auth().signOut();
    console.log("Success")
}
