/****************************************************************************
 * Fichier: billet.cpp
 * Auteur: Melody Roy (1991902) et Pier-Luc Tanguay (1953707)
 * Date: 17 septembre 2019
 * Description: Implementation de la classe Billet
 ****************************************************************************/

#include "billet.h"

// Constructeurs
Billet::Billet() :
	pnr_("0"), prix_(0.00), od_("UKN - UKN"), tarif_(TarifBillet::Economie),
	dateVol_("0000-00-00") {}

Billet::Billet(const string& pnr, const string& nomPassager,
	double prix, const string& od, TarifBillet tarif, const string& dateVol): 
		 pnr_(pnr), nomPassager_(nomPassager), prix_(prix), od_(od), 
		 tarif_(tarif), dateVol_(dateVol) {}

// Destructeur. Il n'est pas nécessaire de l'implanter, mais nous voulions voir quand elle est appelée
Billet::~Billet() {
	cout << "Destruction d'un billet !" << endl;
}

// Getters
string Billet::getPnr() const {
	return pnr_;
}

string Billet::getNomPassager() const {
	return nomPassager_;
}

double Billet::getPrix() const {
	return prix_;
}

string Billet::getOd() const {
	return od_;
}

TarifBillet Billet::getTarif() const {
	return tarif_;
}

string Billet::getDateVol() const {
	return dateVol_;
}

// Setters
void Billet::setPnr(const string& pnr) {
	pnr_ = pnr;
}

void Billet::setNomPassager(const string& nomPassager) {
	nomPassager_ = nomPassager;
}

void Billet::setPrix(double prix) {
	prix_ = prix;
}

void Billet::setOd(const string& od) {
	od_ = od;
}
void Billet::setTarif(TarifBillet tarif) {
	tarif_ = tarif;
}
void Billet::setDateVol(const string& dateVol) {
	dateVol_ = dateVol;
}

// Méthodes:

/****************************************************************************
 * Fonction:	Billet::formatTarif
 * Description: Converti le type de tarif tiré de l’enum TarifBillet à la chaîne de caractère correspondante.
 * Paramètres:	- (TarifBillet) tarif : le tarif du billet
 * Retour:		Retourne le tarif en format caractère
 ****************************************************************************/
string Billet::formatTarif(TarifBillet tarif) const {
	string typeTarif;
	switch (tarif) {
	case TarifBillet::Economie: 
		typeTarif = "Economie";
		break;
	case TarifBillet::Affaire: 
		typeTarif = "Affaire"; 
		break;
	case TarifBillet::Premiere: 
		typeTarif = "Premiere";
		break;
	case TarifBillet::PremiumEconomie: 
		typeTarif = "Premium economie";
		break;
	}
	return typeTarif;
}


/****************************************************************************
 * Fonction:	Billet::afficherBillet
 * Description: Affiche les informations du billet
 * Paramètres:	- aucun
 * Retour:		- aucun
 ****************************************************************************/
void Billet::afficherBillet() const {
	cout << "          - Billet : " << pnr_ << " (Classe : " << formatTarif(tarif_) << ")" << endl
		<< "          - Passager : " << getNomPassager() << endl
		<< "          - Prix : " << getPrix() << "$" << endl
		<< "          - Trajet : " << getOd() << endl
		<< "          - Vol le : " << getDateVol() << endl << endl;
} 
