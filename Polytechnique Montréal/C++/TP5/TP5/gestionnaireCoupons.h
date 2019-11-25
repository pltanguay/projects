#pragma once
/********************************************
* Titre: Travail pratique #5 - gestionnaireCoupons.h
* Date: 30 octobre 2019
* Auteur: Allan BEDDOUK & Jeffrey LAVALLEE
*******************************************/

#ifndef GESTIONNAIRECOUPONS_H
#define	GESTIONNAIRECOUPONS_H	

#include <vector>

#include "membrePremium.h"
#include "solde.h"
#include "gestionnaireGenerique.h"

class GestionnaireCoupons : public GestionnaireGenerique <Coupon*, vector<Coupon*>, AjouterCoupon>{
public:

	double appliquerCoupon(Membre* membre, double prix) const;
	void acheterCoupon(Membre* membre) const;
};
#endif // !GESTIONNAIRECOUPONS_H



