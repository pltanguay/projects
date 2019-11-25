/****************************************************************************
 * Fichier: coupon.cpp
 * Auteur: Melody Roy (1991902) et Pier-Luc Tanguay (1953707)
 * Date: 17 septembre 2019
 * Description: Implementation de la classe Coupon
 ****************************************************************************/

#include "coupon.h"

//Constructeurs
Coupon::Coupon() {
	code_ = "UNKNOWN";
	rabais_ = 0.00;
	cout_ = 0;
}

Coupon::Coupon(const string& code, double rabais, int cout) {
	code_ = code;
	rabais_ = rabais;
	cout_ = cout;
}

//Destructeur
Coupon::~Coupon() {
	cout << "Destruction d'un coupon !" << endl;
}

// Getters
string Coupon::getCode() {
	return code_;
}

double Coupon::getRabais() {
	return rabais_;
}

int Coupon::getCout() {
	return cout_;
}

//Setters
void Coupon::setCode(const string& code) {
	code_ = code;
}

void Coupon::setRabais(double rabais) {
	rabais_ = rabais;
}

void Coupon::setCout(int cout) {
	cout_ = cout;
}

// Méthodes:

/****************************************************************************
 * Fonction:	Membre::afficherCoupon
 * Description: Affiche les informations du coupon
 * Paramètres:	- aucun
 * Retour:		- aucun
 ****************************************************************************/
void Coupon::afficherCoupon() {
	cout << "          - Coupon : "<< code_ << ". Rabais :" << getRabais() << ".";
}

