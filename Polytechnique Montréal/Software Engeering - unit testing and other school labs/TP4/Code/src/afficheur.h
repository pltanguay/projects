#ifndef __AFFICHEUR__
#define __AFFICHEUR__

#include <iostream>

#include "rabais.h"
#include "facture.h"

class Afficheur {
		private:
			Rabais* gestion_rabais;
		public:
			Afficheur(Rabais* la_gestion_des_rabais);
			void affiche(Facture f, int id_client);
};

#endif
