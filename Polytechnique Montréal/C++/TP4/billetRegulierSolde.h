/*
* Titre : billetRegulierSolde.h - Travail Pratique #4
* Date : 5 Octobre 2019
* Auteur : Philippe C�T�-MORNEAULT
*/

#ifndef BILLET_REGULIER_SOLDE_H
#define BILLET_REGULIER_SOLDE_H

#include <iomanip>

#include "billetRegulier.h"
#include "solde.h"

using namespace std;

class BilletRegulierSolde : public BilletRegulier, public Solde {
public:
	// Constructeur
	// TODO
	BilletRegulierSolde(const string& pnr, double prix, const string& od, TarifBillet tarif, const string& dateVol, double pourcentageSolde);

	// Getter
	// TODO
	double getPrix() const override;
	double getPrixBase() const;

	// TODO
	BilletRegulierSolde* clone() override;

	// TODO
	void afficher(ostream& o) override;
};
#endif // !BILLET_REGULIER_SOLDE_H