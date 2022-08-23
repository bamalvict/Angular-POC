/* Pour le moteur de recherche uniquement pour les FAQ et sources 
*  Auteur : Djibril et winjerome
*  Date : 2012
*  Mise à jour : 22/03/2020
*/

var currentPage = 1;
var hasAlreadySearched=false;

var f = function (){
    var rrr = $("#resultats");
    var s = $("#resultSearch").val();
    if (s == ""){
    	rrr.html("");
    	rrr.hide();
    	return;
    }else{
         rrr.show();
    } 

    var UrlArticle = window.location.href.replace(location.search, '').replace(location.hash, '');
    var url = "https://www.developpez.com/recherche/resultatfaq?p=" + escape(s) + "&from=" + currentPage + "&url="+ UrlArticle;

    if (!hasAlreadySearched){
        rrr.html("Recherche en cours ...");
        hasAlreadySearched = true;
    }
	
	rrr.load(url);

};

function doprevious () {
    currentPage = currentPage - 1;
    if (currentPage < 1)
        currentPage = 1;
    f();
}

function donext () {
    currentPage++;
    f();
}

function dosearch() {
    currentPage = 1;
    f();
}

function dofocuson() {
            var rrr = document.getElementById("resultSearch");
            rrr.style.backgroundImage='url()';
}

function dofocusoff() {
            var rrr = document.getElementById("resultSearch");
            if (rrr.value == "") {
                    rrr.style.backgroundImage='url("https://www.developpez.com/template/kit/kitcours-input-fond.png")';
            };
}

/*
$("*[role='previous']").on("click", doprevious);
$("*[role='next']").on("click", donext);
*/
$('#resultats').on('click', '[role="next"]', donext);
$('#resultats').on('click', '[role="previous"]', doprevious);

$("#resultSearch").keyup(dosearch);
$("#searchSubmit").click(dosearch);
$("#resultSearch").focus(dofocuson);
$("#resultSearch").blur(dofocusoff);

