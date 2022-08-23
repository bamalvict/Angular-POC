/*******************************************************************************
 * Auteurs : developpez.com (Atomya Rise, djibril, Torgar...)
 * But     : JS des articles de developpez.com
 * Date    : 15/03/2021
 ******************************************************************************/

/**********************************************************************************************************************************/
/******************************************* VARIABLES GLOBALES *******************************************************************/
/**********************************************************************************************************************************/
var hauteurSommaire, classNavSom, classToggle, TogglePlier, ToggleDeplier, hauteurContenuArticle, articleBody, LargeurEcranMobile;
var cheminImageKit = "https://www.developpez.com/template/kit/";

/**********************************************************************************************************************************/
/******************************************* DOCUMENT READY ***********************************************************************/
/**********************************************************************************************************************************/
jQuery(function($) {

	/******************************************* On initialise les variables **********************************************************/
	classNavSom            = jQuery(".nav-sommaire");                    // Section du sommaire
	classToggle            = jQuery(".ToggleGecko");                     // Entete sommaire
	TogglePlier            = jQuery(".ToggleImgPlier");
	ToggleDeplier          = jQuery(".ToggleImgDeplier");
	articleBody            = jQuery(".articleBody");                     // Corps de l'article
	hauteurSommaire        = classNavSom.height();
	hauteurContenuArticle  = articleBody.height();

	/* Ecran mobile */
	LargeurEcranMobile     = 1090;
	var LargeurEcran = $( window ).width();
	var LargeurEcranVideo = LargeurEcran - 50;

	/******************************************* Gestion des largeurs des sections d'entête *************************************************/
	var LargeurSectionAuteurs            = jQuery(".SectionAuteurs").css("width");
	var LargeurSectionInformationArticle = jQuery(".SectionInformationArticle").css("width");
	var LargeurSectionBookmarks          = jQuery(".SectionBookmarks").css("width");

	if ( LargeurEcran > LargeurEcranMobile ) { 
		if ( ! LargeurSectionBookmarks && (LargeurSectionAuteurs && LargeurSectionInformationArticle )  ) {
			jQuery(".InfoAuthArtBook").css("grid-template-columns", "250px auto");
		}
		else if  ( ! LargeurSectionAuteurs && (LargeurSectionBookmarks && LargeurSectionInformationArticle )  ) {
			jQuery(".InfoAuthArtBook").css("grid-template-columns", "auto max-content");
		}
		else if  ( ! LargeurSectionAuteurs &&  ! LargeurSectionBookmarks ) {
			jQuery(".InfoAuthArtBook").css("grid-template-columns", "auto");
		}
	}

	/******************************************* On récupère la position du sommaire *************************************************/
	var positionSommaire;
	// S'il y a un sommaire, on récupère la position.
	if (classNavSom.length != 0) {
		var positionSommaire = classNavSom.offset();
		positionSommaire     = positionSommaire.top;
	}else
		jQuery("article > section").css("grid-template-columns", "auto");


	/******************************************* Déplacement de la licence **********************************************************/
	var licence = jQuery('.licence').clone();
	jQuery('.licence').remove();
	jQuery('.ArticleComplet > section > div.contenu').append(licence);
	
	/******************************************* Calcul des dimensions + resize de la fenêtre ***************************************/
	calcul_dimensions();

	jQuery(window).resize(
		function() {
			calcul_dimensions();
			casMobile();
		}
	);

	/******************************************* Si pas IE6 On gère le scroll pour fixer ou non le sommaire *************************/
	if (version_ie() != 6 && hauteurContenuArticle > hauteurSommaire) {
		jQuery(window).scroll(function() { 

			// Si la class StopArrondi n'est pas présente, alors le menu est déroulé
			if (!classToggle.hasClass("StopArrondi")) {

				// Si le scroll est supérieur à la hauteur de l'entête alors on fixe le sommaire
				if (jQuery(window).scrollTop() >= positionSommaire)
					fixed_activer();
				
				// Sinon, on retire la class de fixation
				else
					fixed_desactiver();
			  
			// Si le sommaire est fermé, on supprime la class de fixation
			} else
				fixed_desactiver();
		});
	}

	/******************************************* Toggle pour ouvrir et fermer le sommaire ******************************************/
	classToggle.on('click', function() {
		if (!$(this).hasClass('StopArrondi')) {
			calcul_dimensions();
			jQuery("#nav_sommaire_ul_principal").slideUp("slow",function(){
				TogglePlier.hide();
				ToggleDeplier.show();
				classToggle.addClass("StopArrondi");
				$(this).parents('nav.nav-sommaire').css('margin-bottom', '20px');
				fixed_desactiver();
				calcul_dimensions();
			});
		} else {
			$(this).removeClass("StopArrondi");
			calcul_dimensions();
			jQuery("#nav_sommaire_ul_principal").slideDown("slow",function(){
				ToggleDeplier.hide();
				TogglePlier.show();
				$(this).parents('nav.nav-sommaire').css('margin-bottom', '10px');
				fixed_activer();
				calcul_dimensions();
            });
		}
	});

	/******************************************* Présence de pub sur les faqs *****************************************************/
	presencePubFaq();

	/******************************************* Onglets pour les livres **********************************************************/
	jQuery(".classLivreContenu").addClass("displayNone");
	jQuery(".livreOnglets .classJsInfo").addClass("livreOngletActif");
	jQuery(".livreDetails .classJsInfo").removeClass("displayNone");

	jQuery(".classLivreOnglet").on('click', 
		function() {

			// On récupère la première class
			var parentId = jQuery(this).parent().parent().attr("id");
			var divClass = jQuery(this).attr("class");
			var recupDivClass = divClass.split(" ");
			var classe1 = recupDivClass[0];

			jQuery("#" + parentId + " .classLivreOnglet").removeClass("livreOngletActif");
			jQuery(this).addClass("livreOngletActif");
			jQuery("#" + parentId + " .classLivreContenu").addClass("displayNone");
			jQuery("#" + parentId + " .livreDetails ."+classe1).removeClass("displayNone");
		}
	);

	/******************************************* Gestion des popup des auteurs *****************************************************/
	popup_modal_auteur();

	// Améliorer le sommaire des pages de cours de developpez.com
	if ( document.URL.indexOf("page=") < 0 ) {
		if ( jQuery(".PageCours").length >=4 && jQuery(".ThemeCours").length >= 30 ) {
			jQuery(".PageCours").prepend('<img src="https://www.developpez.com/template/kit/kitplus.png"/>');
			jQuery(".ListeCategorieCours").hide();
		} else {
			jQuery(".PageCours").prepend('<img src="https://www.developpez.com/template/kit/kitmoins.png"/>');
		}
		jQuery(".PageCours > img").css('cursor','pointer');
 
		jQuery(".PageCours > img").mouseover(function() {
			jQuery(this).next("a").css('background', "#DDDDFF");
		});
		jQuery(".PageCours > img").mouseleave(function() {
			jQuery(this).next("a").css('background', "#FFFFFF");
		});
 
		jQuery(".PageCours > img").click(function() {
			if( jQuery(this).attr("src") == "https://www.developpez.com/template/kit/kitplus.png" ) {
				jQuery(this).attr("src", "https://www.developpez.com/template/kit/kitmoins.png" );
				jQuery(this).next('a').next("ul").slideDown();
			} else {
				jQuery(this).attr("src", "https://www.developpez.com/template/kit/kitplus.png" );
				jQuery(this).next('a').next("ul").slideUp();
			}
		});
	}
	/*
	if ( document.URL.indexOf("page=") > 0 ) {
		console.log('ancre : ' + location.hash );
		console.log('search : ' + location.search );
	}
	*/
});

