#ifndef __CLIENT__
#define __CLIENT__

#include <ctime>
#include <string>

/**
 * Classe qui contient les informations des clientEs.
 */
class Client {
	private:
		int id;
		std::string nom;
		std::string prenom;
		int age;
		std::string codePostal;
		tm adhesion;
		
	public:
		Client(int lid, std::string le_nom, std::string le_prenom, int lage, std::string la_zone, tm la_date_adhesion);
		int getID() {return this->id;}
		std::string getNom() {return this->nom;}
		std::string getPrenom() {return this->prenom;}
		int getAge() {return this->age;}
		std::string getcodePostal() {return this->codePostal;}
		tm getAdhesion() {return this->adhesion;}
};

#endif

