/****************************************************************************
 * Fichier: UART.cpp
 * Auteur: Melody Roy, Pier-Luc Tanguay, Aya Kamate et Calie Paulin
 * Date: 3 décembre 2019
 * Description: Fonctions liées au UART
 ****************************************************************************/

#include "UART.h"

/****************************************************************************
 * Fonction:	initialisationUART
 * Description: Initialise les paramètre du UART
 * Paramètres:  - aucun
 * Retour:	    - aucun
 ****************************************************************************/
void initialisationUART()
{
    UBRR0H = 0;
    UBRR0L = 0xCF;
    UCSR0A = 0x00;
    UCSR0B |= (1 << RXEN0) | (1 << TXEN0);
    UCSR0C |= (1 << UCSZ01) | (1 << UCSZ00);
}

/****************************************************************************
 * Fonction:	transmissionUART
 * Description: Permet d'afficher une donnée sur le terminal
 * Paramètres:  - uint8_t donnee: la donnée à afficher
 * Retour:	    - aucun
 ****************************************************************************/
void transmissionUART(uint8_t donnee)
{
    while (!(UCSR0A & (1 << UDRE0)))
        ;
    UDR0 = donnee;
}