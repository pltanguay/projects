/****************************************************************************
 * Fichier: coupures.cpp
 * Auteur: Melody Roy, Pier-Luc Tanguay, Aya Kamate et Calie Paulin
 * Date: 3 décembre 2019
 * Description: Fonction propre à la section des cooupures
 ****************************************************************************/

#include "coupures.h"

/****************************************************************************
 * Fonction:	executerCoupures
 * Description: Executer la section des coupures
 * Paramètres:	- aucun
 * Retour:		- aucun
 ****************************************************************************/
void executerCoupures()
{
  Segment segmentCourant = segTV;
  bool finCoupure = false;

  while (!finCoupure)
  {
    switch (segmentCourant)
    {
    case segTV:
      suivreLigneNoir();
      if (detecteSurfaceBlanche())
      {
        segmentCourant = segVW;
      }
      break;

    case segVW:
      genererSon(81);
      virageDroite();
      segmentCourant = segWY;
      break;

    case segWY:
      arreterSon();
      suivreLigneNoir();
      if (detecteSurfaceBlanche())
      {
        segmentCourant = segYZ;
      }
      break;

    case segYZ:
      genererSon(45);
      virageGauche();
      segmentCourant = segZ2;
      break;

    case segZ2:
      arreterSon();
      suivreLigneNoir();
      if (detecteSurfaceBlanche())
      {
        segmentCourant = seg23;
      }
      break;

    case seg23:
      genererSon(81);
      virageDroite();
      segmentCourant = seg35;
      break;

    case seg35:
      arreterSon();
      suivreLigneNoir();
      if (detecteSurfaceBlanche())
      {
        segmentCourant = seg56;
      }
      break;

    case seg56:
      genererSon(45);
      virageGauche();
      segmentCourant = seg6A;
      break;

    case seg6A:
      arreterSon();
      suivreLigneNoir();
      if (detecteSurfaceBlanche())
      {
        finCoupure = true;
      }
      break;
    }
  }
}
