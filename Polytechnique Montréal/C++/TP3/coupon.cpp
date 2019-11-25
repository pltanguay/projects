/****************************************************************************
 * Fichier: coupon.cpp
 * Auteur: Melody Roy (1991902) et Pier-Luc Tanguay (1953707)
 * Date: 8 octobre 2019
 * Description: Définition de la classe Coupon
 *				(surcharge opérateurs et vecteurs)
 ****************************************************************************/

#include "coupon.h"
// Constructeurs
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

/****************************************************************************
 * Fonction:	Coupon::operator>
 * Description: Surcharge de l'operateur de comparaison "plus grand que" pour
				comparer le rabais de deux coupons.
 * Paramètres:	(const Coupon&) coupon : le coupon a droite de l'operateur
 * Retour:		(bool) Retourne vrai si "coupon" est plus petit
 ****************************************************************************/
bool Coupon::operator>(const Coupon& coupon) const
{
	return rabais_ > coupon.rabais_;
}

/****************************************************************************
 * Fonction:	Coupon::operator<
 * Description: Surcharge de l'operateur de comparaison "plus petit que" pour
				comparer le rabais de deux coupons.
 * Paramètres:	(const Coupon&) coupon : le coupon a droite de l'operateur
 * Retour:		(bool) Retourne vrai si "coupon" est plus grand
 ****************************************************************************/
bool Coupon::operator<(const Coupon& coupon) const
{
	return rabais_ < coupon.rabais_;
}

/****************************************************************************
 * Fonction:	Coupon::operator<<
 * Description: Surcharge de l'operateur de flux de sortie pour afficher
 *				les attributs d'un Billet.
 * Paramètres:	- (ostream&) out : le flux de sortie
 *				- (const Coupon&) coupon : le coupon a afficher
 * Retour:		(ostream&) Retourne flux de sorti pour l'appel en cascade
 ****************************************************************************/
ostream& operator<<(ostream& o, const Coupon& coupon)
{
	return o << "\t\t- Coupon " << coupon.code_ << ". Rabais : " << coupon.rabais_ << "." << endl << endl;
}
