/********************************************
* Titre: Travail pratique #5 - MembrePremium.cpp
* Date: 30 octobre 2019
* Auteur: Allan BEDDOUK & Jeffrey LAVALLEE
*******************************************/

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

double MembrePremium::calculerCoutCoupon(Coupon* coupon) const
{
	double rabais = 0.01 * pointsCumulee_ / 1000;

	if (rabais > 0.2)
		rabais = 0.2;

	return coupon->getCout() * (1 - rabais);
}

bool MembrePremium::peutAcheterCoupon(Coupon* coupon) const
{
	return points_ >= calculerCoutCoupon(coupon);
}

void MembrePremium::acheterCoupon(Coupon* coupon)
{
	if (peutAcheterCoupon(coupon)) {
		*this += coupon;
		modifierPoints(-calculerCoutCoupon(coupon));
	}
}

void MembrePremium::afficher(ostream& o) const
{
	MembreRegulier::afficher(o);
	o << "\t- Points cumulee: " << pointsCumulee_ << endl;
	o << "\t- Jours premium restant: " << joursRestants_ << endl << endl;
}