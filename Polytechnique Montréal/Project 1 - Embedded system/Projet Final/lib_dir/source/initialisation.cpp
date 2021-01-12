/****************************************************************************
 * Fichier: initialisation.cpp
 * Auteur: Melody Roy, Pier-Luc Tanguay, Aya Kamate et Calie Paulin
 * Date: 3 décembre 2019
 * Description: Fonction relative à l'initialisation
 ****************************************************************************/

#include "initialisation.h"

/****************************************************************************
 * Fonction:	initialisationGlobale
 * Description: Configure les paramètres nécessaires à l'exécution du programme
 * Paramètres:	- aucun
 * Retour:		- aucun
 ****************************************************************************/
void initialisationGlobale()
{
    cli();

    initialisationUART();

    // PORTA = capteur ligne (entrée)
    DDRA = 0x00;

    // PB0 et PB1 = LED (sortie)
    // PB2 et PB3 = son (sortie)
    // PD7 = echo Sonar (entrée)
    // PD6 = trigger Sonar (sortie)
    DDRB = 0b01111111;

    // PORTC = écran
    DDRC = 0x11;

    // PD3 = Bouton carré (entrée)
    // PD4 = Bouton rond (entrée)
    DDRD = 0b11110011;

    // Active deux interrupts
    // Interrupt 0 = Bouton carré
    // Interrupt 2 = Bouton rond
    EIMSK |= (1 << INT0) | (1 << INT1);

    // Type d'interrupt
    // Interrupt 0, sense control = Rising edge , BoutonRond
    // Interrupt 1, sense control = Falling edge , BoutonCarre
    EICRA |= (1 << ISC01) | (1 << ISC00) | (1 << ISC11);

    // On place boutonActive à faux au début du programme.
    boutonCarreActive = false;
    boutonRondActive = false;

    sei();
}