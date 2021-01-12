/****************************************************************************
 * Fichier: moteurs.cpp
 * Auteur: Melody Roy, Pier-Luc Tanguay, Aya Kamate et Calie Paulin
 * Date: 3 décembre 2019
 * Description: Fonctions liées aux mouvements du robot
 ****************************************************************************/

#include "moteurs.h"

/****************************************************************************
 * Fonction:	arreterMoteur
 * Description: Immobilise le robot
 * Paramètres:  - aucun
 * Retour:		  - aucun
 ****************************************************************************/
void arreterMoteur()
{
  ajustementPWM(0, 0, false, false);
}

/****************************************************************************
 * Fonction:	pousseeDeDepart
 * Description: Permet aux moteurs de donner une brève impulsion pour bien démarrer  
 * Paramètres:  - aucun
 * Retour:		  - aucun
 ****************************************************************************/
void pousseeDeDepart()
{
  ajustementPWM(200, 210, true, true);
  _delay_ms(100);
}

/****************************************************************************
 * Fonction:	ajustementPWM
 * Description: Prend en paramètre la puissance des moteurs en decimal 
 *              (sur 8bits) et les directions selon la tâche voulu    
 * Paramètres:  - uint8_t operandeMoteurGauche: puissance du moteur Gauche
 *              - uint8_t operandeMoteurDroite: puissance du moteur Droit
 *              - bool avanceGauche: vrai si la roue Gauche avance, faux si elle recule
 *              - bool avanceDroit: vrai si la roue Droite avance, faux si elle recule
 * Retour:		  - aucun
 ****************************************************************************/
void ajustementPWM(uint8_t operandeMoteurGauche, uint8_t operandeMoteurDroite,
                   bool avanceGauche, bool avanceDroit)
{

  //Ajustement de PORTD pour avancer et reculer les moteurs selon les 'bool' affectés
  if (avanceGauche && avanceDroit)
    PORTD &= 0x3F; // PD7=PD8=0   Les deux moteurs avancent
  else if (!avanceGauche && avanceDroit)
  {
    PORTD |= 0x40; // PD7=1  Gauche: recule
    PORTD &= 0x7F; // PD8=0  Droit: avance
  }
  else if (avanceGauche && !avanceDroit)
  {
    PORTD &= 0xBF; // PD7=0  Gauche: avance
    PORTD |= 0x80; // PD8=1  Droit: recule
  }
  else if (!avanceGauche && !avanceDroit)
    PORTD |= 0xC0; // PD4=PD3=1 Les deux moteurs reculent

  // Hauteurs comparaison PWM
  OCR1A = operandeMoteurDroite;
  OCR1B = operandeMoteurGauche;

  // division d'horloge par 8 - implique une frequence de PWM fixe
  TCCR1A =
      (1 << WGM10) |
      (1 << COM1A1) |
      (1 << COM1B1);

  TCCR1B = (1 << CS11);

  TCCR1C = 0;
}

/****************************************************************************
 * Fonction:	avancerLigneDroite
 * Description: Permet au robot d'avancer en ligne droite.
 * Paramètres:  - bool avancer: vrai pour avancer, faux pour reculer 
 *              - uint8_t vitesseMoteur: vitesse du robot
 * Retour:		  - aucun
 ****************************************************************************/
void avancerLigneDroite(bool avancer, uint8_t vitesseMoteur)
{
  uint8_t vitMoteurDroit = vitesseMoteur;
  uint8_t vitMoteurGauche = vitesseMoteur;

  // Variable d'ajustement, puisqu'on remarque que le moteur gauche est plus faible au démarrage

  if (vitMoteurDroit < (255 - AJUSTEMENT_MOTEURS))
    vitMoteurGauche = vitMoteurDroit + AJUSTEMENT_MOTEURS;

  // Ajustement du PWM en prenant en compte la nouvelle valeur ajustée
  ajustementPWM(vitMoteurGauche + ajusteBatterie, vitMoteurDroit + ajusteBatterie, avancer, avancer);
}

/****************************************************************************
 * Fonction:	ajustementMur
 * Description: Permet au robot d'avancer en ligne droite.
 * Paramètres:  - bool tournerDroite: vrai si on doit s'éloigner du mur 
 *                (tourner à droite), faux si on doit s'en rapproché (tourner à gauche)
 * Retour:		  - aucun
 ****************************************************************************/
void ajustementMur(bool tournerDroite)
{
  uint8_t vitMoteurDroit = 93;
  uint8_t vitMoteurGauche = 87;

  if (tournerDroite)
    vitMoteurDroit -= AJUSTEMENT_VIRAGE;
  else
    vitMoteurGauche -= AJUSTEMENT_VIRAGE;

  // Ajustement du PWM en prenant en compte la nouvelle valeur selon la direction
  // pendant 300 ms et retourner à l'état que nous avançons tout droit
  ajustementPWM(vitMoteurGauche + ajusteBatterie, vitMoteurDroit + ajusteBatterie, true, true);
  _delay_ms(300);
  avancerLigneDroite(true, VITESSE_MOTEUR_MUR);
}

/****************************************************************************
 * Fonction:	suivreLigneNoir
 * Description: Permet au robot de suivre une ligne noire. Réalisé en analysant 
 *              tous les cas possibles et en ajustant les moteurs selon les observations
 * Paramètres:  - aucun
 * Retour:		  - aucun
 ****************************************************************************/
