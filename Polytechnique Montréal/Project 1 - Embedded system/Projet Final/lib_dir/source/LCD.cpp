/****************************************************************************
 * Fichier: LCD.cpp
 * Auteur: Melody Roy, Pier-Luc Tanguay, Aya Kamate et Calie Paulin
 * Date: 3 décembre 2019
 * Description: Fonction propre à l'écran LCD
 ****************************************************************************/

#include "LCD.h"

/****************************************************************************
 * Fonction:	afficherLCD
 * Description: Nettoie l'écran LCD et affiche la chaîne de caractère entrée 
 *              en paramètre 
 * Paramètres:	- const char *affichage: le texte à afficher
 *              - LCM &ecran: un objet qui nous permet d'accéder aux fonctions 
 *                liées à l'écran LCD
 * Retour:		- aucun
 ****************************************************************************/
void afficherLCD(const char *affichage, LCM &ecran)
{
    ecran.clear();
    ecran << affichage;
}