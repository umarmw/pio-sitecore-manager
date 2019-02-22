var collection;
var defaultCollectionUrl = "https://api.myjson.com/bins/h2oze";

function listenForClicks() {
    document.addEventListener("click", (e) => {

        e.preventDefault();

        function goBack(){
            document.querySelector("#sub-collection").style.display = 'none';
            document.querySelector("#main-collection").style.display = 'block';
        }

        function loadSubCollection(){
            document.querySelector("#main-collection").style.display = 'none';
            document.querySelector("#sub-collection").style.display = 'block';
            var environment = e.target.getAttribute("data-environment");
            populateSubCollectionList(environment);
        }

        function populateSubCollectionList(id){
            var subCollectionList = `<li><a href="#back" class="back">Back</a></li>`;
            for (var i = 0; i < Object.keys(collection.environments[id].urls).length; i++){
                var obj = collection.environments[id].urls[i];
                subCollectionList += `<li class="item-list"><a href="#" class="environment-url" data-environment-url="${obj.url}" ><img src="../pio/${obj.cluster}.png" width="26" height="26" /><span>${obj.name} - ${obj.language}</span></a></li>`;
            }
            document.querySelector("#sub-collection").innerHTML = subCollectionList;
        }

        function openUrl(e){
            safari.application.activeBrowserWindow.activeTab.url = e.target.getAttribute("data-environment-url");
        }

        if (e.target.classList.contains("collection")) {
            loadSubCollection();
        }

        if (e.target.classList.contains("back")) {
            goBack();
        }

        if (e.target.classList.contains("environment-url")) {
            openUrl(e);
        }

        if (e.target.classList.contains("settings")) {
            showSettings();
        }

        if (e.target.classList.contains("cancel")) {
            hideSettings();
            restoreOptions();
        }

        if (e.target.classList.contains("reset")) {
            document.querySelector("#collection-url").value = "";
        }

        if (e.target.classList.contains("save-settings")) {
            saveOptions(e);
        }

    });
}

function showSettings(){
    document.querySelector("#popin-message").innerHTML = "";
    document.querySelector("#popin-message").style.display = 'none';
    document.querySelector("#main-collection").style.display = 'none';
    document.querySelector("#sub-collection").style.display = 'none';
    document.querySelector("#popin").style.display = 'block';
}

function hideSettings(){
    document.querySelector("#popin").style.display = 'none';
    document.querySelector("#main-collection").innerHTML = '<li><div class="loading-container"><img src="../pio/double-ring.gif" width="64" height="64" class="loading" /></div></li>';
    document.querySelector("#main-collection").style.display = 'block';
}

function saveOptions(e) {
    e.preventDefault();
    var RegExp =/^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/i;
    var url = document.querySelector("#collection-url").value;
    if (!RegExp.test(url)){
        document.querySelector("#popin-message").innerHTML = "Url is not valid!";
        document.querySelector("#popin-message").style.display = 'block';
    } else {
        document.querySelector("#popin-message").innerHTML = "";
        document.querySelector("#popin-message").style.display = 'none';
        safari.extension.settings.feed = url;
        hideSettings();
        bootload(url);
    }
  }
  
function restoreOptions() {

    var url = safari.extension.settings.feed || defaultCollectionUrl;
    document.querySelector("#collection-url").value = url;
    bootload(url);
}


function bootload(url){
    fetch(url)
    .then(function(response) {
        return response.json();
    })
    .then(function(jsonResponse) {
        collection = jsonResponse;
        var mainCollectionList = "";
        for (var i = 0; i < Object.keys(collection.environments).length; i++){
            var obj = collection.environments[i];
            mainCollectionList += `<li><a href="#" class="collection" data-environment="${i}">${obj.name}</a></li>`
        }
        document.querySelector("#main-collection").innerHTML = mainCollectionList;
    });
}

document.addEventListener("DOMContentLoaded", listenForClicks);
document.addEventListener("DOMContentLoaded", restoreOptions);
