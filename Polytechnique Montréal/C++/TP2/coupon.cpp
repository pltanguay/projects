/*
 * Date : 12 Septembre 2019
 * Auteur : Philippe CÔTÉ-MORNEAULT
 */

#include "coupon.h"

// Constructeur
Coupon::Coupon() : 
	code_(""),
	rabais_(0),
	cout_(0)
{
}
Coupon::Coupon(const string& code, double rabais, int cout) :
	code_(code),
	rabais_(rabais),
	cout_(cout)
{
}

// Destructeur
Coupon::~Coupon()
{
}

// Getters
string Coupon::getCode() const
{
	return code_;
}
double Coupon::getRabais() const
{
	return rabais_;
}
int Coupon::getCout() const
{
	return cout_;
}

// Setters 
void Coupon::setCode(const string& code)
{
	code_ = code;
}
void Coupon::setRabais(double rabais)
{
	rabais_ = rabais;
}
void Coupon::setCout(int cout)
{
	cout_ = cout;
}

// Methodes

/****************************************************************************
 * Fonction:	operator<<
 * Description: Surcharge de l'operateur de flux de sortie pour afficher
 *				les attributs d'un Billet.
 * Paramètres:	- (ostream) out : le flux de sortie
 *				- (Coupon) coupon : le coupon a afficher
 * Retour:		(ostream) pour l'appel en cascade
 ****************************************************************************/
ostream& operator<<(ostream& out, const Coupon& coupon) {
	out << "\t\t- Coupon " << coupon.getCode() << ". Rabais : " << coupon.getRabais() << "." << endl;
	return out;
}

/****************************************************************************
 * Fonction:	operator>
 * Description: Surcharge de l'operateur de comparaison "plus grand que" pour 
				comparer le rabais de deux coupons.
 * Paramètres:	(Coupon) coupon : le coupon a droite de l'operateur
 * Retour:		(bool) le resultat de la comparaison
 ****************************************************************************/
bool Coupon::operator>(const Coupon& coupon) const {
	return (rabais_ > coupon.getRabais());
}

/****************************************************************************
 * Fonction:	operator<
 * Description: Surcharge de l'operateur de comparaison "plus petit que" pour
				comparer le rabais de deux coupons.
 * Paramètres:	(Coupon) coupon : le coupon a droite de l'operateur
 * Retour:		(bool) le resultat de la comparaison
 ****************************************************************************/
bool Coupon::operator<(const Coupon& coupon) const {
	return (rabais_ < coupon.getRabais());
}

