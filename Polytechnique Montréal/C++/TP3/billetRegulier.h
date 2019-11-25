/****************************************************************************
 * Fichier: billetRegulier.h
 * Auteur: Melody Roy (1991902) et Pier-Luc Tanguay (1953707)
 * Date: 8 octobre 2019
 * Description:  Définition de la classe BilletRegulier
 ****************************************************************************/

#ifndef BILLET_REGULIER_H
#define BILLET_REGULIER_H
#include "billet.h"

class BilletRegulier : public Billet {

public:
	
	//à faire 
	BilletRegulier(const string& pnr, const string& nomPassager, double prix, const string& od, TarifBillet tarif, const string& dateVol, TypeBillet typeBillet);
	//à faire 
	string getDateVol() const;
	//à faire 
	void setDateVol(string dateVol);

	//à faire 
	friend ostream& operator<<(ostream& o, const BilletRegulier& billet);
private:
	string dateVol_;
};

#endif