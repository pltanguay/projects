

#include "client.h"

Client::Client(int lid, std::string le_nom, std::string le_prenom, int lage, std::string codePostal, tm la_date_adhesion) {
	this->id = lid;
	this->nom = le_nom;
	this->prenom = le_prenom;
	this->age = lage;
	this->codePostal = codePostal;
	this->adhesion = la_date_adhesion;
}