/*
* Titre : flightPassSolde.cpp - Travail Pratique #4
* Date : 5 Octobre 2019
* Auteur : Philippe CÔTÉ-MORNEAULT
*/

#include "flightPassSolde.h"

// TODO
FlightPassSolde::FlightPassSolde(const string& pnr, double prix, const string& od, TarifBillet tarif, double pourcentageSolde)
	:FlightPass(pnr, prix, od, tarif), Solde(pourcentageSolde)
{
}

// TODO
double FlightPassSolde::getPrix() const
{
	double prix = prix_ - (prix_ * pourcentageSolde_);

	return prix;
}

// TODO
double FlightPassSolde::getPrixBase() const
{
	return prix_;
}

// TODO
FlightPassSolde* FlightPassSolde::clone()
{
	FlightPassSolde* billetRegulierSolde = new FlightPassSolde(*this);

	return billetRegulierSolde;
}

// TODO
void FlightPassSolde::afficher(ostream& o)
{
	FlightPass::afficher(o);
	o << "\t\t\t" << setw(11) << "- Pourcentage solde" << ": " << pourcentageSolde_ << endl;

}