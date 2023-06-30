const firebaseConfig = {
    apiKey: "AIzaSyCuwZfSSZj8ZAJeOHc5KyVMoCLyVNpoHtg",
    authDomain: "riverwoodweek.firebaseapp.com",
    projectId: "riverwoodweek",
    storageBucket: "riverwoodweek.appspot.com",
    messagingSenderId: "1082778996477",
    appId: "1:1082778996477:web:2268b67f1c83116456b894",
    measurementId: "G-XSMTVCLVE2"
};

firebase.initializeApp(firebaseConfig);

const database = firebase.database();
const storage = firebase.storage().ref();
const imgURL = localStorage.getItem("profile_url")
const uid = localStorage.getItem("uid")


const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

const gid = urlParams.get('gid');

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}
document.getElementById("profile-Top-Img").setAttribute("src", imgURL)

var file = ""
var geocoder;
var imgURLRecent = ''
const user = localStorage.getItem("name")
const code = localStorage.getItem("Code")

function checkFolderExistence(folderPath) {
    return new Promise((resolve, reject) => {
      const folderRef = database.ref(folderPath);
  
      folderRef.once("value")
        .then((snapshot) => {
          const folderExists = snapshot.exists();
          resolve(folderExists);
        })
        .catch((error) => {
          reject(error);
        });
    });
}

// Function to upload data URL to Firebase Storage
function uploadImage(dataURL) {
    // Generate a unique filename for the image
    var filename = Math.floor(Date.now() / 1000) + '.png';

    // Create a reference to the image file in Firebase Storage
    var imageRef = storage.child(filename);

    // Convert the data URL to a Blob object
    var imageBlob = dataURLToBlob(dataURL);

    // Upload the Blob to Firebase Storage
    var uploadTask = imageRef.put(imageBlob);

    // Register an event handler for successful upload
    uploadTask.then(function(snapshot) {
        // Get the download URL of the uploaded image
        snapshot.ref.getDownloadURL().then(function(downloadURL) {
            var date = Math.floor(Date.now() / 1000)
            // Create an image element and set its source to the download URL
            var img = document.createElement('img');
            img.src = downloadURL;
            img.style.display = "none"

            // Append the image element to the document body or any desired location
            document.body.appendChild(img);

            console.log('Image uploaded and displayed successfully.');
            console.log('Image URL:', downloadURL);
            imgURLRecent = downloadURL
            var path = makeid(15)
            database.ref("users/" + uid + "/images/" + date).set({
                "path":path,
                "time":String(new Date()),
                "user_name":user,
                "imgURL":imgURLRecent,
                "profile_img":imgURL,
                "uid":uid
            })

            database.ref("groups/" + gid + "/images/" + date).set({
                "path":path,
                "time":String(new Date()),
                "user_name":user,
                "imgURL":imgURLRecent,
                "profile_img":imgURL,
                "uid":uid
            })
        });
    }).catch(function(error) {
        console.log('Error uploading image:', error);
    });
}

    // Function to convert data URL to Blob
function dataURLToBlob(dataURL) {
    var arr = dataURL.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type: mime});
}

function convertFileToDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
    
        reader.onloadend = () => {
            resolve(reader.result);
        };
    
        reader.onerror = (error) => {
            reject(error);
        };
    
        reader.readAsDataURL(file);
    });
}

  
document.getElementById("Images").addEventListener("change", async (event) => {
    const file = event.target.files[0];
  
    try {
        const dataURL = await convertFileToDataURL(file);
        uploadImage(dataURL);
    //   codeLatLng()
      // Use the dataURL as needed (e.g., upload it to Firebase Storage)
    } catch (error) {
      console.error('Error converting file to data URL:', error);
    }
});

// document.getElementById("Images1").addEventListener("change", async (event) => {
//     const file = event.target.files[0];
  
//     try {
//         const dataURL = await convertFileToDataURL(file);
//         uploadImage(dataURL);
//     //   codeLatLng()
//       // Use the dataURL as needed (e.g., upload it to Firebase Storage)
//     } catch (error) {
//       console.error('Error converting file to data URL:', error);
//     }
// });


