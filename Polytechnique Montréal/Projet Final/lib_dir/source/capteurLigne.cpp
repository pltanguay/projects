/****************************************************************************
 * Fichier: capteurLigne.cpp
 * Auteur: Melody Roy, Pier-Luc Tanguay, Aya Kamate et Calie Paulin
 * Date: 3 décembre 2019
 * Description: Fonctions relatives au capteur de ligne
 ****************************************************************************/

#include "capteurLigne.h"


/****************************************************************************
 * Fonction:	detecteSurfaceBlanche
 * Description: Détermine si une surface est complètement blanche
 * Paramètres:	- aucun
 * Retour:		- bool: vrai si la surface est blanche
 ****************************************************************************/
bool detecteSurfaceBlanche()
{

  if (!(capteurGauche) && !(capteurMilieuGauche) && !(capteurMilieu) && !(capteurMilieuDroit) && !(capteurDroit))
  {
    return true;
  }
  return false;
}

/****************************************************************************
 * Fonction:	detecteSurfaceNoire
 * Description: Détermine si une surface est complètement noire
 * Paramètres:	- aucun
 * Retour:		- bool: vrai si la surface est noire
 ****************************************************************************/
bool detecteSurfaceNoire()
{

  if (capteurGauche && capteurMilieuGauche && capteurMilieu && capteurMilieuDroit && capteurDroit)
  {
    return true;
  }
  return false;
}

/****************************************************************************
 * Fonction:	detecteLigneNoire
 * Description: Détermine si un des capteurs détecte une suraface noire
 * Paramètres:	- aucun
 * Retour:		- bool: vrai si il y a un point noir
 ****************************************************************************/
bool detecteLigneNoire()
{
  if ((capteurGauche) || (capteurMilieuGauche) || (capteurMilieu) || (capteurMilieuDroit) || (capteurDroit))
  {
    return true;
  }
  return false;
}

/****************************************************************************
 * Fonction:	lireCoin
 * Description: Détermine si les deux capteurs de gauche détectent du noir
 * Paramètres:	- aucun
 * Retour:		- bool: vrai si il y a un coin vers la gauche
 ****************************************************************************/
bool lireCoin()
{
  bool coin = false;
  if (capteurGauche && capteurMilieuGauche)
  {
    coin = true;
  }
  return coin;
}
