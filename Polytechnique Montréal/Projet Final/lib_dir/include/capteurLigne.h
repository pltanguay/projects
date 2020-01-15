/****************************************************************************
 * Fichier: capteurLigne.h
 * Auteur: Melody Roy, Pier-Luc Tanguay, Aya Kamate et Calie Paulin
 * Date: 3 décembre 2019
 * Description: Déclaration des fonctions et des constantes liées au capteur de ligne
 ****************************************************************************/

#include <util/delay.h>
#include <avr/io.h>

#ifndef CAPTEURLIGNE_H_INCLUDED
#define CAPTEURLIGNE_H_INCLUDED

#define capteurGauche (PINA & 0x01)
#define capteurMilieuGauche (PINA & 0x02)
#define capteurMilieu (PINA & 0x04)
#define capteurMilieuDroit (PINA & 0x08)
#define capteurDroit (PINA & 0x10)

// Définitions des fonctions

bool detecteSurfaceBlanche();
bool detecteSurfaceNoire();
bool detecteLigneNoire();
bool lireCoin();

#endif