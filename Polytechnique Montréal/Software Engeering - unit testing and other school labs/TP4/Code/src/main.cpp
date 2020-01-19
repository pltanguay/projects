
#include <iostream>

#include "rabais.h"
#include "facture.h"
#include "afficheur.h"

/**
 * Exemple d'utilisation des différents objets.
 */
int main(int argc, char** argv) {
	if (argc<2) {
		std::cout << "Err01 : besoin de fournir le nom du fichier des clients comme paramètre d'entrée" << std::endl;	
		return -1;
	}

    // Lit le fichier des clients.
	Rabais gestion_rabais(argv[1]);

	// Crée l'objet d'affichage.
	Afficheur afficheur(&gestion_rabais);

    // Crée une facture avec des montants.
	Facture une_facture;
	une_facture.ajouterItem(50.95);
	une_facture.ajouterItem(48.95);
	une_facture.ajouterItem(25.45);
	une_facture.ajouterItem(39.95);

    // Obtient le rabais pour la cliente #10456 qui est dans le fichier client.    
	afficheur.affiche(une_facture, 10456);

    // Fin normale du logiciel.
	return 0;
}


