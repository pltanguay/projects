/****************************************************************************
 * Fichier: membreRegulier.h
 * Auteur: Melody Roy (1991902) et Pier-Luc Tanguay (1953707)
 * Date: 8 octobre 2019
 * Description:  D�finition de la classe MembreRegulier
 ****************************************************************************/


#ifndef MEMBRE_REGULIER_H
#define MEMBRE_REGULIER_H


#include "membre.h"

class MembreRegulier : public Membre {
public:

	//� faire
	MembreRegulier(const string& nom, TypeMembre typeMembre);

	int getPoints() const;
	vector<Coupon*> getCoupons() const;
	

	void acheterCoupon(Coupon* coupon);
	Membre& operator+=(Coupon* coupon);
	Membre& operator-=(Coupon* coupon);
	void modifierPoints(int points);

	//� faire 
	void ajouterBillet(const string& pnr, double prix, const string& od, TarifBillet tarif, TypeBillet typeBillet, const string& dateVol);


	double calculerPoints(Billet* billet) const;

	//� faire
	friend ostream& operator<<(ostream& os, const MembreRegulier& membreRegulier);

protected:
	int points_;
	vector<Coupon*> coupons_;
};

#endif