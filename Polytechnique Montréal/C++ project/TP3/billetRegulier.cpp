/****************************************************************************
 * Fichier: billetRegulier.cpp
 * Auteur: Melody Roy (1991902) et Pier-Luc Tanguay (1953707)
 * Date: 8 octobre 2019
 * Description: Implementation de la classe BilletRegulier 
 *				(surcharge opérateurs et vecteurs)
 ****************************************************************************/

#include "billetRegulier.h"

//Constructeur
BilletRegulier::BilletRegulier(const string& pnr, const string& nomPassager,
	double prix, const string& od, TarifBillet tarif,
	const string& dateVol, TypeBillet typeBillet) 
	: Billet(pnr,nomPassager,prix, od, tarif,typeBillet), dateVol_(dateVol)
{
}

//Getters
string BilletRegulier::getDateVol() const
{
	return dateVol_;
}

//Setters
void BilletRegulier::setDateVol(string dateVol)
{
	dateVol_ = dateVol;
}

/****************************************************************************
 * Fonction:	BilletRegulier::operator<<
 * Description: Surcharge de l'operateur de flux de sortie pour afficher
 *				les attributs d'un Billet Regulier.
 * Paramètres:	- (ostream&) out : le flux de sortie
 *				- (const Billet&) billet : le billet a afficher
 * Retour:		(ostream&) Retourne flux de sorti pour l'appel en cascade
 ****************************************************************************/
ostream& operator<<(ostream& o, const BilletRegulier& billet)
{
	string date = billet.dateVol_;

	// Affichage du billet de base
	o << Billet(billet);

	// Affichage d'extra puisque le Billet Regulier a une date de vol
	o << "\t\t\t" << setw(11) << "- Vol le" << ": " << date << endl << endl;
	return o;
}