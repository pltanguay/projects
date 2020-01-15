/****************************************************************************
 * Fichier: son.h
 * Auteur: Melody Roy, Pier-Luc Tanguay, Aya Kamate et Calie Paulin
 * Date: 3 décembre 2019
 * Description: Déclaration des fonctions et des constantes liées au piezzo
 ****************************************************************************/

#ifndef SON_H_INCLUDED
#define SON_H_INCLUDED

#include <avr/io.h>
#include <util/delay.h>


// Constantes

const uint8_t NOTE_MIN = 45, NOTE_MAX = 81;

// Définitions des fonctions

void arreterSon();
void genererSon(uint8_t note);
void sonValidation();
void sonFin();


#endif