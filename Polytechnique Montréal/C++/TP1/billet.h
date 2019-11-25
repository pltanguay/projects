/****************************************************************************
 * Fichier: billet.h
 * Auteur: Melody Roy (1991902) et Pier-Luc Tanguay (1953707)
 * Date: 17 septembre 2019
 * Description: Définition de la classe Billet
 ****************************************************************************/

#ifndef BILLET_H
#define BILLET_H

#include <string>
#include <iostream>
#include <iomanip>
#include "def.h"

using namespace std;

class Billet {
public:
	// TODO: Implementer toutes les methodes
	Billet();
	Billet(const string& pnr, const string& nomPassager, double prix, const string& od, TarifBillet tarif, const string& dateVol);

	// TODO: Implementer si necessaire
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

	string formatTarif(TarifBillet tarif) const;

	void afficherBillet() const;
private:
	string pnr_;
	string nomPassager_;
	double prix_;
	string od_;
	TarifBillet tarif_;
	string dateVol_;
};
#endif // !BILLET_H

