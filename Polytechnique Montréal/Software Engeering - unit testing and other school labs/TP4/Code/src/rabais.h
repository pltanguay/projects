#ifndef __RABAIS__
#define __RABAIS__

#include <fstream>
#include <sstream>
#include <string>
#include <map>
#include <iostream>
#include <ctime>

#include "client.h"
#include "facture.h"

/**
 * Classe qui fait la lecture du fichier des client et le calcul du rabais attribué.
 */
class Rabais {
	private:
		std::map<int, Client*> clients;
		
		void lireFichier(std::string fichier_clients);
		
	public:
		Rabais(std::string fichier_clients);
		Rabais();
		~Rabais();
		void ajouterClient(Client* c);
		float getRabais(Facture f, int code_client);
		std::string getInfoClient(int code_client);
};

#endif

