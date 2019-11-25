/*
* Titre : membrePremium.cpp - Travail Pratique #4
* Date : 5 Octobre 2019
* Auteur : Philippe CÔTÉ-MORNEAULT
*/

#include "membrePremium.h"

MembrePremium::MembrePremium(const string& nom) : 
	MembreRegulier(nom), joursRestants_(JOUR_RESTANT_INITIALE), pointsCumulee_(0)
{
}

void MembrePremium::setJourRestants(unsigned int joursRestants)
{
	joursRestants_ = joursRestants;
}

void MembrePremium::modifierPointsCumulee(unsigned int pointCumulee)
{
	pointsCumulee_ += pointCumulee;
}

unsigned int MembrePremium::getJourRestants() const
{
	return joursRestants_;
}

unsigned int MembrePremium::getpointsCumulee() const
{
	return pointsCumulee_;
}

void MembrePremium::ajouterBillet(Billet* billet)
{
	MembreRegulier::ajouterBillet(billet);
	modifierPointsCumulee(calculerPoints(billets_.back()));
}

double MembrePremium::calculerCoutCoupon(Coupon* coupon)
{
	double rabais = 0.01 * pointsCumulee_ / 1000;

	if (rabais > 0.2)
		rabais = 0.2;

	return coupon->getCout() * (1 - rabais);
}

// TODO
bool MembrePremium::peutAcheterCoupon(Coupon* coupon)
{
	// "Faux" par défaut
	bool peutAcheterCoupon = false;

	if (points_ >= calculerCoutCoupon(coupon)) // Devient "Vrai" si assez de coupon
		peutAcheterCoupon = true;
	return peutAcheterCoupon;
}

void MembrePremium::acheterCoupon(Coupon* coupon)
{
	if (peutAcheterCoupon(coupon)) {
		*this += coupon;
		modifierPoints(-calculerCoutCoupon(coupon));
	}
}

// TODO: Retirer cette fonction par afficher()
/*ostream& operator<<(ostream& os, const MembrePremium& membrePremium)
{
	os << "\t- Points cumulee: " << membrePremium.pointsCumulee_ << endl;
	os << "\t- Jours premium restant: " << membrePremium.joursRestants_ << endl;
	return os << endl;
}*/

// TODO
void MembrePremium::afficher(ostream& o)
{
	MembreRegulier::afficher(o);

	o << "\t- Points cumulee: " << pointsCumulee_ << endl;
	o << "\t- Jours premium restant: " << joursRestants_ << endl;
}