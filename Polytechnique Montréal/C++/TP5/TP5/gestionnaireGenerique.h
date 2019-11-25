/********************************************
* Titre: Travail pratique #5 - GestionnaireGenerique.h
* Date: 30 octobre 2019
* Auteur: Allan BEDDOUK & Jeffrey LAVALLEE
*******************************************/

#pragma once

#include <algorithm>
#include "foncteur.h"

using namespace  std;

/*
    class GestionnaireGenerique

    Méthodes :
    C getConteneur() const;
    void ajouter(const T& t);
    int getNombreElements() const;
 
    Attributs :
    C conteneur_;
*/

/*              
	* T   = pair<string, Membre*> ou Coupon*; 
	* Conteneur   = map<string, Membre*> ou vector<Coupon*>; 
	* FoncteurAjouter = AjouterMembre ou AjouterCoupon
*/

template<typename T, typename C, typename FoncteurAjouter>
class GestionnaireGenerique
{
public:
	C getConteneur() const;
	void ajouter(T t);
	int getNombreElements() const;

protected:

	C conteneur_;
};



template<typename T, typename C, typename FoncteurAjouter>
C GestionnaireGenerique<typename T, typename C, 
	typename FoncteurAjouter>::getConteneur() const {

	return conteneur_;

}

template<typename T, typename C, typename FoncteurAjouter>
void GestionnaireGenerique<typename T, typename C,
	typename FoncteurAjouter>::ajouter(T t){

	FoncteurAjouter foncteurAjouter = FoncteurAjouter(conteneur_);
	conteneur_ = foncteurAjouter(t);

}

template<typename T, typename C, typename FoncteurAjouter>
int GestionnaireGenerique<typename T, typename C,
	typename FoncteurAjouter>::getNombreElements() const {

	return conteneur_.size();

}

