/****************************************************************************
 * Fichier: membrePremium.h
 * Auteur: Melody Roy (1991902) et Pier-Luc Tanguay (1953707)
 * Date: 8 octobre 2019
 * Description:  D�finition de la classe MembrePremium
 ****************************************************************************/

#ifndef MEMBRE_PREMIUM_H
#define MEMBRE_PREMIUM_H


#include "membreRegulier.h"

class MembrePremium : public MembreRegulier {
public:
	//� faire
	MembrePremium(const string& nom);

	//setters
	//� faire
	void setJourRestants(unsigned int joursRestants);
	//� faire
	void modifierPointsCumules(unsigned int pointCumulee);


	//getters
	//� faire
	unsigned int getJourRestants() const;
	//� faire
	unsigned int getpointsCumulee() const;

	//� faire
	void ajouterBillet(const string& pnr, double prix, const string& od, TarifBillet tarif, TypeBillet typeBillet, const string& dateVol);
	//� faire
	void acheterCoupon(Coupon* coupon);

	//� faire
	friend ostream& operator<<(ostream& os, const MembrePremium& membrePremium);

private:
	unsigned int joursRestants_;
	unsigned int pointsCumules_;

};

#endif