/*
* Titre : billetRegulier.cpp - Travail Pratique #4
* Date : 5 Octobre 2019
* Auteur : Philippe CÔTÉ-MORNEAULT
*/

#include "billetRegulier.h"

BilletRegulier::BilletRegulier(const string& pnr, double prix, const string& od, TarifBillet tarif, const string& dateVol) : 
	Billet(pnr, prix, od, tarif), dateVol_(dateVol)
{
}

string BilletRegulier::getDateVol() const
{
	return dateVol_;
}

void BilletRegulier::setDateVol(string dateVol)
{
	dateVol_ = dateVol;
}

// TODO
BilletRegulier* BilletRegulier::clone()
{
	BilletRegulier* billetRegulier = new BilletRegulier(*this);

	return billetRegulier;
}

// TODO : Remplacer cette fonction par la methode afficher()
/*ostream& operator<<(ostream& o, const BilletRegulier& billet)
{
	o << static_cast<Billet>(billet);
	o << "\t\t\t" << setw(11) << "- Vol le" << ": " << billet.dateVol_ << endl;

	return o;
}*/

// TODO
void BilletRegulier::afficher(ostream& o)
{
	Billet::afficher(o);
	o << "\t\t\t" << setw(11) << "- Vol le" << ": " << dateVol_ << endl;
}