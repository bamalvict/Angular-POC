/* Pour le moteur de recherche uniquement pour les pages cours
*  Auteur : Djibril et winjerome
*  Date : 2012
*  Mise à jour : 22/03/2020
*/
var searchTimeout = null;

function searchDoRun() {
	searchTimeout = null;

	var currentSearch = $("#resultSearch").val();
	var result = $("#resultats");

	if (currentSearch == "") {
		result.html("").hide();
		return;
	}

	result.html("Recherche en cours").show();

	var page = window.location.href.replace(location.search, '').replace(location.hash, '');
	var url = "https://www.developpez.com/recherche/resultatcours?p=" + encodeURI(currentSearch) + "&from=1&url=" + page;

	$.get(url, function(html) {
		if (currentSearch == $("#resultSearch").val())
			result.html(html).show();
		else
			searchDoRun(); // les critères de recherche ont changé depuis
	}, "html");
}

function searchDoTimedRun() {
	if (searchTimeout)
		clearTimeout(searchTimeout);

	searchTimeout = setTimeout(searchDoRun, 500);
}

function searchDoFocus() {
	$("#resultSearch").css("background-image", "none");
}

function searchDoBlur() {
	var search = $("#resultSearch");
	if (search.val() == "")
		search.css("background-image", "url(https://www.developpez.com/template/kit/kitcours-input-fond.png)");
}

$("#resultSearch").keyup(searchDoTimedRun);
$("#searchSubmit").click(searchDoRun);
$("#resultSearch").focus(searchDoFocus);
$("#resultSearch").blur(searchDoBlur);