/**********************************************************************************************************************************/
/******************************************* FONCTION POUR VERSION IE *************************************************************/
/**********************************************************************************************************************************/
function version_ie() {
	if (navigator.appVersion.indexOf('MSIE 6') > 0)
		return 6;
	else if (navigator.appVersion.indexOf('MSIE 7') > 0)
		return 7;
	else if (navigator.appVersion.indexOf('MSIE 8') > 0)
		return 8;
	else
		return 0;
}

/**********************************************************************************************************************************/
/******************************************* FONCTION POUR FIXER OU NON LE SOMMAIRE ***********************************************/
/**********************************************************************************************************************************/
function fixed_activer() {
	if ($('article#contenuArticle').length != 0 && $( window ).height() > $('article#contenuArticle').height())
		return;
	if ( $( window ).width() > LargeurEcranMobile ) 
		classNavSom.addClass("fixed2");
}

function fixed_desactiver() {
	if ( $( window ).width() > LargeurEcranMobile ) 
		classNavSom.removeClass("fixed2");
}

/**********************************************************************************************************************************/
/******************************************* FONCTION POUR CALCULER LES DIMENSIONS SELON L'ECRAN **********************************/
/**********************************************************************************************************************************/
function calcul_dimensions() {
	if ( $( window ).width() < LargeurEcranMobile )
		return;
	
	if (classNavSom.length != 0 && !classToggle.hasClass("StopArrondi")) { 
		var gtc = "300px auto";
		if (hauteurSommaire > hauteurContenuArticle)
			fixed_desactiver();
		else { 
			fixed_activer();
			var classNavSomUlPrinc = jQuery("#nav_sommaire_ul_principal");
			if ((jQuery(window).height() - jQuery("#gabarit_pied").height()) < hauteurSommaire)
				classNavSomUlPrinc.css("overflow-y", "scroll")
			else 
				classNavSomUlPrinc.css("overflow-y", "auto")
				
		}
	} else {
		var gtc = "auto";
		fixed_desactiver();
	}
	
	jQuery(".contenuPage:not(#gabarit_mobile_contenuPage) article.ArticleComplet > section").css("grid-template-columns", gtc);
}

