/****************************************************************************
 * Fichier: billet.h
 * Auteur: Melody Roy (1991902) et Pier-Luc Tanguay (1953707)
 * Date: 8 octobre 2019
 * Description:  Définition de la classe Billet
 ****************************************************************************/

#ifndef BILLET_H
#define BILLET_H

#include <string>
#include <iostream>
#include <iomanip>

#include "def.h"

using namespace std;

enum TypeBillet {Billet_Base, Billet_Regulier, Flight_Pass};

class Billet {
public:
	// Constructeurs
	//à modifier = Ajout de l'attribut typeBillet_
	Billet();
	//à modifier =  Ajout de l'attribut typeBillet_
	Billet(const string& pnr, const string& nomPassager, double prix, const string& od, TarifBillet tarif, TypeBillet typeBillet);

	virtual ~Billet(); //virtual permet de bien delete les object derivé 

	// Getters
	string getPnr() const;
	string getNomPassager() const;
	double getPrix() const;
	string getOd() const;
	TarifBillet getTarif() const;

	//à faire
	TypeBillet getTypeBillet() const;

	// Setters
	void setPnr(const string& pnr);
	void setNomPassager(const string& nomPassager);
	void setPrix(double prix);
	void setOd(const string& od);
	void setTarif(TarifBillet tarif);
	//à faire
	void setTypeBillet(TypeBillet typeBillet);

	string formatTarif(TarifBillet tarif) const;

	//à modifer = (enlever dateVol_)
	friend ostream& operator<<(ostream& o, const Billet& billet);
private:
	string pnr_;
	string nomPassager_;
	double prix_;
	string od_;
	TarifBillet tarif_;
	TypeBillet typeBillet_;
};
#endif // !BILLET_H

