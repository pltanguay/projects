/////////////////////////////////////////////////////////////////
// Nom: pb2.cpp  											   //
//                                             		    	   //
// Description: Quand la carte mère démarre, la DEL libre doit //
// s'allumer en rouge. Si le bouton-poussoir noir est pesé,    //
// la DEL affiche la couleur ambre. Quand le bouton-poussoir   //
// est relâché, la DEL devient verte. Si le bouton est de      //
// nouveau pesé, la DEL prend la couleur rouge encore. Quand   //
// il est relâché, la DEL s'éteint. Si le bouton est de nouveau// 
// pesé, la DEL affiche la couleur verte. Quand il est relâché,// 
// la DEL tourne au rouge ce qui fait que la carte mère est de //
// retour à son état initial et tout peut recommencer.   	   //
//				   										       //
// Auteurs: Melody Roy (1991902) et Pier-Luc Tanguay (1953707) //
// Date: 13 septembre 2019 									   //
//                                                             //
//        +---------+------+--------------+-------+
//        | Etat    | PIND | Etat suivant | PORTB |
//        +---------+------+--------------+-------+
//        +---------+------+--------------+-------+
//        | init    | 0    | init         | 2     |
//        +---------+------+--------------+-------+
//        | init    | 1    | etat1.1      | 2     | 
//        +---------+------+--------------+-------+
//        | etat1.1 | 0    | etat2        | 1     |  Ambré: "etat 1", variation etat 1.1 et 1.2
//        +---------+------+--------------+-------+      
//        | etat1.1 | 1    | etat1.2      | 1     |
//        +---------+------+--------------+-------+
//        | etat1.2 | 0    | etat2        | 2     |
//        +---------+------+--------------+-------+
//        | etat1.2 | 1    | etat1.1      | 2     |
//        +---------+------+--------------+-------+
//        | etat2   | 0    | etat2        | 1     |
//        +---------+------+--------------+-------+
//        | etat2   | 1    | etat3        | 1     |
//        +---------+------+--------------+-------+
//        | etat3   | 0    | etat4        | 2     |
//        +---------+------+--------------+-------+
//        | etat3   | 1    | etat3        | 2     |
//        +---------+------+--------------+-------+
//        | etat4   | 0    | etat4        | 0     |
//        +---------+------+--------------+-------+
//        | etat4   | 1    | etat5        | 0     |
//        +---------+------+--------------+-------+
//        | etat5   | 0    | init         | 1     |
//        +---------+------+--------------+-------+
//        | etat5   | 1    | etat5        | 1     |
//        +---------+------+--------------+-------+
/////////////////////////////////////////////////////////////////

#define F_CPU 8000000
#include <avr/io.h>
#include <util/delay.h>

//Constances
const unsigned long LED_ETEINT = 0x0;
const unsigned long LED_VERT = 0x1;
const unsigned long LED_ROUGE = 0x2;
const int DELAI_DEBOUNCE = 10; // Délai recommandé pour le debounce
const int DELAI_AMBRE_VERT = 8; // Nous jugeons le délai adéquat pour une belle couleur ambré (plus de vert que de rouge)
const int DELAI_AMBRE_ROUGE = 5; 

enum Etat { init, etat1 , etat2, etat3 , etat4, etat5 };


//Fonction permettant la couleur ambré de la LED 
void couleurAmbre(){
		PORTB = LED_VERT;
		_delay_ms(DELAI_AMBRE_VERT);
		PORTB = LED_ROUGE;	
		_delay_ms(DELAI_AMBRE_ROUGE);
}


// Fonction qui retourne vrai lorsque interrupteur est vraiment appuye
bool boutonAppuye(){
		if (PIND & 0x04)
			{
				_delay_ms(DELAI_DEBOUNCE);
				if (PIND & 0x04)
					return true;
			}
		else
			return false;
}


int main()
{
	DDRB = 0xff; // PORT B est en mode sortie
	DDRD = 0x0;  // PORT D est en mode entrée

	int etat = init;

	for (;;)
	{
		switch (etat)
		{
		case init:
			PORTB = LED_ROUGE;
			if (boutonAppuye())
				etat = etat1;
			break;

		case etat1:
			couleurAmbre();
			if (!boutonAppuye())
				etat = etat2;
			break;

		case etat2:
			PORTB = LED_VERT;
			if (boutonAppuye())
				etat = etat3;
			break;

		case etat3:
			PORTB = LED_ROUGE;
			if (!boutonAppuye())
				etat = etat4;
			break;

		case etat4:
			PORTB = LED_ETEINT;
			if (boutonAppuye())
				etat = etat5;
			break;

		case etat5:
			PORTB = LED_VERT;
			if (!boutonAppuye())
				etat = init;
			break;
		}
	}

	return 0;
}