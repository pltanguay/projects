/*
 * Date : 12 Septembre 2019
 * Auteur : Philippe CÔTÉ-MORNEAULT
 */

#include "membre.h"

// Constructeurs
Membre::Membre() :
	nom_(""),
	points_(0)
{
}
Membre::Membre(const string& nom) :
	nom_(nom),
	points_(0)
{
}

// Constructeur de copie
Membre::Membre(const Membre& membre) :
	nom_(membre.nom_),
	points_(membre.points_)
{
	this->coupons_ = membre.coupons_;
}

// Destructeur
Membre::~Membre()
{
	for (unsigned int i = 0; i < billets_.size() ; i++) {
		delete billets_[i];
	}
}

// Getters
string Membre::getNom() const
{
	return nom_;
}
int Membre::getPoints() const
{
	return points_;
}
vector<Billet*> Membre::getBillets() const
{
	return billets_;
}
vector<Coupon*> Membre::getCoupons() const
{
	return coupons_;
}

// Setters
void Membre::setNom(const string& nom)
{
	nom_ = nom;
}

// Methodes

/****************************************************************************
 * Fonction:	Membre::modifierPoints
 * Description: Modifie les points du membre
 * Paramètres:	- (int) points: les points à ajouter (ou retirer)
 * Retour:		aucun
 ****************************************************************************/
void Membre::modifierPoints(int points)
{
	points_ += points;
}

/****************************************************************************
 * Fonction:	Membre::ajouterBillet
 * Description: Crée et ajoute un billet au membre à partir des paramètres reçus.
				Modifie aussi le nombre de points du membre.
 * Paramètres:	- (const string&) pnr : numéro de réservation du nouveau billet
				- (double) prix : prix final du nouveau billet
				- (const string&) od : origine - destination du nouveau billet
				- (TarifBillet) tarif : type de tarif du nouveau billet
				- (const string&) dateVol : date du vol du nouveau billet
 * Retour:		aucun
 ****************************************************************************/
void Membre::ajouterBillet(const string& pnr, double prix, const string& od, TarifBillet tarif, const string& dateVol)
{
	Billet* billet = new Billet(pnr, nom_, prix, od, tarif, dateVol);
	billets_.push_back(billet);
	modifierPoints(calculerPoints(billet));
}


/****************************************************************************
 * Fonction:	operator==
 * Description: Surcharge de l'operateur de comparaison "est egal a" pour
				comparer le nom d'un membre et d'une chaine de characteres.
 * Paramètres:	(String) nom : le nom du passager a comparer a celui du membre
 * Retour:		(bool) le resultat de la comparaison
 ****************************************************************************/
bool Membre::operator==(const string& nom) {
		return (nom_ == nom);
}

/****************************************************************************
 * Fonction (globale):	operator==
 * Description: Surcharge de l'operateur de comparaison "est egal a" pour
				comparer le nom d<un membre et d'une chaine de characteres.
 * Paramètres:	- (String) nomString : la chaine de charactere
				- (Membre&) membre : le membre qu l'on veut comparer
 * Retour:		(bool) le resultat de la comparaison
 ****************************************************************************/
bool operator==(const string& nomString, const Membre& membre){
return (nomString == membre.getNom());
}

/****************************************************************************
 * Fonction:	operator=
 * Description: Surcharge de l'operateur de comparaison "est egal a" pour
				comparer le rabais de deux coupons.
 * Paramètres:	(Sting) nom : le nom du passagera comparer a celui du membre
 * Retour:		(bool) le resultat de la comparaison
 ****************************************************************************/
Membre& Membre::operator=(const Membre& membre) {

	//On vérifie que l'object n'est pas le même que celui en argument, avant de copier les champs.
	if (this != &membre) {
		nom_ = membre.getNom();
		points_ = membre.getPoints();
		//coupons_ = membre.getCoupons();
		//billets_ = membre.getBillets();
	}

	return *this;
}

/****************************************************************************
 * Fonction:	Membre::acheterCoupon
 * Description: Ajoute le coupon au tableau de coupons si le membre possède assez de points.
				Modifie le nombre de points que possède le membre.
 * Paramètres:	- (Coupon*) coupon : le coupon à acheter
 * Retour:		aucun
 ****************************************************************************/
void Membre::acheterCoupon(Coupon* coupon)
{
	if (points_ > coupon->getCout()) {
		// Utiliser la surcharge de l'operateur +=
		*this += coupon;

		modifierPoints(-coupon->getCout());
	}
}

/****************************************************************************
 * Fonction:	Membre::calculerPoints
 * Description: Calcule le nombre de point que rapporte un billet.
				(10 % de son prix + points bonus selon le tarif)
 * Paramètres:	- (Billet*)  billet : le billet dont nous calculons les points
 * Retour:		Retourne le nombre de points rapportés
 ****************************************************************************/
double  Membre::calculerPoints(Billet * billet) const
{
	double bonus = 0;
	switch (billet->getTarif()) {
	case TarifBillet::PremiumEconomie:
		bonus = 50;
		break;
	case TarifBillet::Affaire:
		bonus = 150;
		break;
	case TarifBillet::Premiere:
		bonus = 300;
		break;
	default:
		break;
	}

	return billet->getPrix()* 0.10 + bonus;
}

/****************************************************************************
 * Fonction:	operator+=
 * Description: Ajoute un coupon au membre.
 * Paramètres:	- (Coupon*) coupon : coupon à ajouter au membre
 * Retour:		(Membre&) pour l'appel en cascade
 ****************************************************************************/
Membre& Membre::operator+=(Coupon* coupon) {
	coupons_.push_back(coupon);
	return *this;
}

/****************************************************************************
 * Fonction:	operator-=
 * Description: Retirer un coupon au membre.
 * Paramètres:	- (Coupon*) coupon : coupon à retirer au membre
 * Retour:		(Membre&) pour l'appel en cascade
 ****************************************************************************/
Membre& Membre::operator-=(Coupon* coupon) {
	for (unsigned int i = 0; i < coupons_.size(); i++) {
		if (coupons_[i] == coupon) 
			coupons_[i] = coupons_[coupons_.size() - 1];
	}
	coupons_.pop_back();

	return *this;
}

/****************************************************************************
 * Fonction:	operator<<
 * Description: Surcharge de l'operateur de flux de sortie pour afficher
 *				les attributs d'un Membre.
 * Paramètres:	- (ostream) out : le flux de sortie
 *				- (Membre) membre : le membre a afficher
 * Retour:		(ostream) pour l'appel en cascade
 ****************************************************************************/
ostream& operator<<(ostream& out, const Membre& membre) {
	out << setfill(' ')
		<< "- Membre " << membre.getNom() << ":" << endl
		<< "\t" << left << setw(10) << "- Points" << ": " << membre.getPoints() << endl
		<< "\t" << "- Billets :" << endl;

	for (unsigned int i = 0; i < membre.getBillets().size(); i++) {
		out << *membre.getBillets()[i];
	}


	out << "\t" << "- Coupons :" << endl;
	for (unsigned int i = 0; i < membre.getCoupons().size(); i++) {
		out << *membre.getCoupons()[i];
	}
	out << endl;

	return out;
}

