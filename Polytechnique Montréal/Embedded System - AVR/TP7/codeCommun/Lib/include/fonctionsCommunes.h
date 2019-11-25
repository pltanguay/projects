#include <can.h>
#include <avr/io.h>
#include <util/delay.h>
#include <memoire_24.h>

const uint8_t LED_ETEINT = 0x00;
const uint8_t LED_ROUGE = 0x02;
const uint8_t LED_VERT = 0x01;

const uint8_t HUIT_BIT_MAX = 0xFF;

const uint8_t DELAI_AMBRE_VERT = 8; // Nous jugeons le délai adéquat pour une belle couleur ambré (plus de vert que de rouge)
const uint8_t DELAI_AMBRE_ROUGE = 5;

const uint16_t DELAI_SECONDE = 1000; // Délai de 1 seconde
const uint8_t DELAI_DEBOUNCE = 10;  // Délai recommandé pour le debounce

const uint16_t DUREE_CLIGNOTEMENT = 500; 