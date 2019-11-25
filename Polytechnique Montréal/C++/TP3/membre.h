/****************************************************************************
 * Fichier: membre.h
 * Auteur: Melody Roy (1991902) et Pier-Luc Tanguay (1953707)
 * Date: 8 octobre 2019
 * Description:  Définition de la classe Membre
 ****************************************************************************/


#ifndef MEMBRE_H
#define MEMBRE_H

#include <string>
#include <vector>

#include "flightPass.h"
#include "billetRegulier.h"
#include "coupon.h"

using namespace std;

enum TypeMembre { Membre_Regulier, Membre_Premium, Membre_Occasionnel};

class Membre {
public:
	// Constructeurs

	//à modifer = Ajout attribut typeMembre_
	Membre();
	//à modifer = Ajout attribut typeMembre_
	Membre(const string& nom, TypeMembre typeMembre);
	//à modifer = Ajout attribut typeMembre_
	Membre(const Membre& membre);

	virtual ~Membre(); //virtual permet de bien delete les object derivé 

	// Getters
	string getNom() const;
	TypeMembre getTypeMembre() const;

	vector<Billet*> getBillets() const;


	// Setters
	void setNom(const string& nom);

	//à faire
	void utiliserBillet(const string& pnr);

	//à modifer
	void ajouterBillet(const string& pnr, double prix, const string& od, TarifBillet tarif, TypeBillet typeBillet , const string& dateVol);

	bool operator==(const string& nomMembre) const;
	friend bool operator==(const string& nomMembre, const Membre& membre);

	Membre& operator=(const Membre& membre);

	//à modifer
	friend ostream& operator<<(ostream& o, const Membre& membre);

protected:
	string nom_;
	TypeMembre typeMembre_;
	vector<Billet*> billets_;
};


#endif
