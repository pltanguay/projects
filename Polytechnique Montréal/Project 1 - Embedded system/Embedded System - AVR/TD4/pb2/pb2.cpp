

#define F_CPU 8000000
#include <avr/io.h>
#include <util/delay.h>
#include <avr/interrupt.h>

//Constances
const unsigned long LED_ETEINT = 0x0;
const unsigned long LED_VERT = 0x1;
const unsigned long LED_ROUGE = 0x2;



volatile uint8_t minuterieExpiree;
volatile uint8_t boutonPoussoir; 
volatile bool init;


ISR ( TIMER1_COMPA_vect ) {
	minuterieExpiree = 1;
}


ISR ( INT0_vect ) {
	// anti-rebond
	_delay_ms(30);
	if(PIND & 0x04)
		boutonPoussoir = 1;
if(!init){
	if (minuterieExpiree == 0)
		PORTB=0x01;
	else
	{
		PORTB=0x02;
	}
}
	
}

void partirMinuterie ( uint16_t duree ) {

minuterieExpiree = 0;

// mode CTC du timer 1 avec horloge divisée par 1024

// interruption après la durée spécifiée

TCNT1 = 0 ;
OCR1A = duree;
TCCR1A = (1 << WGM12) ;
TCCR1B = (1 << CS12) | (1 <<CS10) ;
TCCR1C = 0;
TIMSK1 = (1 << OCIE1A);


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
EICRA |= 0x03 ;


// sei permet de recevoir à nouveau des interruptions.
sei ();

}



int main()
{
	initialisation();
	init = true;
	PORTB = 0x0;
	_delay_ms (10000);
	PORTB= 0x2;
	_delay_ms(100);
	PORTB = 0x0;
	init =false;
	partirMinuterie(7813);

	do {
	// attendre qu'une des deux variables soit modifiée
	// par une ou l'autre des interruptions.
	} while ( /*minuterieExpiree == 0 &&*/ boutonPoussoir == 0 );

	// Une interruption s'est produite. Arrêter toute
	// forme d'interruption. Une seule réponse suffit.
	cli ();

	// Verifier la réponse
//	if (reussi == 1)
//		PORTB=0x02;
//	else 
//		PORTB=0x01;

	return 0;
}