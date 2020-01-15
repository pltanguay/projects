/****************************************************************************
 * Fichier: mur.cpp
 * Auteur: Melody Roy, Pier-Luc Tanguay, Aya Kamate et Calie Paulin
 * Date: 3 décembre 2019
 * Description: Fonction propre à la section du mur
 ****************************************************************************/

#include "mur.h"

/****************************************************************************
 * Fonction:	executerMur
 * Description: Executer la section du mur
 * Paramètres:	- aucun
 * Retour:		- aucun
 ****************************************************************************/
void executerMur()
{
    double distance;

    while (detecteLigneNoire())
    {
        suivreLigneNoir();
    }

    while (detecteSurfaceBlanche())
    {
        //Capter la distance courante
        distance = distanceMur();

        if (distance < DISTANCE_MIN)
        {
            PORTB = LED_ROUGE;
            ajustementMur(true);
        }
        else if (distance > DISTANCE_MAX)
        {
            ajustementMur(false);
            PORTB = LED_ROUGE;
        }
        else
        {
            avancerLigneDroite(true, VITESSE_MOTEUR_MUR);
            PORTB = LED_VERT;
        }
        _delay_ms(50);
    }

    PORTB = LED_ETEINT;

    // Force le robot à dépasser la ligne pour ensuite effectuer un virage à droite sans complication
    if (capteurGauche)
    {
        while (detecteLigneNoire())
        {
            ajustementPWM(0, 95 + ajusteBatterie, true, true);
        }
        // boost de la roue gauche pour la faire démarrer
        ajustementPWM(150, 95 + ajusteBatterie, true, true);
        _delay_ms(100);
    }
    _delay_ms(500);
    
    virageDroite();

    while (detecteLigneNoire())
    {
        suivreLigneNoir();
    }
}
