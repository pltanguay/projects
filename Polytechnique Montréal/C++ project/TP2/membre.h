/*
 * Date : 12 Septembre 2019
 * Auteur : Philippe CÔTÉ-MORNEAULT
 */

#ifndef MEMBRE_H
#define MEMBRE_H

#include <string>
#include <vector>

#include "billet.h"
#include "coupon.h"

using namespace std;

class Membre {
public:
	// Constructeurs
	Membre();
	Membre(const string& nom);

	// Constructeur par copie
	Membre(const Membre& membre);

	// Destructeur
	~Membre();

	// Getters
	string getNom() const;
	int getPoints() const;
	vector<Billet*> getBillets() const;
	vector<Coupon*> getCoupons() const;

	// Setters
	void setNom(const string& nom);

	// Methodes

	void modifierPoints(int points);
	void ajouterBillet(const string& pnr, double prix, const string& od, TarifBillet tarif, const string& dateVol);
	void acheterCoupon(Coupon* coupon);
	double calculerPoints(Billet* billet) const;

	// Surcahge de l'operateur +=
	Membre& operator+=(Coupon* coupon);

	// Surcahge de l'operateur -=
	Membre& operator-=(Coupon* coupon);

	// Surcahge de l'operateur ==
	bool operator==(const string& nom);

	// Surcahge de l'operateur == (fonction globale)
	friend bool operator==(const string&, const Membre& membre);

	// Surcharge de l'operateur =
	Membre& operator=(const Membre& membre);

private:
	string nom_;
	int points_;
	vector<Billet*> billets_;
	vector<Coupon*> coupons_;
};

// Surcharge de l'operateur <<
ostream& operator<<(ostream& out, const Membre& membre);


#endif // !MEMBRE_H
