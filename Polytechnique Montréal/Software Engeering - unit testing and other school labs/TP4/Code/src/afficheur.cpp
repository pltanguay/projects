
#include "afficheur.h"

Afficheur::Afficheur(Rabais* la_gestion_des_rabais) {
	this->gestion_rabais = la_gestion_des_rabais;
}

void Afficheur::affiche(Facture f, int id_client) {
	
	float rabais = this->gestion_rabais->getRabais(f, id_client);

    // Affichage des résultats.
	std::cout << "Pour la facture de " << this->gestion_rabais->getInfoClient(id_client) << std::endl;
	std::cout << "  Contenant : " << std::endl;
	for (int item=0 ; item<f.getSize() ; item++)
		std::cout << "    " << f.getItem(item) << std::endl;

	std::cout << "  Pour un rabais de " << rabais*100 << "%" << std::endl;
}