/**********************************************************************************************************************************/
/******************************************* FONCTION POUR AFFICHER/CACHER UN CODE ************************************************/
/**********************************************************************************************************************************/
function CacherMontreCode(elementId, IdTitreCode){
	var ObjetCode = jQuery("#"+elementId);	// Id de ol du code
	var ObjettitreCode = jQuery("#"+IdTitreCode);	// Id du div contenant le titre d'un code
	var $parent = ObjettitreCode.parent('div.code_et_titre');
	var $BaliseAParent = $parent.find('span.dissimuler_code a');
// <AJOUTE>
	if (ObjetCode.parents('.code_avec_lignes').length) { // Si tableau affichant les numéros de ligne
		ObjetCode = ObjetCode.closest('.code_avec_lignes');
	}
// </AJOUTE>

	if (ObjetCode.css("display") == 'none') {
		ObjetCode.css("display", "");	// Réafficher le code
		ObjettitreCode.removeClass("radius_titre_des_codes_seul");	// On supprime la classe pour enlever l'arrondi inférieur
		$BaliseAParent.text("Cacher le code");

	} else {
		ObjetCode.css("display", "none");	// Afficher le code
		ObjettitreCode.addClass("radius_titre_des_codes_seul");	// On rajoute la classe pour modifier l'arrondi inférieur
		$BaliseAParent.text("Afficher le code");
	}
}


/**********************************************************************************************************************************/
/******************************************* FONCTION POUR AFFICHER/CACHER UNE PARTIE DE SOMMAIRE ************************************************/
/**********************************************************************************************************************************/
function CacherMontreSommaireFAQ(elementId, IdImage1){

	var ObjetCode     = jQuery("#"+elementId);	// Id de ul du code
	var ObjetIdImage1 = jQuery("#"+IdImage1);	  // Id de ul du code

	if (ObjetCode.css("display") == 'none') {
		ObjetCode.css("display", "block");	// Réafficher le block
		ObjetIdImage1.attr('src', cheminImageKit + 'kitmoins.png');
	} else {
		ObjetCode.css("display", "none");	// Afficher le block
		ObjetIdImage1.attr('src', cheminImageKit + 'kitplus.png');
	}
}


