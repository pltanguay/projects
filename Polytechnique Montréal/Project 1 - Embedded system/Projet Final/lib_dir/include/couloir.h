/****************************************************************************
 * Fichier: couloir.h
 * Auteur: Melody Roy, Pier-Luc Tanguay, Aya Kamate et Calie Paulin
 * Date: 3 décembre 2019
 * Description: Déclaration des fonctions et des constantes liées à la section du couloir
 ****************************************************************************/

#include "capteurLigne.h"
#include "moteurs.h"

#ifndef COULOIR_H_INCLUDED
#define COULOIR_H_INCLUDED

enum Couloir
{
    debutCouloir,
    couloir
};

void executerCouloir();

#endif