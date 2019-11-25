/********************************************
* Titre: Travail pratique #5 - gestionnaireMembres.cpp
* Date: 30 octobre 2019
* Auteur: Allan BEDDOUK & Jeffrey LAVALLEE
*******************************************/

#include "GestionnaireMembres.h"
#include <numeric>
#include <algorithm>


void GestionnaireMembres::assignerBillet(Billet* billet, const string& nomMembre, int rabaisCoupon)
{
	Membre* membre = conteneur_[nomMembre];

	if (membre == nullptr) {
		delete billet;
		return;
	}

	double prix = billet->getPrix();

	if (auto solde = dynamic_cast<Solde*>(billet)) {
		prix = solde->getPrixBase();
	}

	
	prix -= rabaisCoupon;
	

	if (auto membrePremium = dynamic_cast<MembrePremium*>(membre)) {
		double rabais = 0.005 * membrePremium->getpointsCumulee() / 1000;
		if (rabais > 0.1)
			rabais = 0.1;

		prix *= (1 - rabais);
	}

	billet->setPrix(prix);
	membre->ajouterBillet(billet);
}



double GestionnaireMembres::calculerRevenu() const
{
	//TODO
	double revenu = 0;

	auto it_debut = conteneur_.begin();
	auto it_fin = conteneur_.end();

	// Boucle partant du premier élément jusqu'au dernier. Chaque élément (Membre*) 
	// pointe vers un vecteur billet
	for (auto it = it_debut; it != it_fin; ++it) {

		// On récupère l'objet Membre*
		Membre* membre = it->second;

		// Déclaration d'un vector de Billet* contenant les billets du membre
		vector<Billet*> billetsMembre_ = membre->getBillets();

		// Éléments début et fin
		auto vecteurBilletsDebut = billetsMembre_.begin();
		auto vecteurBilletsFin = billetsMembre_.end();

		// Pour chaque élément, on addition le prix du billet au revenue, par fonction au 3e paramètre
		for_each(vecteurBilletsDebut, vecteurBilletsFin, 
			[&](Billet* billet) { revenu += billet->getPrix(); });
	}

	return revenu;
}

int GestionnaireMembres::calculerNombreBilletsEnSolde() const
{
	//TODO
	int nbBilletsSolde = 0;

	auto debut = conteneur_.begin();
	auto fin = conteneur_.end();

	// Boucle partant du premier élément jusqu'au dernier. Chaque élément (Membre*) 
	// pointe vers un vecteur billet
	for (auto it = debut; it != fin; ++it) {

		// On récupère l'objet Membre*
		Membre* membre = it->second;

		// Déclaration d'un vector de Billet* contenant les billets du membre
		vector<Billet*> billetsMembre_ = membre->getBillets();

		auto vecteurBilletsDebut = billetsMembre_.begin();
		auto vecteurBilletsFin = billetsMembre_.end();
		
		// Pour chaque élément, on vérifie par la fonction si on peut convertir en Solde*, 
		// si oui on incrémente nbBilletSolde
		for_each(vecteurBilletsDebut, vecteurBilletsFin, 
			[&](Billet* billet) { 
				if (dynamic_cast<Solde*>(billet)) nbBilletsSolde++; 
			});
	}

	return nbBilletsSolde;
}

void GestionnaireMembres::afficher(ostream& o) const
{
	//TODO
	o << "=================== ETAT ACTUEL DU PROGRAMME ==================\n\n";

	for (auto it = conteneur_.begin(); it != conteneur_.end(); ++it) {
		it->second->afficher(o);
	}
}

//TODO
Billet* GestionnaireMembres::getBilletMin(const string& nomMembre) const 
{
	// Accès à l'objet Membre* dans la map correspondant à la clée nomMembre
	auto it = conteneur_.at(nomMembre);


	// On récupère le vecteur de Billet*
	vector<Billet*> billetsMembre_ = it->getBillets();

	auto debut = billetsMembre_.begin();
	auto fin = billetsMembre_.end();

	// Puisque nous devons aller dans les attributs des objets Billet*, on
	// utilise ici une fonction lamba qui test et compare leur prix par leur méthode
	auto trouve = min_element(debut, fin, 
		[&](Billet* billet1, Billet* billet2) -> bool { 
			return billet1->getPrix() < billet2->getPrix(); 
		});

	return *trouve;
}

//TODO
Billet* GestionnaireMembres::getBilletMax(const string& nomMembre) const {

	// Accès à l'objet Membre* dans la map correspondant à la clée nomMembre
	auto it = conteneur_.at(nomMembre);

	// On récupère le vecteur de Billet*
	vector<Billet*> billetsMembre_ = it->getBillets();

	auto debut = billetsMembre_.begin();
	auto fin = billetsMembre_.end();

	// Puisque nous devons aller dans les attributs des objets Billet*, on
	// utilise ici une fonction lamba qui test et compare leur prix par leur méthode
	auto trouve = max_element(debut, fin,
		[&](Billet const* billet1, Billet const* billet2) -> bool {  
			return billet1->getPrix() < billet2->getPrix(); 
		});

	return *trouve;
}

//TODO
vector<Billet*> GestionnaireMembres::trouverBilletParIntervalle(Membre* membre, double prixInf, double prixSup) const {
	
	// Déclaration d'un vecteur de billets qui respecteront l'intervalle
	vector<Billet*> billetsIntervalle;
	
	// Récipération de la liste complète des billets du membre
	vector<Billet*> billetsMembre = membre->getBillets();

	auto debut = billetsMembre.begin();
	auto fin = billetsMembre.end();


	// On copy les billets acceptés (testé grâce à la fonction lambda) à la fin du conteneur billetsIntervalle
	copy_if(debut, fin, back_inserter(billetsIntervalle), [&](Billet* billet) { 
			return IntervallePrixBillet(prixInf, prixSup)(billet);
			});
		
	
	return billetsIntervalle;
}

