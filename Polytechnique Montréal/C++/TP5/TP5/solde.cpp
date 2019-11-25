/********************************************
* Titre: Travail pratique #5 - solde.cpp
* Date: 30 octobre 2019
* Auteur: Allan BEDDOUK & Jeffrey LAVALLEE
*******************************************/

#include "solde.h"

Solde::Solde(double pourcentageSolde)
{
	pourcentageSolde_ = pourcentageSolde;
}

Solde::~Solde()
{
}

double Solde::getPourcentageSolde() const
{
	return pourcentageSolde_;
}

void Solde::setPourcentageSolde(double pourcentageSolde)
{
	pourcentageSolde_ = pourcentageSolde;
}
