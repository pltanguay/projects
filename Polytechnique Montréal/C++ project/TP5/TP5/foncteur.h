/********************************************
* Titre: Travail pratique #5 - foncteur.h
* Date: 30 octobre 2019
* Auteur: Allan BEDDOUK & Jeffrey LAVALLEE
*******************************************/
#pragma once

#include <string>
#include <vector>
#include <map>
#include <algorithm>
#include "coupon.h"
#include "membrePremium.h"

class AjouterCoupon
{
public:
	AjouterCoupon(vector<Coupon*>& conteneur)
		: conteneur_(conteneur)
	{
	}

	vector<Coupon*> operator()(Coupon* coupon) {

		// Recherche d'un �l�ment dans le vector
		// Si pas trouv�, �l�ment trouv� sera l'it�rator fin (hors des �l�ments), donc n'existe pas dans le vector
		// Si c'est le cas, on ajoute le membre.
		if (find(conteneur_.begin(), conteneur_.end(), coupon) == conteneur_.end())
			conteneur_.push_back(coupon);

		return conteneur_;
	}

private:
	vector<Coupon*> conteneur_;

};


class AjouterMembre
{
public:
	AjouterMembre(map<string, Membre*>& conteneur)
		: conteneur_(conteneur)
	{
	}

	map<string, Membre*> operator()(pair<string, Membre*> membre) {

		// Recherche d'un �l�ment de la map correspondant � la cl� du membre recherche.
		// Si pas trouv�, �l�ment trouv� sera l'it�rator fin (hors des �l�ments), donc n'existe pas dans la map
		// Si c'est le cas, on ins�re le membre.
		if (conteneur_.find(membre.first) == conteneur_.end())
				conteneur_.insert(membre);

		return conteneur_;
	}
	
private:
	map<string, Membre*> conteneur_;
};

class IntervallePrixBillet
{

public:
	IntervallePrixBillet(double borneInf, double borneSup)
		: borneInf_(borneInf), borneSup_(borneSup) 
	{
	}

	bool operator()(Billet* billet) const {

		double prixBillet = billet->getPrix();

		if (prixBillet >= borneInf_ && prixBillet <= borneSup_)
			return true;
		else
			return false;
	}

private:

	double borneInf_;
	double borneSup_;

};