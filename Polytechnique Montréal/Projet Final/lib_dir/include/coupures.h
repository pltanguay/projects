/****************************************************************************
 * Fichier: coupures.h
 * Auteur: Melody Roy, Pier-Luc Tanguay, Aya Kamate et Calie Paulin
 * Date: 3 décembre 2019
 * Description: Déclaration des fonctions et des constantes liées à la section des coupures
 ****************************************************************************/

#include "capteurLigne.h"
#include "son.h"
#include "moteurs.h"

#ifndef COUPURES_H_INCLUDED
#define COUPURES_H_INCLUDED

enum Segment
{
    segTV,
    segVW,
    segWY,
    segYZ,
    segZ2,
    seg23,
    seg35,
    seg56,
    seg6A
};

void executerCoupures();

#endif