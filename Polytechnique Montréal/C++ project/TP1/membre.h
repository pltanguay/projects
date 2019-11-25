/****************************************************************************
 * Fichier: membre.h
 * Auteur: Melody Roy (1991902) et Pier-Luc Tanguay (1953707)
 * Date: 17 septembre 2019
 * Description: Définition de la classe Membre
 ****************************************************************************/

#ifndef MEMBRE_H
#define MEMBRE_H

#include <string>
#include "billet.h"
#include "coupon.h"

using namespace std;

class Membre {
public:
	// TODO: Implementer toutes les methodes
	Membre();
	Membre(const string& nom);

	// TODO: Implementer si necessaire
	~Membre();

	// Getters
	string getNom() const;
	int getPoints() const;
	Billet** getBillets() const;
	int getNbBillets() const;
	int getCapaciteBillets() const;
	Coupon** getCoupons() const;
	int getNbCoupons() const;
	int getCapaciteCoupons() const;

	// Setters
	void setNom(const string& nom);

	void modifierPoints(int points);
	void ajouterBillet(const string& pnr, double prix, const string& od, TarifBillet tarif, const string& dateVol);
	void ajouterCoupon(Coupon* coupon);
	void retirerCoupon(Coupon* coupon);

	void acheterCoupon(Coupon* coupon);
	double calculerPoints(Billet* billet) const;

	void afficherMembre() const;

private:
	string nom_;
	int points_;
	Billet** billets_;
	int nbBillets_;
	int capaciteBillets_;
	Coupon** coupons_;
	int nbCoupons_;
	int capaciteCoupons_;
};


#endif
