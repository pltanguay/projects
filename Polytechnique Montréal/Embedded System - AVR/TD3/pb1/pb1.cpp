/////////////////////////////////////////////////////////////////
// Nom: pb1.cpp      										   //
//					                                           //
// Description: 					               //
//															   //
// Auteurs: Melody Roy (1991902) et Pier-Luc Tanguay (1953707) //
// Date:                                     //
//       
///////////////////////////////////////////////////////////////

#define F_CPU 8000000
#include <avr/io.h>
#include <util/delay.h>
#include <util/delay_basic.h>

const unsigned long LED_VERT = 0x1; //Couleur peut-être inversée selon la connection sur le robot
const unsigned long LED_ROUGE = 0x2; 
const unsigned long LED_ETEINT = 0x0; 

void allumerLed (const unsigned long couleur){


	for(int i=0; i<3000; i++){
		int increment = 2*i / 3;
		
		if (increment == 0) 
			increment=1;

		 	PORTB=couleur;
			  _delay_loop_2(2000-increment);
			PORTB = LED_ETEINT;
			  _delay_loop_2 (increment);

		
	}
}

int main()
{
	DDRB = 0xff;				  // PORT B est en mode sortie

 	for(;;) {

		allumerLed(LED_VERT);
		allumerLed(LED_ROUGE);
	}
	  				
	return 0;
}