/////////////////////////////////////////////////////////////////
// Nom: pb1.cpp      										   //
//					                                           //
// Description: Les compteurs sont une forme de machines à     //
// états. On veut ici simplement que la DEL soit éteinte au    //
// départ. On doit appuyer et relâcher 5 fois le               //
// bouton-poussoir avant que la DEL tourne au rouge pendant    //
// exactement 1 seconde. Par la suite, on revient au départ    //
// pour pouvoir recommencer.					               //
//															   //
// Auteurs: Melody Roy (1991902) et Pier-Luc Tanguay (1953707) //
// Date: 13 septembre 2019                                     //
//        
//        +------+------+--------------+--------+ EA + EAL = Etat appuyé
//        | Etat | PIND | Etat Suivant | Port B | ER + init = Etat relaché
//        +------+------+--------------+--------+
//        +------+------+--------------+--------+
//        | init |   0  |     init     |    0   | compteur = 0
//        +------+------+--------------+--------+
//        | init |   1  |      EA1     |    0   |
//        +------+------+--------------+--------+
//        
//        |  EA1 |   0  |      ER1     |    0   | compteur =1
//        +------+------+--------------+--------+
//        |  EA1 |   1  |      EA1     |    0   |  
//        +------+------+--------------+--------+
//        |  ER1 |   0  |      ER1     |    0   |
//        +------+------+--------------+--------+
//        |  ER1 |   1  |      EA2     |    0   |
//        +------+------+--------------+--------+
//        
//        |  EA2 |   0  |      ER2     |    0   | compteur =2
//        +------+------+--------------+--------+
//        |  EA2 |   1  |      EA2     |    0   | 
//        +------+------+--------------+--------+
//        |  ER2 |   0  |      ER2     |    0   |
//        +------+------+--------------+--------+
//        |  ER2 |   1  |      EA3     |    0   |
//        +------+------+--------------+--------+
//        
//        |  EA3 |   0  |      ER3     |    0   | compteur =3
//        +------+------+--------------+--------+
//        |  EA3 |   1  |      EA3     |    0   | 
//        +------+------+--------------+--------+
//        |  ER3 |   0  |      ER3     |    0   |
//        +------+------+--------------+--------+
//        |  ER3 |   1  |      EA4     |    0   |
//        +------+------+--------------+--------+
//        
//        |  EA4 |   0  |      ER4     |    0   | compteur =4
//        +------+------+--------------+--------+
//        |  EA4 |   1  |      EA4     |    0   | 
//        +------+------+--------------+--------+
//        |  ER4 |   0  |      ER4     |    0   |
//        +------+------+--------------+--------+
//        |  ER4 |   1  |      EA5     |    0   |
//        +------+------+--------------+--------+
//        
//        |  EA5 |   0  |      EAL     |    0   | compteur =5
//        +------+------+--------------+--------+
//        |  EA5 |   1  |      EA1     |    0   |
//        +------+------+--------------+--------+
//        |  EAL |   X  |     init     |    2   | délai de 1 seconde avant le prochain état
//        +------+------+--------------+--------+
//        
//    Nous avons opté pour une solution avec compteur. Un compteur est un système
//    d'états "cachés" qui simplifie le programme dans ce cas-ci.
///////////////////////////////////////////////////////////////

#define F_CPU 8000000
#include <avr/io.h>
#include <util/delay.h>

// Constantes
const unsigned long LED_ETEINT = 0x0;
const unsigned long LED_ROUGE = 0x2;
const unsigned long COMPTEUR_RESET = 0x1;
const unsigned long COMPTEUR_CINQ = 0x5;
const int DELAI_SECONDE = 1000; // Délai de 1 seconde
const int DELAI_DEBOUNCE = 10; // Délai recommandé pour le debounce

enum Etat { relache, appuye };

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
	DDRB = 0xff;				  // PORT B est en mode sortie
	DDRD = 0x0;					  // PORT D est en mode entrée
	unsigned long compteur = 0x1; // le compteur est initialise a 1.

	int etat = relache;

	for (;;)
	{
		switch (etat)
		{

		case relache:
			PORTB = LED_ETEINT;
			if (boutonAppuye()){
				etat = appuye;
				}
			break;

		case appuye:
			PORTB = LED_ETEINT;
			if (!boutonAppuye())
			{
					etat = relache;
					if (compteur < COMPTEUR_CINQ)
						compteur++;
					else
					{
						compteur = COMPTEUR_RESET;
						PORTB = LED_ROUGE;
						_delay_ms(DELAI_SECONDE);
					}
			}
			break;
		}
	}

	return 0;
}