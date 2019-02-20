var library;

function listenForClicks() {
    document.addEventListener("click", (e) => {

        function goBack(){
            document.getElementsByClassName("js-subcategory")[0].style.display = 'none';
            document.getElementsByClassName("js-category")[0].style.display = 'block';
        }

        function loadSubCategory(){
            document.getElementsByClassName("js-subcategory")[0].style.display = 'block';
            document.getElementsByClassName("js-category")[0].style.display = 'none';
            var environment = e.target.getAttribute("data-environment");
            populateSubCategoryList(environment);
        }

        function populateSubCategoryList(id){
            var subCategoryList = `<li><a href="#back" class="back">Back</a></li>`;
            for (var i = 0; i < Object.keys(library.environments[id].urls).length; i++){
                var obj = library.environments[id].urls[i];
                subCategoryList += `<li class="item-list"><a href="#" class="environment-url" data-environment-url="${obj.url}" ><img src="../pio/${obj.cluster}.png" width="26" height="26" /><span>${obj.name} - ${obj.language}</span></a></li>`;
            }
            document.getElementsByClassName("js-subcategory")[0].innerHTML = subCategoryList;
        }

        function openUrl(){
            var newurl = e.target.getAttribute("data-environment-url");
           browser.tabs.update({url: newurl});
        }

        // event listeners
        if (e.target.classList.contains("category")) {
            loadSubCategory();
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
    fetch("https://api.myjson.com/bins/y4yeq")
    .then(function(response) {
        return response.json();
    })
    .then(function(jsonResponse) {
        library = jsonResponse;
        var categoryList = "";
        for (var i = 0; i < Object.keys(jsonResponse.environments).length; i++){
            var obj = jsonResponse.environments[i];
            categoryList += `<li><a href="#" class="category" data-environment="${i}">${obj.name}</a></li>`
        }
        document.getElementsByClassName("js-category")[0].innerHTML = categoryList;
    });
}

document.addEventListener("DOMContentLoaded", listenForClicks);

bootload();
