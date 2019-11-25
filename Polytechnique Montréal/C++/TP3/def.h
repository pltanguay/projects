/*
 * Date : 1 Septembre 2019
 * Auteur : Wassim Khene
 */
#ifndef DEF_H
#define DEF_H

enum class TarifBillet {Economie, PremiumEconomie, Affaire, Premiere};
const int CAPACITE_INITIALE = 2;
const unsigned int JOUR_RESTANT_INITIALE = 30;
const unsigned int NB_UTILISATIONS_INITIALE = 10;

const double RABAIS_MAXIMUM = 0.2;
const unsigned int POINTS_MAXIMUM = 20000;
const unsigned int TRANCHE_RABAIS = 1000;
const double POURCENTAGE = 0.01;

const double REDUCTION_BASE = 0.005;
const double REDUCTION_MAXIMUM = 0.10;

#endif