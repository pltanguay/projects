/****************************************************************************
 * Fichier: membrePremium.cpp
 * Auteur: Melody Roy (1991902) et Pier-Luc Tanguay (1953707)
 * Date: 8 octobre 2019
 * Description: Implémentation de la classe membrePremium
 *				(surcharge opérateurs et vecteurs)
 ****************************************************************************/

#include "membrePremium.h"

//Constructeur
MembrePremium::MembrePremium(const string& nom)
	: 
	MembreRegulier(nom, Membre_Premium), 
	joursRestants_(JOUR_RESTANT_INITIALE), pointsCumules_(0)
{
}

//getters
unsigned int MembrePremium::getJourRestants() const {
	return joursRestants_;
}

unsigned int MembrePremium::getpointsCumulee() const {
	return pointsCumules_;

}

//setters
void MembrePremium::setJourRestants(unsigned int joursRestants) {
	joursRestants_ = joursRestants;
}

/****************************************************************************
 * Fonction:	MembrePremium::modifierPointsCumules
 * Description: Modifie les points cumules du membre
 * Paramètres:	- (int) pointsCumulee: les points cumules à ajouter (ou retirer)
 * Retour:		aucun
 ****************************************************************************/
void MembrePremium::modifierPointsCumules(unsigned int pointCumulee) {
	pointsCumules_ += pointCumulee;
}

/****************************************************************************
 * Fonction:	MembrePremium::ajouterBillet
 * Description: Crée et ajoute un billet au membre à partir des paramètres reçus.
				Modifie aussi le nombre de points et de points cumules du membre.
 * Paramètres:	- (const string&) pnr : numéro de réservation du nouveau billet
				- (double) prix : prix final du nouveau billet
				- (const string&) od : origine - destination du nouveau billet
				- (TarifBillet) tarif : type de tarif du nouveau billet
				- (TypeBillet) typeBillet : type de billet du nouveau billet
				- (const string&) dateVol : date du vol du nouveau billet
 * Retour:		aucun
 ****************************************************************************/
void MembrePremium::ajouterBillet(const string& pnr, double prix, const string& od,
	TarifBillet tarif, TypeBillet typeBillet, const string& dateVol) {
	
	static_cast<MembreRegulier*>(this)->ajouterBillet(pnr, prix, od, tarif, typeBillet, dateVol);
	modifierPointsCumules(calculerPoints(billets_[billets_.size()-1]));
}

/****************************************************************************
 * Fonction:	MembrePremium::acheterCoupon
 * Description: Ajoute le coupon au tableau de coupons si le membre possède assez de points.
				Modifie le nombre de points que possède le membre.
 * Paramètres:	- (Coupon*) coupon : le coupon à acheter
 * Retour:		aucun
 ****************************************************************************/
void MembrePremium::acheterCoupon(Coupon* coupon) {

	// On calcul le cout avec rabais
	int coutAvecRabais = coupon->getCout() - (double(points_) / TRANCHE_RABAIS * POURCENTAGE * coupon->getCout());

	// Si le nombre de points du membre est supérieur au nouveau cout
	if (points_ > coutAvecRabais) {

		// On assigne un rabais par défaut au maximum (20%)
		double rabais = RABAIS_MAXIMUM;

		// Si le membre est en dessus du rabais maximum
		if (pointsCumules_ < POINTS_MAXIMUM)
			modifierPoints(-coutAvecRabais);
		// Sinon, on calcul un nouveau rabais
		else
			modifierPoints(-(coupon->getCout() * (1 - rabais)));
		coupons_.push_back(coupon);
	}
}

/****************************************************************************
 * Fonction:	MembrePremium::operator<<
 * Description: Surcharge de l'operateur de flux de sortie pour afficher
 *				les attributs d'un Membre Premium.
 * Param?tres:	- (ostream &) out : le flux de sortie
 *				- (const MembrePremium &) membrePremium : le membre a afficher
 * Retour:		(ostream&) Retourne flux de sorti pour l'appel en cascade
 ****************************************************************************/
ostream& operator<<(ostream& os, const MembrePremium& membrePremium) {

	// Affichage d'un membreRegulier
	os << MembreRegulier(membrePremium);

	// Affichage d'extra puiqu'il est un membre Premium
	os << "\t\t\t" << setw(11) << "- Points Cumulee" << ": " << membrePremium.pointsCumules_ << " points" << endl;
	os << "\t\t\t" << setw(11) << "- Jours premium restant" << ": " << membrePremium.joursRestants_ << " jours" << endl;
	
	return os;

}
