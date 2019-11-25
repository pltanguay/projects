/****************************************************************************
 * Fichier: membrePremium.cpp
 * Auteur: Melody Roy (1991902) et Pier-Luc Tanguay (1953707)
 * Date: 8 octobre 2019
 * Description: Impl�mentation de la classe MembrePremium
 *				(surcharge op�rateurs et vecteurs)
 ****************************************************************************/

#include "membreRegulier.h"

//Constructeur
MembreRegulier::MembreRegulier(const string& nom, TypeMembre typeMembre)
	: Membre(nom,typeMembre), points_(0)
{
}


//Getters
int MembreRegulier::getPoints() const
{
	return points_;
}

vector<Coupon*> MembreRegulier::getCoupons() const
{
	return coupons_;
}

/****************************************************************************
 * Fonction:	MembreRegulier::acheterCoupon
 * Description: Ajoute le coupon au tableau de coupons si le membre poss�de assez de points.
				Modifie le nombre de points que poss�de le membre.
 * Param�tres:	- (Coupon*) coupon : le coupon � acheter
 * Retour:		aucun
 ****************************************************************************/
void MembreRegulier::acheterCoupon(Coupon* coupon)
{
	if (points_ > coupon->getCout()) {
		*this += coupon;
		modifierPoints(-coupon->getCout());
	}
}
/****************************************************************************
 * Fonction:	MembreRegulier::ajouterBillet
 * Description: Cr�e et ajoute un billet au membre � partir des param�tres re�us.
				Modifie aussi le nombre de points du membre.
 * Param�tres:	- (const string&) pnr : num�ro de r�servation du nouveau billet
				- (double) prix : prix final du nouveau billet
				- (const string&) od : origine - destination du nouveau billet
				- (TarifBillet) tarif : type de tarif du nouveau billet
				- (TypeBillet typeBillet) : type de billet du nouveau billet
				- (const string&) dateVol : date du vol du nouveau billet
 * Retour:		aucun
 ****************************************************************************/
void MembreRegulier::ajouterBillet(const string& pnr, double prix, const string& od, TarifBillet tarif, TypeBillet typeBillet, const string& dateVol) {
	
	static_cast<Membre*>(this)->ajouterBillet(pnr, prix, od, tarif, typeBillet, dateVol);

	modifierPoints(calculerPoints(billets_[billets_.size()-1]));
}


/****************************************************************************
 * Fonction:	 MembreRegulier::operator+=
 * Description: Ajoute un coupon au membre.
 * Param�tres:	- (Coupon*) coupon : coupon � ajouter au membre
 * Retour:		(Membre&) Retourne un �l�ment membre courant pour l'appel en cascade
 ****************************************************************************/
Membre& MembreRegulier::operator+=(Coupon* coupon)
{
	coupons_.push_back(coupon);

	return *this;
}

/****************************************************************************
 * Fonction:	MembreRegulier::operator-=
 * Description: Retirer un coupon au membre.
 * Param�tres:	- (Coupon*) coupon : coupon � retirer au membre
 * Retour:		(Membre&) Retourne un �l�ment membre courant pour l'appel en cascade
 ****************************************************************************/
Membre& MembreRegulier::operator-=(Coupon* coupon)
{
	for (unsigned int i = 0; i < coupons_.size(); i++) {
		if (coupons_[i] == coupon) {
			coupons_[i] = coupons_[coupons_.size() - 1];
			coupons_.pop_back();
			return *this;
		}
	}

	return *this;
}

/****************************************************************************
 * Fonction:	MembreRegulier::modifierPoints
 * Description: Modifie les points du membre
 * Param�tres:	- (int) points: les points � ajouter (ou retirer)
 * Retour:		aucun
 ****************************************************************************/
void MembreRegulier::modifierPoints(int points)
{
	points_ += points;
}

/****************************************************************************
 * Fonction:	MembreRegulier::calculerPoints
 * Description: Calcule le nombre de point que rapporte un billet.
				(10 % de son prix + points bonus selon le tarif)
 * Param�tres:	- (Billet*)  billet : le billet dont nous calculons les points
 * Retour:		Retourne le nombre de points rapport�s
 ****************************************************************************/
double MembreRegulier::calculerPoints(Billet* billet) const
{
	double bonus = 0;
	switch (billet->getTarif()) {
	case TarifBillet::PremiumEconomie:
		bonus = 50;
		break;
	case TarifBillet::Affaire:
		bonus = 150;
		break;
	case TarifBillet::Premiere:
		bonus = 300;
		break;
	default:
		break;
	}

	return billet->getPrix() * 0.10 + bonus;
}
/****************************************************************************
 * Fonction:	MembreRegulier::operator<<
 * Description: Surcharge de l'operateur de flux de sortie pour afficher
 *				les attributs d'un Membre Regulier.
 * Param�tres:	- (ostream &) out : le flux de sortie
 *				- (const MembreRegulier &) membreRegulier : le membre a afficher
 * Retour:		(ostream&) Retourne flux de sorti pour l'appel en cascade
 ****************************************************************************/
ostream& operator<<(ostream& o, const MembreRegulier& membreRegulier)
{
	// Affiahge d'un membre de base
	Membre membre(membreRegulier);
	o << membre;

	// Afficahge d'extra puisque le membre est de type membre regulier
	o << "\t\t\t" << setw(11) << "- Points" << ": " << membreRegulier.points_ << endl;
	o << "\t\t\t" << setw(11) << "- Coupons" << ": ";

	// Affichage des coupons
	if (membreRegulier.coupons_.size() > 0) {
		for (unsigned int i = 0; i < membreRegulier.coupons_.size(); i++) {
			o << "\t\t\t\t\t\t" << membreRegulier.coupons_[i];
		}
	}
	else
		o << endl << endl;

	return o;
}