/**********************************************************************************************************************************/
/******************************************* FONCTION SELECTION DE CODE PAR CLIC **************************************************/
/**********************************************************************************************************************************/
function selectionCode( id_source, IdTitreCode){
  var oSelect, oRange, oSrc = document.getElementById( id_source);
  if( window.getSelection) {
    oSelect = window.getSelection();
    oSelect.removeAllRanges();
    oRange = document.createRange();
    oRange.selectNodeContents( oSrc);
    oSelect.addRange( oRange);
  }
  else {
    oRange = document.body.createTextRange();
    oRange.moveToElementText( oSrc);
    oRange.select();
  }
  
  // Affichage du code si ce dernier est caché
	if (typeof IdTitreCode === "undefined") {
		// on ne faite rien
		return false;
	}
	else {
		var ObjetCode      = jQuery("#"+id_source);	// Id de ol du code
		var ObjettitreCode = jQuery("#"+IdTitreCode);	// Id du div contenant le titre d'un code
		var $parent        = ObjettitreCode.parent('div.code_et_titre');
		var $BaliseAParent = $parent.find('span.dissimuler_code a');
		if (ObjetCode.parents('.code_avec_lignes').length) { // Si tableau affichant les numéros de ligne
			ObjetCode = ObjetCode.closest('.code_avec_lignes');
		}
		if (ObjetCode.css("display") == 'none') {
			ObjetCode.css("display", "block");	// Réafficher le code
			$BaliseAParent.text("Cacher le code");		
		}		
	}


  return false;
}

/**********************************************************************************************************************************/
/******************************************* FONCTION PRESENCE PUB FAQ ************************************************************/
/**********************************************************************************************************************************/
function presencePubFaq() {
	var RubriqueDroite = jQuery("#RubriqueDroite").length;

	if (RubriqueDroite == 0) {
		jQuery(".ArticleComplet").css("margin", "0");
	}
  else {
	/* Exclusion d'IE7 pour le positionnement de la colonne de droite */
	if ( version_ie() != 7 ) {
		jQuery(".ArticleComplet").css("margin-right", "320px");

		/* Page livres uniquement */
		if ( jQuery(window.location.hash)!="" && jQuery(window.location.hash).length==1 ) {
			if ( jQuery("div").hasClass("UnLivreEntier") ) {
				setTimeout(function() { jQuery(window).scrollTop( jQuery(window.location.hash).offset().top ); }, 1000);
			}
		}
	}

		/******************************************* On deboggue les blocks de codes ******************************************************/
		jQuery("pre.code_uniquement").each(function() {
			if (version_ie() == 6)
				jQuery(this).css("width", jQuery(".titre_des_codes").width() + "px").css("padding-bottom", "20px").css("overflow", "auto");
			else
				//jQuery(this).css("width", (jQuery(this).parent().width() - 12) + "px").css("padding-bottom", "20px").css("overflow", "auto");
				// Le titre s'en va avec le scroll si on fixe une taille lorsque la fenêtre du navigateur est petite.
				jQuery(this).css("padding-bottom", "20px").css("overflow", "auto");

		});

	}
}

/**********************************************************************************************************************************/
/******************************************* FONCTION Pop-up Auteurs ************************************************************/
/**********************************************************************************************************************************/
function popup_modal_auteur() {

	// Lorsque l'on clique sur le lien des auteurs
	jQuery(".poplight").click( function() {

		var DivPopupAuteurs = jQuery("#ListeAuteursDVP");
		var LargeurPopup = DivPopupAuteurs.width();
		var HauteurPopup = DivPopupAuteurs.height();

		// Faire apparaitre la pop-up et ajouter le bouton de fermeture
		DivPopupAuteurs.fadeIn().css({
			'width': LargeurPopup
		}).prepend('<a href="#" class="close"><img src="https://www.developpez.com/template/kit/fermeture-icone.png" class="CloturePopup" title="Fermer Pop-pup" alt="fermeture" /></a>');

		// Margin du pop-up pour centrer le pop-up
		// Ajustement avec le CSS de 80px
		var MarginTopPopup  = (HauteurPopup + 80 ) / 2;
		var MarginLeftPopup = (LargeurPopup + 80 ) / 2;

		// Affectation du margin
		DivPopupAuteurs.css({
			'margin-top' : -MarginTopPopup,
			'margin-left' : -MarginLeftPopup
		});

		// Effet fade-in du fond opaque
		jQuery('body').append('<div id="fade"></div>'); //Ajout du fond opaque noir
		// Apparition du fond - .css({'filter' : 'alpha(opacity=80)'}) pour corriger les bogues de IE
		jQuery('#fade').css({'filter' : 'alpha(opacity=80)'}).fadeIn();

		return false;
	});

	// Fermeture de la pop-up et du fond
	// Au clic sur le bouton ou sur le calque...
	jQuery('a.close, #fade').on('click', function() {
		jQuery('#fade , .popup_block').fadeOut(function() {
			jQuery('#fade, a.close').remove();  //...ils disparaissent ensemble
		});
		return false;
	});
}

