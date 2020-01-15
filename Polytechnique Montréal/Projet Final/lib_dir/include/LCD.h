/****************************************************************************
 * Fichier: LCD.h
 * Auteur: Melody Roy, Pier-Luc Tanguay, Aya Kamate et Calie Paulin
 * Date: 3 décembre 2019
 * Description: Déclaration des fonctions liées à l'écran LCD
 ****************************************************************************/

#ifndef LCD_H_INCLUDED
#define LCD_H_INCLUDED

#include "lcm_so1602dtr_m_fw.h"
#include "lcm_so1602dtr_m.h"
#include "customprocs.h"

// Définitions des fonctions

void afficherLCD(const char *affichage, LCM &ecran);

#endif