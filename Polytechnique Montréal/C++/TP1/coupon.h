/****************************************************************************
 * Fichier: coupon.h
 * Auteur: Melody Roy (1991902) et Pier-Luc Tanguay (1953707)
 * Date: 17 septembre 2019
 * Description: Définition de la classe Coupon
 ****************************************************************************/

#ifndef COUPON_H
#define COUPON_H

#include <string>
#include <iostream>

using namespace std;

class Coupon {
public:
	// TODO: Implementer toutes les methodes
	Coupon();
	Coupon(const string& code, double rabais, int cout);
	
	// TODO: Implementer si necessaire
	~Coupon();

	// Getters
	string getCode();
	double getRabais();
	int getCout();

	// Setters
	void setCode(const string& code);
	void setRabais(double rabais);
	void setCout(int cout);

	void afficherCoupon();
private:
	string code_;
	double rabais_;
	int cout_;
};

#endif // !COUPON_H

