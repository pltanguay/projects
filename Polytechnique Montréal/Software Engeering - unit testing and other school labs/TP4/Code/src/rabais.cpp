
#include "rabais.h"

Rabais::Rabais(std::string fichier_clients){
	this->lireFichier(fichier_clients);
}
	
void Rabais::lireFichier(std::string fichier_clients) {
	// Ouverture du fichier.
  	std::ifstream infile(fichier_clients);

	// L'objet qui contiendra la ligne lue.
  	std::string line;

  	// Lecture de toutes les lignes dans le fichier.
	while(std::getline(infile, line)) {

		// Lecture d'une ligne dans le fichier
		std::stringstream lineStream(line);

		// Extraction des informations de la ligne lue dans le fichier.
		std::string id_string;
		std::getline(lineStream, id_string, ' ');
		
		std::string nom;
		std::getline(lineStream, nom, ' ');
		
		std::string prenom;
		std::getline(lineStream, prenom, ' ');

		std::string age_string;
		std::getline(lineStream, age_string, ' ');

		std::string zone;
		std::getline(lineStream, zone, ' ');

		std::string annee_string;
		std::getline(lineStream, annee_string, '-');
		
		std::string mois_string;
		std::getline(lineStream, mois_string, '-');
		
		std::string jour_string;
		std::getline(lineStream, jour_string, ' ');

		// Transformation des strings en valeurs numériques.
		int id = std::stoi(id_string);
		int age = std::stoi(age_string);
		
		// Construction de la date d'adhésion
		tm adhesion;
		adhesion.tm_year = std::stoi(annee_string) - 1900;
		adhesion.tm_mon = std::stoi(mois_string);
		adhesion.tm_mday = std::stoi(jour_string);
		
		// Création du client.
		Client* nouveau_client = new Client(id, nom, prenom, age, zone, adhesion);
		
		// Ajout du client dans le "map".
		std::pair<int, Client*> insertion(id, nouveau_client); 
		clients.insert(insertion);
	}
}

Rabais::Rabais() {}

Rabais::~Rabais() {
	// Passe à travers le "map" pour effacer les objets clients.
	std::map<int, Client*>::iterator it;
	for (it=this->clients.begin() ; it!=this->clients.end() ; it++)
		delete it->second;
	
	// Efface les objets "std::pair" à l'intérieur du "map".
	this->clients.clear();
}

void Rabais::ajouterClient(Client* c) {
	std::pair<int, Client*> insertion(c->getID(), c);
	clients.insert(insertion);
}

float Rabais::getRabais(Facture f, int code_client) {

	float rabais = 0;
	
	Client* le_client = this->clients[code_client];
	
	// Les ID de plus de 25000 représentent les employéEs.
	if (le_client->getID() > 25000) {
		rabais = 0.15;
		return rabais;
	}
	
	// Rabais basé sur l'âge
	if (le_client->getAge() > 55) rabais += 0.1;
	
	// Rabais basé sur la zone
	if (le_client->getcodePostal().compare("H1C") == 0) rabais += 0.03;
	else if (le_client->getcodePostal().compare("H3P") == 0) rabais += 0.03;
	else if (le_client->getcodePostal().compare("J4O") == 0) rabais += 0.02;
	
	// Rabais basé sur la date d'adhésion
	// Obtenir l'année courante.
	std::time_t t = std::time(0);   // get time now
    std::tm* now = std::localtime(&t);
    int annee_courante = now->tm_year + 1900;
	
	// 1% de rabais par trois années, maximum 5%
	int rabais_adhesion = (annee_courante - le_client->getAdhesion().tm_year)/3; 
	if (rabais_adhesion > 10) rabais_adhesion = 10;
	rabais += float(rabais_adhesion) / 50;
	
	// Rabais basé sur le total de la facture
	float total = 0;
	for (int item=0 ; item<f.getSize() ; item++) {
		total += f.getItem(item);
	}
	
	int rabais_achats = total/120;
	if (rabais_achats > 6) rabais_achats = 6;
	rabais += float(rabais_achats)/100;
	
	return rabais;
}

std::string Rabais::getInfoClient(int code_client) {
	Client* le_client = this->clients[code_client];
	std::string info_client = le_client->getPrenom() + " " + le_client->getNom() + " #" + std::to_string(le_client->getID());
	return info_client;
}



