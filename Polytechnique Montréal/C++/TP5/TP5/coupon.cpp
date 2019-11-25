/********************************************
* Titre: Travail pratique #5 - coupon.cpp
* Date: 30 octobre 2019
* Auteur: Allan BEDDOUK & Jeffrey LAVALLEE
*******************************************/

#include "coupon.h"

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

Coupon::~Coupon()
{
}

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

bool Coupon::operator>(const Coupon& coupon) const
{
	return rabais_ > coupon.rabais_;
}

bool Coupon::operator<(const Coupon& coupon) const
{
	return rabais_ < coupon.rabais_;
}

void Coupon::afficher(ostream& o) const
{
	o << "\t\t- Coupon " << code_ << ". Rabais : " << rabais_ << "." << endl;
}

//todo operateur<<
ostream& operator<<(ostream& o, Coupon* c) {
	c->afficher(o);
	return o;
}
