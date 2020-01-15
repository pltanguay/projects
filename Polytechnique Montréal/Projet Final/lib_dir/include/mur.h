/****************************************************************************
 * Fichier: mur.h
 * Auteur: Melody Roy, Pier-Luc Tanguay, Aya Kamate et Calie Paulin
 * Date: 3 décembre 2019
 * Description: Déclaration des fonctions et des constantes liées au mur
 ****************************************************************************/

#include "capteurLigne.h"
#include "moteurs.h"
#include "sonar.h"

#ifndef MUR_H_INCLUDED
#define MUR_H_INCLUDED

// Constantes

const double DISTANCE_MIN = 14;
const double DISTANCE_MAX = 15;

// Fonctions

void executerMur();

#endif