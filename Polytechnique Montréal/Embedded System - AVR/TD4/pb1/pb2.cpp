

#define F_CPU 8000000
#include <avr/io.h>
#include <util/delay.h>
#include <avr/interrupt.h>

//Constances
const unsigned long LED_ETEINT = 0x0;
const unsigned long LED_VERT = 0x1;
const unsigned long LED_ROUGE = 0x2;
const int DELAI_AMBRE_VERT = 8; // Nous jugeons le délai adéquat pour une belle couleur ambré (plus de vert que de rouge)
const int DELAI_AMBRE_ROUGE = 5; 

enum Etat { init, etat1 , etat2, etat3 , etat4, etat5 };
volatile uint8_t etat = init;

//Fonction permettant la couleur ambré de la LED 
void couleurAmbre(){
		PORTB = LED_VERT;
		_delay_ms(DELAI_AMBRE_VERT);
		PORTB = LED_ROUGE;	
		_delay_ms(DELAI_AMBRE_ROUGE);
}


// placer le bon type de signal d'interruption
// à prendre en charge en argument. Choix
ISR (INT0_vect) {

	// laisser un delai avant de confirmer la réponse du
	// bouton-poussoir: environ 30 ms (anti-rebond)
	_delay_ms ( 30 );

	// se souvenir ici si le bouton est pressé ou relâché
	const unsigned long interrupteurAppuye = PIND & 0x04;

// changements d'états tels que ceux de la
// semaine précédente
switch (etat)
		{
		case init:
			if (interrupteurAppuye)
				etat = etat1;
			break;

		case etat1:
			if (!interrupteurAppuye)
				etat = etat2;
			break;

		case etat2:
			if (interrupteurAppuye)
				etat = etat3;
			break;

		case etat3:
			if (!interrupteurAppuye)
				etat = etat4;
			break;

		case etat4:
			if (interrupteurAppuye)
				etat = etat5;
			break;

		case etat5:
			if (!interrupteurAppuye)
				etat = init;
			break;
		}

// Voir la note plus bas pour comprendre cette instruction et son rôle
EIFR |= (1 << INTF0) ;
}


void initialisation ( void ) {

// cli est une routine qui bloque toutes les interruptions.
// Il serait bien mauvais d'être interrompu alors que
// le microcontroleur n'est pas prêt...
cli ();


// configurer et choisir les ports pour les entrées
// et les sorties. DDRx... Initialisez bien vos variables
	DDRB = 0xff; // PORT B est en mode sortie
	DDRD = 0x0;  // PORT D est en mode entrée


// cette procédure ajuste le registre EIMSK
// de l’ATmega324PA pour permettre les interruptions externes
EIMSK |= (1 << INT0) ;


// il faut sensibiliser les interruptions externes aux
// changements de niveau du bouton-poussoir
// en ajustant le registre EICRA
EICRA |= 0x01 ;


// sei permet de recevoir à nouveau des interruptions.
sei ();

}



int main()
{

	initialisation();

	for (;;)
	{
		switch (etat)
		{
		case init:
			PORTB = LED_ROUGE;
			break;

		case etat1:
			couleurAmbre();
			break;

		case etat2:
			PORTB = LED_VERT;
			break;

		case etat3:
			PORTB = LED_ROUGE;
			break;

		case etat4:
			PORTB = LED_ETEINT;
			break;

		case etat5:
			PORTB = LED_VERT;
			break;
		}const int DELAI_DEBOUNCE = 10; // Délai recommandé pour le debounce
	}

	return 0;
}