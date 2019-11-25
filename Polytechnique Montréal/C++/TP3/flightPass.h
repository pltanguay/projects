/****************************************************************************
 * Fichier: flightPass.h
 * Auteur: Melody Roy (1991902) et Pier-Luc Tanguay (1953707)
 * Date: 8 octobre 2019
 * Description:  D�finition de la classe FlightPass
 ****************************************************************************/

#ifndef FLIGHT_PASS_H
#define FLIGHT_PASS_H

#include "billet.h"

class FlightPass : public Billet {
public:
	//� faire 
	FlightPass(const string& pnr, const string& nomPassager, double prix, const string& od, TarifBillet tarif, TypeBillet typeBillet);

	//� faire 
	void decrementeNbUtilisations();

	//� faire 
	 int getNbUtilisationsRestante() const;

	 //� faire 
	friend ostream& operator<<(ostream& os ,const FlightPass& flightpass);

private:
	 int nbUtilisationsRestante_;
};

#endif