// function codeLatLng() {

//     if ("geolocation" in navigator) {
//         navigator.geolocation.getCurrentPosition(function(position) {
//           const latitude = position.coords.latitude;
//           const longitude = position.coords.longitude;
      
//           const url = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=2d978186b1e2492eb6c1f375a5d8cb32`;
      
//           fetch(url)
//             .then(response => response.json())
//             .then(data => {
//               if (data.results.length > 0) {
//                 const result = data.results[0];
//                 const city = result.components.city;
//                 const region = result.components.state;
//                 const country = result.components.country;
      
//                 console.log("Latitude: " + latitude);
//                 console.log("Longitude: " + longitude);
//                 console.log("City: " + city);
//                 console.log("Region: " + region);
//                 console.log("Country: " + country);

//                 var path = makeid(15)

//                 database.ref("img/" + path).set({
//                     "path":path,
//                     "Latitude":position.coords.latitude,
//                     "Longitude":position.coords.longitude,
//                     "City":city,
//                     "Region": region,
//                     "Country": country,
//                     "imgURL":imgURLRecent
//                 })
//               }
//             })
//             .catch(error => {
//               console.log("Error: " + error);
//             });
//         });
//     } else {
//         console.log("Geolocation is not supported by your browser");
//     }
      
// }



if(code == null || code == undefined) {
    window.location = "../code"
} else { 
    const checkPass = function()  {
        try {
            // Usage example
            const folderPath = "groups/" + gid;
            
            checkFolderExistence(folderPath)
                .then((exists) => {
                if (!exists) {
                    localStorage.clear()
                    window.location = "../code"
                }
            })
                .catch((error) => {
                console.error("Error occurred while checking folder existence:", error);
            });
            var group_Members = []
            var group_Name;
            var group_Images = []
            var counter = 0
            database.ref("groups/" + gid).once("value", function(snapshot) {
                group_Members = snapshot.val().group_Members
                group_Name = snapshot.val().group_Name
                group_Images = snapshot.val().images
                
                if(!group_Members.includes(uid)) {
                    window.location = "../code"
                } else {
                    document.getElementById("name").textContent = group_Name
                    
                    if(group_Images != undefined && group_Images != null) {
                        document.getElementById("posts-Container").innerHTML = ""
                        database.ref("groups/" + gid + "/images/").once("value", function(snapshot) {
                            snapshot.forEach(function(child) {
                                showImg(child.val())
                            })
                        })

                        if(true) {
                            var new_html = '<div id="bottom-Info"><span id="logo">MEMO</span>Created by Benjamin Burnell</div>'
                            var div = document.createElement("div")
                            div.innerHTML = new_html
                            document.getElementById("posts-Container").append(div)
                        }
                    }                    
                }
            })
        } catch(e) {
            window.location = "../code"
        }
    }
    checkPass()
}

function shareImg(imageURL) {
    if (navigator.share) {
        navigator.share({
            title: 'Shared Image',
            text: 'Check out this image!',
            url: imageURL
        })
        .then(() => console.log('Image shared successfully.'))
        .catch((error) => console.log('Error sharing image:', error));
    } else {
    console.log('Web Share API is not supported by your browser.');

    // You can provide an alternative sharing option or display a message to the user.
    // For example, you can create a shareable link or display a share button with custom behavior.
    }
}

function openProfile() {
    document.querySelector("body").style.transition = ".5s"
    document.querySelector("body").style.opacity = "0"
    setTimeout(function() {
        window.location = "../profile"
    }, 500)
}


