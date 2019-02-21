var collection;
var collectionUrl = "https://api.myjson.com/bins/1214pe";

function listenForClicks() {
    document.addEventListener("click", (e) => {

        function goBack(){
            document.getElementById("sub-collection").style.display = 'none';
            document.getElementById("main-collection").style.display = 'block';
        }

        function loadSubCollection(){
            document.getElementById("main-collection").style.display = 'none';
            document.getElementById("sub-collection").style.display = 'block';
            var environment = e.target.getAttribute("data-environment");
            populateSubCollectionList(environment);
        }

        function populateSubCollectionList(id){
            var subCollectionList = `<li><a href="#back" class="back">Back</a></li>`;
            for (var i = 0; i < Object.keys(collection.environments[id].urls).length; i++){
                var obj = collection.environments[id].urls[i];
                subCollectionList += `<li class="item-list"><a href="#" class="environment-url" data-environment-url="${obj.url}" ><img src="../pio/${obj.cluster}.png" width="26" height="26" /><span>${obj.name} - ${obj.language}</span></a></li>`;
            }
            document.getElementById("sub-collection").innerHTML = subCollectionList;
        }

        function openUrl(){
            browser.tabs.update({url: e.target.getAttribute("data-environment-url") });
        }

        // event listeners
        if (e.target.classList.contains("collection")) {
            loadSubCollection();
        }

        if (e.target.classList.contains("back")) {
            goBack();
        }

        if (e.target.classList.contains("environment-url")) {
            openUrl();
        }

    });
}

function bootload(){
    fetch(collectionUrl)
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
        document.getElementById("main-collection").innerHTML = mainCollectionList;
    });
}

document.addEventListener("DOMContentLoaded", listenForClicks);

bootload();
