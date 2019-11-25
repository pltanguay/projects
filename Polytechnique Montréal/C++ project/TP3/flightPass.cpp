/****************************************************************************
 * Fichier: flightPass.cpp
 * Auteur: Melody Roy (1991902) et Pier-Luc Tanguay (1953707)
 * Date: 8 octobre 2019
 * Description: Implementation de la classe FlightPass 
 *				(surcharge opérateurs et vecteurs)
 ****************************************************************************/

#include "flightPass.h"

// Constructeur
FlightPass::FlightPass(const string& pnr, const string& nomPassager, double prix, const string& od, TarifBillet tarif, TypeBillet typeBillet)
	: Billet(pnr, nomPassager, prix, od, tarif, typeBillet),
	nbUtilisationsRestante_(NB_UTILISATIONS_INITIALE)
{
}

//Getters
int FlightPass::getNbUtilisationsRestante() const {
	return nbUtilisationsRestante_;
}

/****************************************************************************
 * Fonction:	Billet::decrementeNbUtilisations
 * Description: Reduit de 1 le nombre de billets restants
 * Paramètres:	aucun
 * Retour:		aucun
 ****************************************************************************/
void FlightPass::decrementeNbUtilisations() {
	nbUtilisationsRestante_--;
}

/****************************************************************************
 * Fonction:	FlightPass::operator<<
 * Description: Surcharge de l'operateur de flux de sortie pour afficher
 *				les attributs d'un Billet de type FlightPass.
 * Paramètres:	- (ostream&) out : le flux de sortie
 *				- (const FlightPass&) flightpass : le billet a afficher
 * Retour:		(ostream&) Retourne flux de sorti pour l'appel en cascade
 ****************************************************************************/
ostream& operator<<(ostream& os, const FlightPass& flightpass) {
	//os << static_cast<Billet>(flightpass);


	// Affichage billet de base
	os << Billet(flightpass);

	// Affichage d'extra puisque le Billet FlightPass a une utilisation restante

	os << "\t\t\t" << setw(11) << "- Utilisation restante" << ": " << flightpass.nbUtilisationsRestante_ << endl << endl;

	return os;
}
