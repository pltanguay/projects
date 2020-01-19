#include "facture.h"

void Facture::ajouterItem(float item) {
	this->items.push_back(item);
}

float Facture::getItem(int index) {
	if (index < this->items.size())
		return this->items[index];
	return -1;
}

int Facture::getSize() {
	return this->items.size();
}