/* Nombre de vues de la page */
function afficher_nb_vues( nb ) {
	jQuery("#NbrVues").text(nb);
	
	if ( nb > 0 ) { 
		jQuery(".TextNbrVues").css("display", "block"); 
	}
}

/* Avant d'éviter d'avoir un grand espace blanc pour les vidéos MP4 géré par flowplayer, 
   on a mis une largeur quelconque pour centrer le div et ensuite, au clic sur l'image
   on redimensionne avec la vraie taille de la vidéo.
*/
function redimensionner_video (id, largeur, hauteur) {
	var $balise = jQuery('#' + id);
	// Balise a
	$balise.attr('style', "display:block;width:" + largeur + "px;height:" + hauteur + "px;");	
	// Balise parent qui est une div
	hauteur = parseInt(hauteur) + 30; // Heuteur environ d'une ligne pour contenir la titre de la vidéo
	$balise.parent().attr('style', "margin:0 auto;width:" + largeur + "px;height:" + hauteur + "px;");	
}

function SuppTexteTemp (id) {
	jQuery('#' + id).css('display','none');
}

/* Détection des mobiles, tablettes */
function isDeviceMobile(){

	var isMobile = {
		Android: function() {
			return navigator.userAgent.match(/Android/i);// && navigator.userAgent.match(/mobile|Mobile/i);
		},
		BlackBerry: function() {
			return navigator.userAgent.match(/BlackBerry/i);//|| navigator.userAgent.match(/BB10; Touch/);
		},
		iOS: function() {
			return navigator.userAgent.match(/iPhone|iPod/i);
		},
		Opera: function() {
			return navigator.userAgent.match(/Opera Mini/i);
		},
		Windows: function() {
			return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/webOS/i) ;
		},
		any: function() {
			return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
		}
	};
	return isMobile.any()
}

// éviter de charger MathJax inutilement
if ( window.MathJax ) { 
	MathJax.Ajax.timeout = 20 * 1000;  // 5 seconds rather than 15 seconds timeout for file access
	MathJax.Hub.Register.StartupHook(
		"HTML-CSS Jax Startup",function () {
			MathJax.OutputJax["HTML-CSS"].Font.timeout = 20 * 1000; // 5 second  rather than 5 second font timeout
		}
	);

	window.MathJax.Hub.Config({
		tex2jax: {
		  inlineMath: [ ["kitxmlcodeinlinelatexdvp","finkitxmlcodeinlinelatexdvp"] ],
		  displayMath: [ ["kitxmlcodelatexdvp","finkitxmlcodelatexdvp"] ],
		  processEscapes: true,
		  processRefs: false
		},
		menuSettings: {
			zoom: "Hover",
			mpContext: true,
			mpMouse: true
		},
		"HTML-CSS": { availableFonts: ["TeX"] },
		//imageFont: null,
		webFont: "TeX"
	});
}

	/* Cas spécifique des mobiles */
function casMobile(){
	var LargeurEcran      = $( window ).width();
	var LargeurEcranVideo = LargeurEcran - 50;
	
	/* On réduit la largeur des vidéos à la largeur maximale - 50 */
	jQuery("iframe").each(function() { 
		var larg = jQuery(this).attr('width');
		if ( larg && larg > LargeurEcran ) { jQuery(this).attr('width',LargeurEcranVideo); }
		//console.log('iframe = ' + larg + '[' + LargeurEcran + ']');
	});
	jQuery("video").each(function() { 
		var larg = jQuery(this).attr('width');
		if ( larg && larg > LargeurEcran ) { jQuery(this).attr('width',LargeurEcranVideo); }
	});
	jQuery("object").each(function() { 
		var larg = jQuery(this).attr('width');
		if ( larg && larg > LargeurEcran ) { jQuery(this).attr('width',LargeurEcranVideo); }
	});
}