void suivreLigneNoir()
{
  if (detecteLigneNoire())
  {

    if (capteurGauche &&
        capteurMilieuGauche &&
        capteurMilieu &&
        capteurMilieuDroit &&
        capteurDroit)
    {
      avancerLigneDroite(true, 95);
    }

    if (!capteurGauche &&
        !capteurMilieuGauche &&
        capteurMilieu &&
        !capteurMilieuDroit &&
        !capteurDroit)
    {
      avancerLigneDroite(true, 95);
    }

    if (!capteurGauche &&
        capteurMilieuGauche &&
        capteurMilieu &&
        capteurMilieuDroit &&
        !capteurDroit)
    {
      avancerLigneDroite(true, 95);
    }

    if (!capteurGauche &&
        capteurMilieuGauche &&
        capteurMilieu &&
        !capteurMilieuDroit &&
        !capteurDroit)
    {
      ajustementPWM(62 + ajusteBatterie, 95 + ajusteBatterie, true, true);
    }

    if (!capteurGauche &&
        !capteurMilieuGauche &&
        capteurMilieu &&
        capteurMilieuDroit &&
        !capteurDroit)
    {
      ajustementPWM(95 + ajusteBatterie, 62 + ajusteBatterie, true, true);
    }

    if (!capteurGauche &&
        !capteurMilieuGauche &&
        capteurMilieu &&
        capteurMilieuDroit &&
        capteurDroit)
    {
      ajustementPWM(95 + ajusteBatterie, 62 + ajusteBatterie, true, true);
    }

    if (capteurGauche &&
        capteurMilieuGauche &&
        capteurMilieu &&
        !capteurMilieuDroit &&
        !capteurDroit)
    {
      ajustementPWM(57 + ajusteBatterie, 95 + ajusteBatterie, true, true);
    }

    if (capteurGauche &&
        capteurMilieuGauche &&
        !capteurMilieu &&
        !capteurMilieuDroit &&
        !capteurDroit)
    {
      ajustementPWM(57 + ajusteBatterie, 95 + ajusteBatterie, true, true);
    }

    if (!capteurGauche &&
        !capteurMilieuGauche &&
        !capteurMilieu &&
        capteurMilieuDroit &&
        capteurDroit)
    {
      ajustementPWM(95 + ajusteBatterie, 62 + ajusteBatterie, true, true);
    }

    if (capteurGauche &&
        !capteurMilieuGauche &&
        !capteurMilieu &&
        !capteurMilieuDroit &&
        !capteurDroit)
    {
      ajustementPWM(20 + ajusteBatterie, 95 + ajusteBatterie, true, true);
    }

    if (!capteurGauche &&
        !capteurMilieuGauche &&
        !capteurMilieu &&
        !capteurMilieuDroit &&
        capteurDroit)
    {
      ajustementPWM(95 + ajusteBatterie, 20 + ajusteBatterie, true, true);
    }

    if (!capteurGauche &&
        capteurMilieuGauche &&
        capteurMilieu &&
        capteurMilieuDroit &&
        capteurDroit)
    {
      ajustementPWM(57 + ajusteBatterie, 95 + ajusteBatterie, true, true);
    }

    if (capteurGauche &&
        capteurMilieuGauche &&
        capteurMilieu &&
        capteurMilieuDroit &&
        !capteurDroit)
    {
      ajustementPWM(95 + ajusteBatterie, 62 + ajusteBatterie, true, true);
    }
  }
}

/****************************************************************************
 * Fonction:	rotationCouloir
 * Description: Rotation spécifique à la section couloir: pivot sec au début,
 *              puis virage fluide 
 * Paramètres:  - bool tournerDroit: vrai si on veut tourner à droite, faux à gauche
 * Retour:		  - aucun
 ****************************************************************************/
int rotationCouloir(bool tournerDroit)
{
  int compteurDistance = 0;
  if (!tournerDroit)
  {
    ajustementPWM(0, 150 + ajusteBatterie, true, true);
    while (capteurMilieuDroit || capteurDroit)
    {
    }

    ajustementPWM(150 + ajusteBatterie, 100 + ajusteBatterie, true, true);
    _delay_ms(100);

    while (detecteSurfaceBlanche())
    {
      ajustementPWM(45 + ajusteBatterie, 100 + ajusteBatterie, true, true);
      compteurDistance++;
      _delay_ms(50);
    }
  }

  if (tournerDroit)
  {
    ajustementPWM(160 + ajusteBatterie, 0, true, true);
    while (capteurMilieuGauche || capteurGauche)
    {
    }

    ajustementPWM(95 + ajusteBatterie, 150 + ajusteBatterie, true, true);
    _delay_ms(100);

    while (detecteSurfaceBlanche())
    {
      ajustementPWM(95 + ajusteBatterie, 45 + ajusteBatterie, true, true);
      compteurDistance++;
      _delay_ms(50);
    }
  }

  return compteurDistance;
}

/****************************************************************************
 * Fonction:	virageGauche
 * Description: Rotation vers la gauche où la roue gauche est un pivot jusqua'à
 *              ce que le capteur du milieu capte la ligne noire
 * Paramètres:  - aucun
 * Retour:		  - aucun
 ****************************************************************************/
void virageGauche()
{
  while (!capteurMilieu)
  {
    ajustementPWM(0, 95 + ajusteBatterie, true, true);
  }
  ajustementPWM(130 + ajusteBatterie, 95 + ajusteBatterie, true, true);
  _delay_ms(100);
}

/****************************************************************************
 * Fonction:	virageDroite
 * Description: Rotation vers la droite où la roue droite est un pivot jusqua'à
 *              ce que le capteur du milieu capte la ligne noire
 * Paramètres:  - aucun
 * Retour:		  - aucun
 ****************************************************************************/
void virageDroite()
{

  while (!capteurMilieu)
  {
    ajustementPWM(90 + ajusteBatterie, 0 , true, true);
  }
  ajustementPWM(90 + ajusteBatterie, 130 + ajusteBatterie, true, true);
  _delay_ms(100);
}