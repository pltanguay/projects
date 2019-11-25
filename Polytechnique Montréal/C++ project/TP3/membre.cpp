/****************************************************************************
 * Fichier: membre.cpp
 * Auteur: Melody Roy (1991902) et Pier-Luc Tanguay (1953707)
 * Date: 8 octobre 2019
 * Description: Implémentation de la classe Membre
 *				(surcharge opérateurs et vecteurs)
 ****************************************************************************/

#include "membre.h"

//Constructeur
Membre::Membre() :
	nom_(""),
	typeMembre_(TypeMembre::Membre_Occasionnel)
{
}

Membre::Membre(const string& nom, TypeMembre typeMembre) :
	nom_(nom),
	typeMembre_(typeMembre)
{
}

Membre::Membre(const Membre& membre) :
	nom_(membre.nom_),
	typeMembre_(membre.typeMembre_)
{
	// Pour le constructeur de copie, on doit réassigner les billets
	for (size_t i = 0; i < membre.billets_.size(); ++i) {
		switch (membre.billets_[i]->getTypeBillet()) {

		case TypeBillet::Billet_Regulier:
			billets_.push_back(new BilletRegulier(*static_cast<BilletRegulier*>(membre.billets_[i])));
			break;

		case TypeBillet::Flight_Pass:
			billets_.push_back(new FlightPass(*static_cast<FlightPass*>(membre.billets_[i])));
			break;
		}
	}

}

// Destructeur
Membre::~Membre()
{
	for (unsigned int i = 0; i < billets_.size(); i++) {
		delete billets_[i];
	}

	// Libération de la mémoire vecteur
	billets_.clear();
}

//Getters
string Membre::getNom() const
{
	return nom_;
}

vector<Billet*> Membre::getBillets() const
{
	return billets_;
}

TypeMembre Membre::getTypeMembre() const {
	return typeMembre_;
}

//Setter
void Membre::setNom(const string& nom)
{
	nom_ = nom;
}

/****************************************************************************
 * Fonction:	Membre::ajouterBillet
 * Description: Crée et ajoute un billet au membre à partir des paramètres reçus.
				Modifie aussi le nombre de points du membre.
 * Paramètres:	- (const string&) pnr : numéro de réservation du nouveau billet
				- (double) prix : prix final du nouveau billet
				- (const string&) od : origine - destination du nouveau billet
				- (TarifBillet) tarif : type de tarif du nouveau billet
				- (TypeBillet) typeBillet : type de billet du nouveau billet
				- (const string&) dateVol : date du vol du nouveau billet
 * Retour:		aucun
 ****************************************************************************/
void Membre::ajouterBillet(const string& pnr, double prix, const string& od, TarifBillet tarif, TypeBillet typeBillet, const string& dateVol)
{

	// Création de l'objet selon le type de billet
	if (typeBillet == TypeBillet::Billet_Regulier) {
		BilletRegulier* billet = new BilletRegulier(pnr, nom_, prix, od, tarif, dateVol, typeBillet);
		billets_.push_back(static_cast<Billet*>(billet));
	}

	else {
		FlightPass* billet = new FlightPass(pnr, nom_, prix, od, tarif, typeBillet);
		billets_.push_back(static_cast<Billet*>(billet));
	}
}

/****************************************************************************
 * Fonction:	Membre::utiliserBillet
 * Description: Utilise un billet soit en décrémentant le nombre de billet 
		        (flightpass) ou en le supprimant de la liste
 * Paramètres:	- (const string&) pnr : le pnr du billet que l'on veut utiliser
 * Retour:		aucun
 ****************************************************************************/
void Membre::utiliserBillet(const string& pnr) {
	for (unsigned int i = 0; i < billets_.size(); i++) {

		// Trouver le billet
		if (billets_[i]->getPnr() == pnr) {

			// S'il est de type FlightPass
			if (billets_[i]->getTypeBillet() == Flight_Pass) {

				FlightPass* billet = static_cast<FlightPass*>(billets_[i]);
				billet->decrementeNbUtilisations();

				// S'il n'y a plus d'utilisation restante
				if (billet->getNbUtilisationsRestante() == 0){
					billets_[i] = billets_.back();

					// Désallouer la mémoire du billet regulier utilisé
					delete billet;
					billets_.pop_back();
				}
			}
			// S'il n'est pas un FlightPass, il est un billet regulier
			else {
				*billets_[i] = *billets_[billets_.size()-1];

				// Désallouer la mémoire du billet Flightpass utilisé

				delete billets_[billets_.size() - 1];
				billets_.pop_back();
			}
			break;
		}
	}
}

/****************************************************************************
 * Fonction:	Membre::operator==
 * Description: Surcharge de l'operateur de comparaison "est egal a" pour
				comparer le nom d'un membre et d'une chaine de characteres.
 * Paramètres:	(String) nom : le nom du passager a comparer a celui du membre
 * Retour:		(bool) Retourne vrai si le nom du membre en paramètre est égale à "nom"
 ****************************************************************************/
bool Membre::operator==(const string& nomMembre) const
{
	return nom_ == nomMembre;
}

/****************************************************************************
 * Fonction (globale):	 Membre::operator==
 * Description: Surcharge de l'operateur de comparaison "est egal a" pour
				comparer le nom d'un membre et d'une chaine de caractères.
 * Paramètres:	- (String) nomString : la chaine de charactere
				- (Membre&) membre : le membre qu l'on veut comparer
 * Retour:		(bool) Retourne vrai si "nom" est égale au nom du membre en paramètre
 ****************************************************************************/
bool operator==(const string& nomMembre, const Membre& membre)
{
	return nomMembre == membre.nom_;
}

/****************************************************************************
 * Fonction:	Membre::operator=
 * Description: Surcharge de l'operateur d'assignation entre deux membres, en cascade.
 * Paramètres:	(const Membre&) membre: membre objet
 * Retour:		(Membre&) Retourne un élément membre courant pour l'appel en cascade
 ****************************************************************************/
Membre& Membre::operator=(const Membre& membre)
{
	if (this != &membre) {
		nom_ = membre.nom_;
		typeMembre_ = membre.typeMembre_;


		for (unsigned int i = 0; i < billets_.size(); ++i) {
			delete billets_[i];
		}

		billets_.clear();

		for (unsigned int i = 0; i < membre.billets_.size(); i++) {
			billets_.push_back(new Billet(*membre.billets_[i]));
		}
	}

	return *this;
}

/****************************************************************************
 * Fonction:	Membre::operator<<
 * Description: Surcharge de l'operateur de flux de sortie pour afficher
 *				les attributs d'un Membre.
 * Paramètres:	- (ostream &) out : le flux de sortie
 *				- (const Membre &) membre : le membre a afficher
 * Retour:		(ostream&) Retourne flux de sorti pour l'appel en cascade
 ****************************************************************************/
ostream& operator<<(ostream& o, const Membre& membre)
{
	o << setfill(' ');
	o << "- Membre " << membre.nom_ << ":" << endl;
	//o << "\t" << left << setw(10) << "- Points" << ": " << membre.points_ << endl;
	o << "\t" << "- Billets :" << endl;

	for (unsigned int i = 0; i < membre.billets_.size(); i++) {

		// Affichage des billets selon le type
		if (membre.billets_[i]->getTypeBillet() == Billet_Regulier)
			o << *static_cast<BilletRegulier*>(membre.billets_[i]);
		else 
			o << *static_cast<FlightPass*>(membre.billets_[i]);
	}

	return o << endl;
}
