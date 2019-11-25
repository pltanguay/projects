/****************************************************************************
 * Fichier: coupon.h
 * Auteur: Melody Roy (1991902) et Pier-Luc Tanguay (1953707)
 * Date: 8 octobre 2019
 * Description:  D�finition de la classe Coupon
 ****************************************************************************/

#ifndef COUPON_H
#define COUPON_H

#include <string>
#include <iostream>

using namespace std;

class Coupon {
public:
	// Constructeurs
	Coupon();
	Coupon(const string& code, double rabais, int cout);
	
	~Coupon();

	// Getters
	string getCode() const;
	double getRabais() const;
	int getCout() const;

	// Setters
	void setCode(const string& code);
	void setRabais(double rabais);
	void setCout(int cout);

	bool operator>(const Coupon& coupon) const;
	bool operator<(const Coupon& coupon) const;

	friend ostream& operator<<(ostream& o, const Coupon& coupon);
private:
	string code_;
	double rabais_;
	int cout_;
};

#endif // !COUPON_H

