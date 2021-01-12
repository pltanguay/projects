/****************************************************************************
 * Fichier: projet_final.cpp
 * Auteur: Melody Roy, Pier-Luc Tanguay, Aya Kamate et Calie Paulin
 * Date: 3 décembre 2019
 * Description: Programme qui permet de réaliser le circuit selon les exigences demandés
 ****************************************************************************/

#include "initialisation.h"

volatile bool boutonRondActive;
volatile bool boutonCarreActive;
volatile bool minuterieExpiree;

/*****************************************
 * Différents états du parcours          *
 *****************************************/
enum Etat
{
  etatCouloir,
  etatMur,
  etatBoucle,
  etatCoupure,
  etatCalibration
};

/***************************************************
 * Fonction: ISR pour interrupt1 (bouton carré)    *
 ***************************************************/
ISR(INT1_vect)
{
  _delay_ms(DELAI_ANTIREBOND); // Anti-rebond
  if (!(PIND & 0x08))          // Si bouton appuyé, boutonCarreActive devient vrai
  {
    boutonCarreActive = true;
  }
}

/***************************************************
 * Fonction: ISR pour interrupt0 (bouton rond)     *
 ***************************************************/
ISR(INT0_vect)
{
  _delay_ms(DELAI_ANTIREBOND); // Anti-rebond
  if (PIND & 0x04)             // Si bouton appuyé, boutonRondActive devient vrai
  {
    boutonRondActive = true;
  }
}

/***************************************************
 * Fonction: ISR pour timer2 (interrupt) SONAR     *
 ***************************************************/
ISR(TIMER2_COMPA_vect)
{
  minuterieExpiree = true;
}

/****************************************************************************
 * Fonction:	selection
 * Description: Permet de selctionner par quelle section du parcours on souhaite 
 *              commencer ou si l'on veut faire une calibration
 * Paramètres:- aucun
 * Retour:		- Etat: retourne l'etat correspondant à la section choisi
 ****************************************************************************/
Etat selection()
{
  Etat etatSelection = etatCouloir;
  LCM disp(&DDRC, &PORTC);
  afficherLCD("Le Couloir", disp);

  while (!boutonRondActive)
  {
    switch (etatSelection)
    {
    case etatCouloir:

      if (boutonCarreActive)
      {
        afficherLCD("Le Mur", disp);
        boutonCarreActive = false;
        etatSelection = etatMur;
      }
      break;

    case etatMur:

      if (boutonCarreActive)
      {
        afficherLCD("Les Deux Boucles", disp);
        boutonCarreActive = false;
        etatSelection = etatBoucle;
      }

      break;

    case etatBoucle:

      if (boutonCarreActive)
      {
        afficherLCD("Les Coupures", disp);
        boutonCarreActive = false;
        etatSelection = etatCoupure;
      }
      break;

    case etatCoupure:

      if (boutonCarreActive)
      {
        afficherLCD("CALIBRATION", disp);
        boutonCarreActive = false;
        etatSelection = etatCalibration;
      }
      break;

    case etatCalibration:

      if (boutonCarreActive)
      {
        afficherLCD("Le Couloir", disp);
        boutonCarreActive = false;
        etatSelection = etatCouloir;
      }
      break;
    }
  }
  boutonRondActive = false;
  _delay_ms(2000);

  pousseeDeDepart();

  return etatSelection;
}

/****************************************************************************
 * Fonction:	finSection
 * Description: permet de faire le virage lorsqu'on termine une section avec le bon délai
 * Paramètres:- aucun
 * Retour:		- aucun
 ****************************************************************************/
void finSection()
{
  _delay_ms(700);
  virageGauche();
}

/****************************************************************************
 * Fonction:	main
 * Description: exécuter le programme principal
 * Paramètres:- aucun
 * Retour:		- aucun
 ****************************************************************************/
int main()
{

  initialisationGlobale();

  LCM disp(&DDRC, &PORTC);

  // Permet de refaire le parcours un nombre illimité de fois
  for (;;)
  {
    int compteurSection = 0;

    // Choix du segment de départ
    Etat etatChoisi = selection();

    // On passe à travers le parcours
    while (compteurSection != 4)
    {
      switch (etatChoisi)
      {
      case etatCouloir:

        afficherLCD("Le Couloir", disp);

        executerCouloir();

        compteurSection++;
        finSection();

        etatChoisi = etatMur;

        break;

      case etatMur:

        afficherLCD("Le Mur", disp);

        executerMur();

        compteurSection++;
        finSection();

        etatChoisi = etatBoucle;

        break;

      case etatBoucle:
        afficherLCD("Les Deux Boucles", disp);
        executerBoucles();

        compteurSection++;
        finSection();

        etatChoisi = etatCoupure;

        break;

      case etatCoupure:

        afficherLCD("Les Coupures", disp);

        executerCoupures();

        compteurSection++;
        finSection();

        etatChoisi = etatCouloir;

        break;

      case etatCalibration:

        afficherLCD("CALIBRATION", disp);
        executerCalibration();
        boutonCarreActive = false;
        boutonRondActive = false;
        etatChoisi = selection();

        break;
      }
    }

    arreterMoteur();
    sonFin();
    afficherLCD("Fin du parcours", disp);
    
    for (int i = 0; i < 15; i++)
    {
      _delay_ms(1000);
    }
  }
  return 0;
}
