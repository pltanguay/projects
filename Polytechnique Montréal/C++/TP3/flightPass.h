/****************************************************************************
 * Fichier: flightPass.h
 * Auteur: Melody Roy (1991902) et Pier-Luc Tanguay (1953707)
 * Date: 8 octobre 2019
 * Description:  Définition de la classe FlightPass
 ****************************************************************************/

#ifndef FLIGHT_PASS_H
#define FLIGHT_PASS_H

#include "billet.h"

class FlightPass : public Billet {
public:
	//à faire 
	FlightPass(const string& pnr, const string& nomPassager, double prix, const string& od, TarifBillet tarif, TypeBillet typeBillet);

	//à faire 
	void decrementeNbUtilisations();

	//à faire 
	 int getNbUtilisationsRestante() const;

	 //à faire 
	friend ostream& operator<<(ostream& os ,const FlightPass& flightpass);

private:
	 int nbUtilisationsRestante_;
};

#endif