function showImg(data) {

    
    new_Date_String = formatTimeAgo(new Date(data.time), new Date())
    profile_pic = data.profile_img
    // snapshot.val().profile_img
    
    var html = '<div class="img-Post-Container"><div class="posted-img-Container"><div id="fade5"></div><div id="fade6"></div><div id="fade7"></div><div id="fade8"></div><img class="posted-img" src="' + data.imgURL + '"><div class="post-Info"><div class="profile-Pic-Container"><img class="profile-Pic" src="' + profile_pic + '"></div><div class="name-Location-Container"><div class="post-Name">' + data.user_name + '</div><div class="location">' + new_Date_String + '</div></div><button class="share-Button" onclick="shareImg()"><svg class="edit-Icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="white" height="800px" width="800px" version="1.1" id="Capa_1" viewBox="0 0 32.055 32.055" xml:space="preserve"><g>    <path d="M3.968,12.061C1.775,12.061,0,13.835,0,16.027c0,2.192,1.773,3.967,3.968,3.967c2.189,0,3.966-1.772,3.966-3.967   C7.934,13.835,6.157,12.061,3.968,12.061z M16.233,12.061c-2.188,0-3.968,1.773-3.968,3.965c0,2.192,1.778,3.967,3.968,3.967   s3.97-1.772,3.97-3.967C20.201,13.835,18.423,12.061,16.233,12.061z M28.09,12.061c-2.192,0-3.969,1.774-3.969,3.967   c0,2.19,1.774,3.965,3.969,3.965c2.188,0,3.965-1.772,3.965-3.965S30.278,12.061,28.09,12.061z"/></g></svg></button></div></div></div>'
    var div = document.createElement("div")
    div.innerHTML = html
    document.getElementById("posts-Container").prepend(div)

    // database.ref("users/" + data.uid).once("value", function(snapshot) {

    //     new_Date_String = formatTimeAgo(new Date(data.time), new Date())
    //     profile_pic = snapshot.val().profile_img
        
    //     var html = '<div class="img-Post-Container"><div class="posted-img-Container"><div id="fade5"></div><div id="fade6"></div><div id="fade7"></div><div id="fade8"></div><img class="posted-img" src="' + data.imgURL + '"><div class="post-Info"><div class="profile-Pic-Container"><img class="profile-Pic" src="' + profile_pic + '"></div><div class="name-Location-Container"><div class="post-Name">' + data.user_name + '</div><div class="location">' + new_Date_String + '</div></div><button class="share-Button" onclick="shareImg()"><svg class="edit-Icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="white" height="800px" width="800px" version="1.1" id="Capa_1" viewBox="0 0 32.055 32.055" xml:space="preserve"><g>    <path d="M3.968,12.061C1.775,12.061,0,13.835,0,16.027c0,2.192,1.773,3.967,3.968,3.967c2.189,0,3.966-1.772,3.966-3.967   C7.934,13.835,6.157,12.061,3.968,12.061z M16.233,12.061c-2.188,0-3.968,1.773-3.968,3.965c0,2.192,1.778,3.967,3.968,3.967   s3.97-1.772,3.97-3.967C20.201,13.835,18.423,12.061,16.233,12.061z M28.09,12.061c-2.192,0-3.969,1.774-3.969,3.967   c0,2.19,1.774,3.965,3.969,3.965c2.188,0,3.965-1.772,3.965-3.965S30.278,12.061,28.09,12.061z"/></g></svg></button></div></div></div>'
    //     var div = document.createElement("div")
    //     div.innerHTML = html
    //     // database.ref("users/" + )
    //     document.getElementById("posts-Container").appendChild(div)
    // })
}



function formatTimeAgo(pastDate, currentDate) {
    const timeDiff = currentDate - pastDate;
    const seconds = Math.floor(timeDiff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);
  
    if (years >= 1) {
      return `${years}y ago`;
    } else if (months >= 1) {
      return `${months}m ago`;
    } else if (weeks >= 1) {
      return `${weeks}w ago`;
    } else if (days >= 1) {
      return `${days}d ago`;
    } else if (hours >= 1) {
      return `${hours}h ago`;
    } else if (minutes >= 1) {
      return `${minutes}m ago`;
    } else {
      return `${seconds}s ago`;
    }
}
  
// var group_Members = [uid]
// var group_ID = makeid(15)

// database.ref("groups/" + group_ID + "/").update({
//     "code":"2984",
//     "group_Name":"Riverwood Memo🏕️",
//     "group_Members":group_Members,
//     "group_ID":group_ID
// })