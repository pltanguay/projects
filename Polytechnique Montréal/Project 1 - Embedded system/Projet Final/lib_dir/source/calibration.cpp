/****************************************************************************
 * Fichier: calibration.cpp
 * Auteur: Melody Roy, Pier-Luc Tanguay, Aya Kamate et Calie Paulin
 * Date: 3 décembre 2019
 * Description: Fonctions nécessaires à la calibration
 ****************************************************************************/

#include "calibration.h"

int ajusteBatterie;



/****************************************************************************
 * Fonction:	executerCalibration
 * Description: Ajuste le PWM pour le reste du programme selon la puissance 
 *              des batteries. Est basé sur des tests fait sur une source de 
 *              tension à 9,4 V qui calcule le temps nécessaire pour parcourir
 *              une distance correspondant à une ligne noir du couloir.
 * Paramètres:	- aucun
 * Retour:		- aucun
 ****************************************************************************/
void executerCalibration()
{

    // Compteur testé avec une source de 9.4V, moyenne de différence de potentielle.
    const int compteurMIN = 70;
    int compteurCalibration = 0;

    while (!detecteSurfaceBlanche())
    {
        PORTB = LED_VERT;
        compteurCalibration++;
        _delay_ms(50);
        PORTB = LED_ROUGE;
         _delay_ms(50);
        suivreLigneNoir();
    }
    arreterMoteur();

    // Nécessaire pour prendre des données et faire des statistiques qui ont servi à établir la formule ci-dessous
    // transmissionUART(compteurCalibration);

    if (compteurCalibration < compteurMIN)
        ajusteBatterie = 0;
    else
        ajusteBatterie = 3 * (compteurCalibration - compteurMIN) / 5;

    sonValidation();
}