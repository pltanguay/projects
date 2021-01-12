#define F_CPU 8000000

#include <fonctionsCommunes.h>

int main() {


DDRB = 0xFF;

    clignoter2Couleur(LED_VERT, LED_ROUGE, 2);

    return 0;
}