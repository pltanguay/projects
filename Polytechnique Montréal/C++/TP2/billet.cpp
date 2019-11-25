/*
 * Date : 12 Septembre 2019
 * Auteur : Philippe CÔTÉ-MORNEAULT
 */

#include "billet.h"

// Constructeurs 
Billet::Billet() :
	pnr_(""),
	nomPassager_(""),
	prix_(0),
	od_(""),
	tarif_(TarifBillet::Economie),
	dateVol_("")
{
}
Billet::Billet(const string& pnr, const string& nomPassager, double prix, const string& od, TarifBillet tarif, const string& dateVol) :
	pnr_(pnr),
	nomPassager_(nomPassager),
	prix_(prix),
	od_(od),
	tarif_(tarif),
	dateVol_(dateVol)
{
}

// Destructeur
Billet::~Billet()
{
}

// Getters
string Billet::getPnr() const
{
	return pnr_;
}
string Billet::getNomPassager() const
{
	return nomPassager_;
}
double Billet::getPrix() const
{
	return prix_;
}
string Billet::getOd() const
{
	return od_;
}
TarifBillet Billet::getTarif() const
{
	return tarif_;
}
string Billet::getDateVol() const
{
	return dateVol_;
}

// Setters
void Billet::setPnr(const string& pnr)
{
	pnr_ = pnr;
}
void Billet::setNomPassager(const string& nomPassager)
{
	nomPassager_ = nomPassager;
}
void Billet::setPrix(double prix)
{
	prix_ = prix;
}
void Billet::setOd(const string& od)
{
	od_ = od;
}
void Billet::setTarif(TarifBillet tarif)
{
	tarif_ = tarif;
}
void Billet::setDateVol(const string& dateVol)
{
	dateVol_ = dateVol;
}

// Methodes

/****************************************************************************
 * Fonction:	Billet::formatTarif
 * Description: Converti le type de tarif tiré de l’enum TarifBillet à la 
 *				chaîne de caractère correspondante.
 * Paramètres:	- (TarifBillet) tarif : le tarif du billet
 * Retour:		Retourne le tarif en format caractère
 ****************************************************************************/
string Billet::formatTarif(TarifBillet tarif) const
{
	switch (tarif)
	{
		case TarifBillet::Economie:
			return "Economie";
		case TarifBillet::PremiumEconomie:
			return "Premium economie";
		case TarifBillet::Affaire:
			return "Affaire";
		case TarifBillet::Premiere:
			return "Premiere";
		default:
			return "";
	}
}

/****************************************************************************
 * Fonction:	operator<<
 * Description: Surcharge de l'operateur de flux de sortie pour afficher
 *				les attributs d'un Billet.
 * Paramètres:	- (ostream) out : le flux de sortie
 *				- (Billet) billet : le billet a afficher
 * Retour:		(ostream) pour l'appel en cascade
 ****************************************************************************/
ostream& operator<<(ostream& out, const Billet& billet) {
	out << "\t\t- Billet " << billet.getPnr() << " (Classe : " << billet.formatTarif(billet.getTarif()) << ")" << endl
		<< left << "\t\t\t" << setw(11) << "- Passager " << ": " << billet.getNomPassager() << endl
		<< "\t\t\t" << setw(11) << "- Prix" << ": " << billet.getPrix() << "$" << endl
		<< "\t\t\t" << setw(11) << "- Trajet" << ": " << billet.getOd() << endl
		<< "\t\t\t" << setw(11) << "- Vol le" << ": " << billet.getDateVol() << endl;
	return out;
}

