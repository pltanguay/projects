/*
* Titre : membre.cpp - Travail Pratique #4
* Date : 5 Octobre 2019
* Auteur : Philippe CÔTÉ-MORNEAULT
*/

#include "membre.h"

Membre::Membre() :
	nom_("")
{
}

Membre::Membre(const string& nom) :
	nom_(nom)
{
}

// TODO
Membre::Membre(const Membre& membre) :
	nom_(membre.nom_)
{

	for (size_t i = 0; i < membre.billets_.size(); ++i) {

		billets_.push_back(membre.billets_[i]->clone());
	}

}

Membre::~Membre()
{
	for (size_t i = 0; i < billets_.size(); ++i) {
		delete billets_[i];
	}
}

string Membre::getNom() const
{
	return nom_;
}

vector<Billet*> Membre::getBillets() const
{
	return billets_;
}

void Membre::setNom(const string& nom)
{
	nom_ = nom;
}

// TODO
void Membre::utiliserBillet(const string& pnr)
{
	int indexTrouve = -1;
	for (size_t i = 0; i < billets_.size(); ++i) {
		if (billets_[i]->getPnr() == pnr) {
			indexTrouve = i;
			break;
		}
	}

	if (indexTrouve == -1) {
		cout << "Le billet n'est pas trouve" << endl;
		return;
	}

	if (dynamic_cast<FlightPass*>(billets_[indexTrouve])) {
		FlightPass* flightPass = dynamic_cast<FlightPass*>(billets_[indexTrouve]);
		flightPass->decrementeNbUtilisations();
		if (flightPass->getNbUtilisationsRestante() > 0) {
			return;
		}
	}

	delete billets_[indexTrouve];
	billets_[indexTrouve] = billets_[billets_.size() - 1];
	billets_.pop_back();
}

void Membre::ajouterBillet(Billet* billet)
{
	billet->setNomPassager(nom_);
	billets_.push_back(billet);
}

bool Membre::operator==(const string& nomMembre) const
{
	return nom_ == nomMembre;
}

bool operator==(const string& nomMembre, const Membre& membre)
{
	return nomMembre == membre.nom_;
}

// TODO
Membre& Membre::operator=(const Membre& membre)
{
	if (this != &membre) {
		nom_ = membre.nom_;

		for (size_t i = 0; i < billets_.size(); ++i) {
			delete billets_[i];
		}

		billets_.clear();

		*this = Membre(membre);

	}

	return *this;
}

// TODO : Remplacer cette fonction par la methode afficher()
/*ostream& operator<<(ostream& o, const Membre& membre)
{
	o << setfill(' ');
	o << "- Membre " << membre.nom_ <<":" << endl;
	o << "\t" << "- Billets :" << endl;
	for (size_t i = 0; i < membre.billets_.size(); i++) {
		switch (membre.billets_[i]->getTypeBillet()) {
		case Billet_Base:
			o << *static_cast<Billet*>(membre.billets_[i]);
			break;
		case Billet_Regulier:
			o << *static_cast<BilletRegulier*>(membre.billets_[i]);
			break;
		case Flight_Pass:
			o << *static_cast<FlightPass*>(membre.billets_[i]);
			break;
		}
	}
	return o << endl;
}*/

// TODO
void Membre::afficher(ostream& o)
{
	o << setfill(' ');
	o << "- Membre " << nom_ << ":" << endl;
	o << "\t" << "- Billets :" << endl;
	for (size_t i = 0; i < billets_.size(); i++) {

		billets_[i]->afficher(o);
	}
}