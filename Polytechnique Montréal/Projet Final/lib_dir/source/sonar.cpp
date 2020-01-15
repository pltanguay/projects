/****************************************************************************
 * Fichier: sonar.cpp
 * Auteur: Melody Roy, Pier-Luc Tanguay, Aya Kamate et Calie Paulin
 * Date: 3 décembre 2019
 * Description: Fonctions liées au sonar
 ****************************************************************************/

#include "sonar.h"
#include "UART.h"

/****************************************************************************
 * Fonction:	parametreMinuterie
 * Description: Initialise la minuterie pour la durée désiré (uS)  
 * Paramètres:  - uint16_t dureeMicroSeconde: le nombre de uS
 * Retour:	    - aucun
 ****************************************************************************/
void parametreMinuterie(uint16_t dureeMicroSeconde)
{
	minuterieExpiree = false;

	TCNT2 = 0;
	OCR2A = dureeMicroSeconde;
	TCCR2A = (1 << WGM22);
	TCCR2B = (1 << CS21); // pre-scaler 8 pour micro-secondes
	TCCR1C = 0;
	TIMSK2 = (1 << OCIE2A);
}

/****************************************************************************
 * Fonction:	delayMicroSeconde
 * Description: Fonction qui permet d'attendre que la minuterie expire, selon
 * 				le delai souhaité en uS. 
 * Paramètres:  - uint16_t dureeMicroSeconde: le nombre de uS
 * Retour:	    - aucun
 ****************************************************************************/
void delayMicroSeconde(uint16_t dureeMicroSeconde)
{
	parametreMinuterie(dureeMicroSeconde);
	while (!minuterieExpiree)
	{
	}
}

/****************************************************************************
 * Fonction:	distanceMur
 * Description: Fonction qui permet de retourner la distance entre mur et 
 * 				robot en utilisant le capteur Sonar 
 * Paramètres:  - aucun
 * Retour:	    - aucun
 ****************************************************************************/
double distanceMur()
{
	PORTB &= 0xBF;
	delayMicroSeconde(2);

	double distance;
	int compteurDistance = 0;

	// Trigger
	PORTB |= 0x40;
	delayMicroSeconde(20);
	PORTB &= 0xBF;

	// Attendre que le signal echo soit HIGH
	while (!echoSonar)
	{
	}

	// Tant que la PB7 est à 1
	while (echoSonar)
	{
		// On attend pendant que la minuterie n'est pas expirée
		delayMicroSeconde(1);

		compteurDistance++;
	}

	distance = compteurDistance / CONVERSION_CM;
	transmissionUART(compteurDistance);

	_delay_ms(DELAI_SONAR);
	return distance;
}