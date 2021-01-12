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

//Constances
const unsigned long LED_VERT = 0x1; //Couleur peut-être inversée selon la connection sur le robot
const unsigned long LED_ROUGE = 0x2; 
const unsigned long LED_ETEINT = 0x0; 
const int duree =2;


void allumerLed (double pourcentage, double frequence, double duree){
	double ratioFrequence = 2000000/frequence;
	double ratio = 2000000/ratioFrequence*duree;
	
	if (pourcentage == 0){
			PORTB=0;
		_delay_ms(2000);
	}
	else if(pourcentage ==1){
		PORTB=LED_VERT;
		_delay_ms(2000);
	}
	else{
		for(int i=0; i< ratio; i++){
			 PORTB=LED_VERT;
			 _delay_loop_2(pourcentage*ratioFrequence);
			PORTB = LED_ETEINT;
			_delay_loop_2 ((1-pourcentage)*ratioFrequence);
		}
	}
}

int main()
{
	DDRB = 0xff; // PORT B est en mode sortie
	DDRD = 0x0;  // PORT D est en mode entrée

	for (;;) {
	allumerLed (0.00, 60, 2 );
 	allumerLed (0.25 , 60,2);
 	allumerLed (0.50, 60,2);
 	allumerLed (0.75,60,2);
 	allumerLed (1.00,60,2);


	allumerLed (0.00, 400, 2 );
 	allumerLed (0.25 , 400,2);
 	allumerLed (0.50, 400,2);
 	allumerLed (0.75,400,2);
 	allumerLed (1.00,400,2);
}
	
	return 0;
}