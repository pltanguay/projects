/****************************************************************************
 * Fichier: initialisation.h
 * Auteur: Melody Roy, Pier-Luc Tanguay, Aya Kamate et Calie Paulin
 * Date: 3 décembre 2019
 * Description: Déclaration de la fonction et inclue les fichiers nécessaires
 ****************************************************************************/

#ifndef INITIALISATION_H_INCLUDED
#define INITIALISATION_H_INCLUDED

#include <avr/io.h>
#include "moteurs.h"
#include "LCD.h"
#include "coupures.h"
#include "calibration.h"
#include "couloir.h"
#include "mur.h"
#include "boucle.h"
#include "son.h"
#include "UART.h"
#include "sonar.h"

// Définitions des fonctions

void initialisationGlobale();

#endif