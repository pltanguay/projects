/****************************************************************************
 * Fichier: boucle.h
 * Auteur: Melody Roy, Pier-Luc Tanguay, Aya Kamate et Calie Paulin
 * Date: 3 décembre 2019
 * Description: Déclaration des fonctions et des constantes liées à la section des boucles
 ****************************************************************************/

#ifndef BOUCLE_H_INCLUDED
#define BOUCLE_H_INCLUDED

#include "capteurLigne.h"
#include "moteurs.h"

enum Boucle
{
  bSeg1,
  bSeg2,
  bSeg3,
  bSeg4,
  bSeg5,
  bSeg6,
  bSeg7,
  bSeg8,
  bSeg9
};

void executerBoucles();

#endif