/*
 * Date : 12 Septembre 2019
 * Auteur : Philippe CÔTÉ-MORNEAULT
 */

#ifndef BILLET_H
#define BILLET_H

#include <string>
#include <iostream>
#include <iomanip>

#include "def.h"

using namespace std;

class Billet {
public:
	// Constructeurs
	Billet();
	Billet(const string& pnr, const string& nomPassager, double prix, const string& od, TarifBillet tarif, const string& dateVol);

	// Destructeur
	~Billet();

	// Getters
	string getPnr() const;
	string getNomPassager() const;
	double getPrix() const;
	string getOd() const;
	TarifBillet getTarif() const;
	string getDateVol() const;

	// Setters
	void setPnr(const string& pnr);
	void setNomPassager(const string& nomPassager);
	void setPrix(double prix);
	void setOd(const string& od);
	void setTarif(TarifBillet tarif);
	void setDateVol(const string& dateVol);

	// Methodes
	string formatTarif(TarifBillet tarif) const;

	

private:
	string pnr_;
	string nomPassager_;
	double prix_;
	string od_;
	TarifBillet tarif_;
	string dateVol_;
};

// Surcharge de l'operateur <<
ostream& operator<<(ostream& out, const Billet& billet);

#endif // !BILLET_H

