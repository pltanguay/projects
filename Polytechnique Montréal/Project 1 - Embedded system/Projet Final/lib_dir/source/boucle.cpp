/****************************************************************************
 * Fichier: boucle.cpp
 * Auteur: Melody Roy, Pier-Luc Tanguay, Aya Kamate et Calie Paulin
 * Date: 3 décembre 2019
 * Description: Fonction propre à la section des deux boucles
 ****************************************************************************/

#include "boucle.h"

/****************************************************************************
 * Fonction:	executerBoucles
 * Description: Executer la section des deux boucles
 * Paramètres:	- aucun
 * Retour:		- aucun
 ****************************************************************************/
void executerBoucles()
{
    Boucle positionBoucle = bSeg1;
    uint8_t compteurBoucle = 0;
    bool finBoucle = false;

    while (!finBoucle)
    {
        suivreLigneNoir();

        switch (positionBoucle)
        {
        case bSeg1:

            if (lireCoin())
            {
                compteurBoucle++;
                while (lireCoin())
                {
                }

                if (compteurBoucle == 3)
                {
                    _delay_ms(400);
                    while (capteurMilieu)
                    {
                        ajustementPWM(0, 80 + ajusteBatterie, true, true);
                    }
                    virageGauche();
                    positionBoucle = bSeg2;
                }
            }
            break;

        case bSeg2:
            if (detecteSurfaceBlanche())
            {
                _delay_ms(400);
                virageGauche();
                positionBoucle = bSeg3;
            }
            break;

        case bSeg3:
            if (detecteSurfaceBlanche())
            {
                _delay_ms(400);
                virageGauche();
                positionBoucle = bSeg4;
            }
            break;

        case bSeg4:
            if (detecteSurfaceBlanche() || detecteSurfaceNoire())
            {
                _delay_ms(400);
                virageGauche();
                positionBoucle = bSeg5;
            }
            break;

        case bSeg5:
            if (lireCoin())
            {
                while (lireCoin())
                {
                    PORTB = 0x00;
                }
                _delay_ms(200);
                while (capteurMilieu)
                {
                    ajustementPWM(0, 80 + ajusteBatterie, true, true);
                }
                virageGauche();

                positionBoucle = bSeg6;
            }
            break;

        case bSeg6:
            if (detecteSurfaceBlanche())
            {
                _delay_ms(200);
                virageGauche();
                if(capteurMilieu && capteurMilieuDroit && capteurDroit)
                {
                    while(detecteLigneNoire())
                    {
                        ajustementPWM(0, 80 + ajusteBatterie, true, true);
                    }
                    virageGauche();
                }

                positionBoucle = bSeg7;
            }
            break;

        case bSeg7:
            if (detecteSurfaceBlanche() || detecteSurfaceNoire())
            {
                while (detecteLigneNoire())
                {
                    ajustementPWM(80 + ajusteBatterie, 80 + ajusteBatterie, true, true);
                }

                _delay_ms(400);
                virageGauche();
                positionBoucle = bSeg8;
            }
            break;

        case bSeg8:
            if (detecteSurfaceBlanche() || detecteSurfaceNoire())
            {
                while (detecteLigneNoire())
                {
                    ajustementPWM(80 + ajusteBatterie, 80 + ajusteBatterie, true, true);
                }
                _delay_ms(400);
                virageGauche();
                positionBoucle = bSeg9;
            }
            break;

        case bSeg9:
            if (detecteSurfaceBlanche())
            {
                finBoucle = true;
            }
            break;
        }
    }
}
