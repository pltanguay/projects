/////////////////////////////////////////////////////////////////
// Nom: pb2.cpp  											   //
//                                             		    	   //
// Description:    //
//				   										       //
// Auteurs: Melody Roy (1991902) et Pier-Luc Tanguay (1953707) //
// Date: 									   //
//     
/////////////////////////////////////////////////////////////////

#define F_CPU 8000000
#include <avr/io.h>
#include <util/delay.h>
#include <util/delay_basic.h>



void ajustementPWM ( uint8_t hauteur  ) {

// mise à un des sorties OC1A et OC1B sur comparaison

// réussie en mode PWM 8 bits, phase correcte

// et valeur de TOP fixe à 0xFF (mode #1 de la table 17-6

// page 177 de la description technique du ATmega324PA)

OCR1A = hauteur ;

OCR1B = hauteur ;


// division d'horloge par 8 - implique une frequence de PWM fixe

TCCR1A = 
	(1 << WGM10) | 
	(1 << COM1A1) |
	(1 << COM1B1);

TCCR1B = (1 << CS11) ;

TCCR1C = 0;

}




int main()
{
	DDRB = 0xff; // PORT B est en mode sortie
	DDRD = 0xff;  // PORT D est en mode sorti

/*for (;;)
{
	ajustementPWM(64);
	_delay_ms(2000);

	ajustementPWM(128);
	_delay_ms(2000);

	ajustementPWM(191);
	_delay_ms(2000);

	ajustementPWM(254);
	_delay_ms(2000);
}*/

ajustementPWM(254);
	
	return 0;
}