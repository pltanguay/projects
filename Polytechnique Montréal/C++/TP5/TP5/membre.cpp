/********************************************
* Titre: Travail pratique #5 - membre.cpp
* Date: 30 octobre 2019
* Auteur: Allan BEDDOUK & Jeffrey LAVALLEE
*******************************************/

#include "membre.h"

Membre::Membre() :
	nom_("")
{
}

Membre::Membre(const string& nom) :
	nom_(nom)
{
}

//todo
Membre::Membre(const Membre& membre) :
	nom_(membre.nom_)
{
	for (auto it = membre.getBillets().begin(); it != membre.getBillets().end(); ++it) {
		billets_.push_back((*it)->clone());
	}
}

//todo
Membre::~Membre()
{
	// Boucle par itérateurs pour détruire chacun des billets
	for_each(billets_.begin(), billets_.end(), 
		[&](Billet* billet) {
		 delete billet;
		});
}

string Membre::getNom() const
{
	return nom_;
}

vector<Billet*> Membre::getBillets() const
{
	return billets_;
}

void Membre::setNom(const string& nom)
{
	nom_ = nom;
}

//todo implemente trouverBillet() signature dans le .h
// Ne peut pas être const à cause du find_if
vector<Billet*>::iterator Membre::trouverBillet(const string& pnr) {

	// Recherche d'un billet par son pnr, par find_if avec predicat
	// qui retourne vrai lorsque pnr égale celui du billet, le premier trouvé.
	return find_if(billets_.begin(), billets_.end(),
		[&](Billet const* billet)
		{
			return billet->getPnr() == pnr;
		});
}


//todo
void Membre::utiliserBillet(const string& pnr)
{
	// Utilisation de la fonction trouverBilletconst string& pnr
	auto billetTrouve = trouverBillet(pnr);

	// Si le billet n'existe pas
	if (billetTrouve == billets_.end()) {
		cout << "Le billet n'est pas trouve" << endl;
		return;
	}

	// Si le billet trouvé est FlightPass*
	if (auto flightPass = dynamic_cast<FlightPass*>(*billetTrouve)) {
		flightPass->decrementeNbUtilisations();
		if (flightPass->getNbUtilisationsRestante() > 0) {
			return;
		}

	}

	// Désalloué la mémoire du billet trouvé
	delete* billetTrouve;

	// Suprimer le billet trouvé
	billets_.erase(billetTrouve);
}

void Membre::ajouterBillet(Billet* billet)
{
	billet->setNomPassager(nom_);
	billets_.push_back(billet);
}

bool Membre::operator==(const string& nomMembre) const
{
	return nom_ == nomMembre;
}

bool operator==(const string& nomMembre, const Membre& membre)
{
	return nomMembre == membre.nom_;
}


//todo
Membre& Membre::operator=(const Membre& membre)
{
	// Si l'opérateur du membre this n'appelle pas lui même
	if (this != &membre) {
		nom_ = membre.nom_;

		// On désalloue chaque billet
		for_each(billets_.begin(), billets_.end(),
			[&](Billet* billet) {
				delete billet;
			});

		billets_.clear();

		// On appelle clone pour réaffecter la liste de billet
		for (auto it = membre.getBillets().begin(); it != membre.getBillets().end(); ++it) {
			billets_.push_back((*it)->clone());
		}
	}

	return *this;
}


//todo
void Membre::afficher(ostream& o) const
{
	o << setfill(' ');
	o << "- Membre " << nom_ << ":" << endl;
	o << "\t" << "- Billets :" << endl;

	// Affichage en copiant dans l'adaptateur d'itérateur de sortie vers le flux out
	copy(billets_.begin(), billets_.end(), std::ostream_iterator<Billet*>(o, "\n"));
}