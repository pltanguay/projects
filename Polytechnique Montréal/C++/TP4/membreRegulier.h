/*
* Titre : membreRegulier.h - Travail Pratique #4
* Date : 5 Octobre 2019
* Auteur : Philippe CÔTÉ-MORNEAULT
*/

#ifndef MEMBRE_REGULIER_H
#define MEMBRE_REGULIER_H

#include "membre.h"
#include "debogageMemoire.hpp"

class MembreRegulier : public Membre {
public:
	// Constructeur
	MembreRegulier(const string& nom);

	// Getters
	int getPoints() const;
	vector<Coupon*> getCoupons() const;
	
	Membre& operator+=(Coupon* coupon);
	Membre& operator-=(Coupon* coupon);
	void modifierPoints(int points);
	void ajouterBillet(Billet* billet) override;

	double calculerPoints(Billet* billet) const;
	// TODO
	bool peutAcheterCoupon(Coupon* coupon);
	virtual void acheterCoupon(Coupon* coupon);

	// TODO: Retirer cette fonction par afficher()
	//friend ostream& operator<<(ostream& os, const MembreRegulier& membreRegulier);

	// TODO
	void afficher(ostream& o) override;
protected:
	int points_;
	vector<Coupon*> coupons_;
};
#endif // !MEMBRE_REGULIER_H