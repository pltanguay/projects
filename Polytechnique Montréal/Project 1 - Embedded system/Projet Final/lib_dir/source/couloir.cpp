/****************************************************************************
 * Fichier: couloir.cpp
 * Auteur: Melody Roy, Pier-Luc Tanguay, Aya Kamate et Calie Paulin
 * Date: 3 décembre 2019
 * Description: Fonction propre à la section du couloir
 ****************************************************************************/

#include "couloir.h"

/****************************************************************************
 * Fonction:	executerCouloir
 * Description: Executer la section du couloir
 * Paramètres:	- aucun
 * Retour:		- aucun
 ****************************************************************************/
void executerCouloir()
{

  int compteurDistanceGauche = 0;
  double distanceEntreLignesGauche = 0;

  int compteurDistanceDroit = 0;
  double distanceEntreLignesDroit = 0;

  uint8_t nbRebond = 0;
  bool finCouloir = false;

  bool ligneDroite = false;
  bool ligneGauche = false;

  Couloir positionCouloir = debutCouloir;

  while (!finCouloir)
  {
    switch (positionCouloir)
    {

    case debutCouloir:
      suivreLigneNoir();
      if (detecteSurfaceBlanche())
      {
        rotationCouloir(false);
        ligneGauche = true;
        positionCouloir = couloir;
      }
      break;

    case couloir:
      if (ligneDroite)
      {
        compteurDistanceDroit = rotationCouloir(false);
        nbRebond++;

        ligneDroite = false;
        ligneGauche = true;

        // On prend la mesure de la distance entre les deux ligne
        // Seulement au premier trajet entre les deux lignes
        if (nbRebond == 2)
          distanceEntreLignesDroit = compteurDistanceDroit;

        // Si le capteur gauche est activé, mais la distance est beaucoup plus petite
        // que la distance entre les deux grandes lignes, on sort du couloir.
        if (compteurDistanceDroit < 0.65 * distanceEntreLignesDroit)
        {
          finCouloir = true;
        }
      }

      else if (ligneGauche)
      {
        compteurDistanceGauche = rotationCouloir(true);
        nbRebond++;

        // On prend la mesure de la distance entre les deux ligne à la sortie
        // Seulement au premier trajet entre les deux lignes
        if (nbRebond == 1)
          distanceEntreLignesGauche = compteurDistanceGauche;

        ligneDroite = true;
        ligneGauche = false;

        // Si le capteur droit est activé, mais la distance est beaucoup plus petite
        // que la distance entre les deux grandes lignes, on sort du couloir.
        if (compteurDistanceGauche < 0.65 * distanceEntreLignesGauche)
        {
          finCouloir = true;
        }
      }

      break;
    }
  }
  _delay_ms(100);
  while (detecteLigneNoire())
  {
    suivreLigneNoir();
  }
}