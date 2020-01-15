/****************************************************************************
 * Fichier: UART.h
 * Auteur: Melody Roy, Pier-Luc Tanguay, Aya Kamate et Calie Paulin
 * Date: 3 décembre 2019
 * Description: Déclaration des fonctions liées au UART
 ****************************************************************************/

#ifndef UART_H_INCLUDED
#define UART_H_INCLUDED

#include <avr/io.h>

void initialisationUART();
void transmissionUART(uint8_t donnee);

#endif