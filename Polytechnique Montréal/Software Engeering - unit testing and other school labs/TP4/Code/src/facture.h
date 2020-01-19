#ifndef __FACTURE__
#define __FACTURE__

#include <vector>

/**
 * Classe qui gère une facture d'items.
 */
class Facture {
	private:
		std::vector<float> items;
	public:
		void ajouterItem(float item);
		float getItem(int index);
		int getSize();
};

#endif
