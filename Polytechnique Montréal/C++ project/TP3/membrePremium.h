/****************************************************************************
 * Fichier: membrePremium.h
 * Auteur: Melody Roy (1991902) et Pier-Luc Tanguay (1953707)
 * Date: 8 octobre 2019
 * Description:  Définition de la classe MembrePremium
 ****************************************************************************/

#ifndef MEMBRE_PREMIUM_H
#define MEMBRE_PREMIUM_H


#include "membreRegulier.h"

class MembrePremium : public MembreRegulier {
public:
	//à faire
	MembrePremium(const string& nom);

	//setters
	//à faire
	void setJourRestants(unsigned int joursRestants);
	//à faire
	void modifierPointsCumules(unsigned int pointCumulee);


	//getters
	//à faire
	unsigned int getJourRestants() const;
	//à faire
	unsigned int getpointsCumulee() const;

	//à faire
	void ajouterBillet(const string& pnr, double prix, const string& od, TarifBillet tarif, TypeBillet typeBillet, const string& dateVol);
	//à faire
	void acheterCoupon(Coupon* coupon);

	//à faire
	friend ostream& operator<<(ostream& os, const MembrePremium& membrePremium);

private:
	unsigned int joursRestants_;
	unsigned int pointsCumules_;

};

#endif