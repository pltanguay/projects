/****************************************************************************
 * Fichier: membre.cpp
 * Auteur: Melody Roy (1991902) et Pier-Luc Tanguay (1953707)
 * Date: 17 septembre 2019
 * Description: Implementation de la classe Membre
 ****************************************************************************/

#include "membre.h"

//Constantes
const double BONUS_ECONOMIE = 0.00;
const double BONUS_PREM_ECO = 50.00;
const double BONUS_AFFAIRES = 150.00;
const double BONUS_PREMIERE = 300.00;
const double POURCENTAGE_POINTS = 0.1;
const int DEPENSE_POINTS = -1;

// Constructeurs
Membre::Membre():
	nom_("UNKNOWN"),
	points_(0),
	nbCoupons_(0),
	nbBillets_(0),
	capaciteBillets_(CAPACITE_INITIALE),
	capaciteCoupons_(CAPACITE_INITIALE) {
	
	billets_ = new Billet* [CAPACITE_INITIALE];

	for (int i = 0; i < CAPACITE_INITIALE; i++)
		billets_[i] = nullptr;

	coupons_ = new Coupon* [CAPACITE_INITIALE];

	for (int i = 0; i < CAPACITE_INITIALE; i++)
		coupons_[i] = nullptr;
}


Membre::Membre(const string& nom): 
	nom_(nom), 
	points_(0), 
	nbCoupons_(0),
	nbBillets_(0),
	capaciteBillets_(CAPACITE_INITIALE),
	capaciteCoupons_(CAPACITE_INITIALE) {
	
	billets_ = new Billet * [CAPACITE_INITIALE];

	for (int i = 0; i < CAPACITE_INITIALE; i++)
		billets_[i] = nullptr;

	coupons_ = new Coupon * [CAPACITE_INITIALE];

	for (int i = 0; i < CAPACITE_INITIALE; i++)
		coupons_[i] = nullptr;
}

// Destructeur
Membre::~Membre() {
	for (int i = 0; i < nbBillets_; i++) {
		delete billets_[i];
		billets_[i] = nullptr;

	}
	delete[] billets_;

	cout << "Destruction d'un membre !" << endl;
}

 
// Getters
string Membre::getNom() const {
	return nom_;
}


int Membre::getPoints() const {
	return points_;
}


Billet** Membre::getBillets() const {
	return  billets_;
}


int Membre::getNbBillets() const {
	return nbBillets_;
}


int Membre::getCapaciteBillets() const {
	return capaciteBillets_;
}


Coupon** Membre::getCoupons() const {
	return coupons_;
}


int Membre::getNbCoupons() const {
	return nbCoupons_;
}


int Membre::getCapaciteCoupons() const {
	return capaciteCoupons_;
}


//Setters
void Membre::setNom(const string& nom) {
	nom_ = nom;
}


// Méthodes

/****************************************************************************
 * Fonction:	Membre::modifierPoints
 * Description: Modifie les points du membre
 * Paramètres:	- (int) points: les points à ajouter (ou retirer)
 * Retour:		aucun
 ****************************************************************************/
void Membre::modifierPoints(int points) {
	points_ += points;
}


/****************************************************************************
 * Fonction:	Membre::ajouterBillet
 * Description: Crée et ajoute un billet au membre à partir des paramètres reçus.
				Modifie aussi le nombre de points du membre. (Doubler la capacité si nécessaire)
 * Paramètres:	- (const string&) pnr : numéro de réservation du nouveau billet
				- (double) prix : prix final du nouveau billet 
				- (const string&) od : origine - destination du nouveau billet
				- (TarifBillet) tarif : type de tarif du nouveau billet
				- (const string&) dateVol : date du vol du nouveau billet
 * Retour:		aucun
 ****************************************************************************/
void  Membre::ajouterBillet(const string& pnr, double prix,
	const string& od, TarifBillet tarif, const string& dateVol) {

	// S'il ne reste plus d'espace dans la liste :
	if (nbBillets_ == capaciteBillets_) {

		// Doubler la capacité de billets.
		capaciteBillets_ *= 2;

		Billet** temporaire = billets_;
		billets_ = new Billet * [capaciteBillets_];

		//  Copier les éléments de l'ancien tableau dans le nouveau.
		for (int i = 0; i < nbBillets_; i++) {
			billets_[i] = temporaire[i];
		}

		//  Désallouer l'ancien tableau.
		delete[] temporaire;
	}

	// Ajouter le nouvel élément après le dernier dans la liste.
	billets_[nbBillets_] = new Billet(pnr, nom_, prix, od, tarif, dateVol);
	modifierPoints(calculerPoints(billets_[nbBillets_]));
	nbBillets_++;
}

