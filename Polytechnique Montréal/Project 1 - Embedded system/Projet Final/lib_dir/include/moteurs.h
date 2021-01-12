/****************************************************************************
 * Fichier: moteurs.h
 * Auteur: Melody Roy, Pier-Luc Tanguay, Aya Kamate et Calie Paulin
 * Date: 3 décembre 2019
 * Description: Déclaration des fonctions et des constantes liées aux moteurs
 ****************************************************************************/

#ifndef MOTEURS_H_INCLUDED
#define MOTEURS_H_INCLUDED

#include <util/delay.h>
#include <avr/io.h>
#include <avr/interrupt.h>
#include <stdlib.h>
#include "son.h"
#include "UART.h"
#include "capteurLigne.h"
#include "calibration.h"

// Constantes

const uint8_t LED_ETEINT = 0x00, LED_ROUGE = 0x02, LED_VERT = 0x01;
const uint8_t PUISSANCE_TOURNER = 150;
const uint8_t AJUSTEMENT_MOTEURS = 8;
const uint8_t AJUSTEMENT_VIRAGE = 35;
const uint8_t VITESSE_MOTEUR_MUR = 87;

extern int ajusteBatterie;

const int DELAI_QUART_SEC = 250;
const int DELAI_DEMI_SEC = 500;
const int DELAI_TOURNER = 850;
const int DELAI_1_SEC = 1000;
const int DELAI_2_SEC = 2000;
const int DELAI_ANTIREBOND = 30;

extern volatile bool boutonCarreActive;
extern volatile bool boutonRondActive;

// Définitions des fonctions

void arreterMoteur();
void pousseeDeDepart();
void ajustementPWM(uint8_t operandeMoteurGauche, uint8_t operandeMoteurDroite,
                   bool avanceGauche, bool avanceDroit);
void avancerLigneDroite(bool avancer, uint8_t vitesseMoteur);
void ajustementMur(bool tournerDroite);
void suivreLigneNoir();
int rotationCouloir(bool tournerDroit);
void virageGauche();
void virageDroite();

#endif