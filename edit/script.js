function showBody() {
    document.querySelector("body").style.transition = ".5s"
    document.querySelector("body").style.opacity = "1"
    setTimeout(function() {
        document.querySelector("body").style.transition = "0s"
    }, 500)
}

function closeEditPage() {
    var photos = document.querySelectorAll(".posted-Img")
    document.querySelector("body").style.transition = ".5s"
    document.querySelector("body").style.opacity = 0

    setTimeout(function() {
        
        window.location = "../Profile"
    }, 500)
}

var imgURL = localStorage.getItem("profile_url")
var user = localStorage.getItem("name")

document.getElementById("img").setAttribute("src", imgURL)
document.getElementById("profile-Img").setAttribute("src", imgURL)
document.getElementById("name").textContent = user