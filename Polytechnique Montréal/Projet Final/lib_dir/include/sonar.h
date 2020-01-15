/****************************************************************************
 * Fichier: sonar.h
 * Auteur: Melody Roy, Pier-Luc Tanguay, Aya Kamate et Calie Paulin
 * Date: 3 décembre 2019
 * Description: Déclaration des fonctions et des constantes liées au sonar
 ****************************************************************************/

#ifndef SONAR_H_INCLUDED
#define SONAR_H_INCLUDED

#include <avr/io.h>
#include <util/delay.h>

#define echoSonar (PINB & 0x80)
#define echoSonar (PINB & 0x80)

// Constantes

const int DELAI_SONAR = 50;
const int DELAI_SONAR_TRIGGER = 20;
const double CONVERSION_CM = 5.8;
extern volatile bool minuterieExpiree;

// Définitions des fonctions

void parametreMinuterie(uint16_t dureeMicroSeconde);
double distanceMur();
void delayMicroSeconde(uint16_t dureeMicroSeconde);

#endif