/****************************************************************************
 * Fonction:	Membre::ajouterCoupon
 * Description: Ajoute un coupon au membre. (Doubler la capacité si nécessaire)
 * Paramètres:	- (Coupon*) coupon : coupon à ajouter au membre
 * Retour:		aucun
 ****************************************************************************/
void Membre::ajouterCoupon(Coupon* coupon) {

	// S'il ne reste plus d'espace dans la liste :
	if (nbCoupons_ == capaciteCoupons_) {

		// Doubler la capacité de billets.
		capaciteCoupons_ *= 2;

		Coupon** temporaire = coupons_;
		coupons_ = new Coupon * [capaciteBillets_];

		//  Copier les éléments de l'ancien tableau dans le nouveau.
		for (int i = 0; i < nbCoupons_; i++) {
			coupons_[i] = temporaire[i];
		}

		//  Désallouer l'ancien tableau.
		delete[] temporaire;
	}

	coupons_[nbCoupons_] = coupon;
	nbCoupons_++;
}


/****************************************************************************
 * Fonction:	Membre::retirerCoupon
 * Description: Retirer un coupon au membre.
				Supprime la première occurrence du coupon dans le tableau de coupon.
				Déplace le dernier coupon à la position du coupon retiré.
 * Paramètres:	- (Coupon*) coupon : coupon à retirer au membre
 * Retour:		aucun
 ****************************************************************************/
void Membre::retirerCoupon(Coupon* coupon) {
	int positionCoupon;
	for (int i = 0; i < nbCoupons_; i++) {
		if (coupons_[i]->getCode() == coupon->getCode()) {
			positionCoupon = i;
			i = nbCoupons_;
		}
	}
	nbCoupons_--;
	coupons_[positionCoupon] = coupons_[nbCoupons_];
	coupons_[nbCoupons_] = nullptr;
	//la derniere valeur est ignoree
}

/****************************************************************************
 * Fonction:	Membre::acheterCoupon
 * Description: Ajoute le coupon au tableau de coupons si le membre possède assez de points. 
				Modifie le nombre de points que possède le membre.
 * Paramètres:	- (Coupon*) coupon : le coupon à acheter
 * Retour:		aucun
 ****************************************************************************/
void Membre::acheterCoupon(Coupon* coupon) {
	if (coupon->getCout() <= points_) {
		ajouterCoupon(coupon);
		modifierPoints(DEPENSE_POINTS * coupon->getCout());
	}
}


/****************************************************************************
 * Fonction:	Membre::calculerPoints
 * Description: Calcule le nombre de point que rapporte un billet.
				(10 % de son prix + points bonus selon le tarif)
 * Paramètres:	- (Billet*)  billet : le billet dont nous calculons les points
 * Retour:		Retourne le nombre de points rapportés
 ****************************************************************************/
double Membre::calculerPoints(Billet* billet) const {
	double pointsRapporte = POURCENTAGE_POINTS * billet->getPrix();

	switch (billet->getTarif()) {
	case TarifBillet::Affaire : pointsRapporte += BONUS_AFFAIRES;  break;
	case TarifBillet::PremiumEconomie: pointsRapporte += BONUS_PREM_ECO; break;
	case TarifBillet::Premiere: pointsRapporte += BONUS_PREMIERE; break;
	case TarifBillet::Economie:  break;
	}
	return pointsRapporte;
}

/****************************************************************************
 * Fonction:	Membre::afficherMembre
 * Description: Afficher les informations du membre
 * Paramètres:	- aucun
 * Retour:		- aucun
 ****************************************************************************/
void Membre::afficherMembre() const {
	cout << "- Membre " << nom_ << ":" << endl
		<< "     - Points  : " << points_ << endl
		<< "     - Billets :" << endl;
	for (int i = 0; i < nbBillets_; i++) {
		billets_[i]->afficherBillet();
	}

	cout << "     - Coupons :" << endl;
	for (int i = 0; i < nbCoupons_; i++) {
		coupons_[i]->afficherCoupon();
	}
	cout << endl;
}

