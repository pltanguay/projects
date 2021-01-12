/****************************************************************************
 * Fichier: son.cpp
 * Auteur: Melody Roy, Pier-Luc Tanguay, Aya Kamate et Calie Paulin
 * Date: 3 décembre 2019
 * Description: Fonctions liées au piezzo
 ****************************************************************************/

#include "son.h"

/*****************************************
 * Taleau de Frequences pour le son      
 *****************************************/
double tableauFrequenceNote[37] = {
    110.0, 116.5409404, 123.4708253, 130.8127827, 138.5913155,
    146.832384, 155.5634919, 164.8137785, 174.6141157, 184.9972114, 195.997718, 207.6523488,
    220.0, 233.0818808, 246.9416506, 261.6255653, 277.182631, 293.6647679, 311.1269837, 329.6275569,
    349.2282314, 369.9944227, 391.995436, 415.3046976, 440.0, 466.1637615, 493.8833013, 523.2511306,
    554.365262, 587.3295358, 622.2539674, 659.2551138, 698.4564629, 739.9888454, 783.990872,
    830.6093952, 880.0};

/****************************************************************************
 * Fonction:	arreterSon
 * Description: coupe le son du piezzo
 * Paramètres:  - aucun
 * Retour:	    - aucun
 ****************************************************************************/
void arreterSon()
{
    TCCR0B = 0;
}

/****************************************************************************
 * Fonction:	genererSon
 * Description: produit un son selon la note donnée
 * Paramètres:  - uint8_t note: la note a produire, une note à l'extérieur de 
 *                l'intervalle [NOTE_MIN, NOTE_MAX] ne produira pas de son
 * Retour:		- aucun
 ****************************************************************************/
void genererSon(uint8_t note)
{

    // Division d'horloge par 256
    // Registre qui prend un chiffre sur 8 bits
    // OCR0A = F_CPU / (frequence * 1024); // voir p.144 pour details calcul
    OCR0A = (F_CPU / (2 * 256 * tableauFrequenceNote[note - 45])) - 1;
    TCNT0 = 0;

    // BITS 1:0 waveform generation mode bit description : on veut le CTC mode, donc
    // BITS 5:4 COM0B1:0 Compare output mode, phase correct PWM mode
    // clear OC0B on Compare Match when up-counting. Set OC0B on Compare Match when down-counting.
    TCCR0A |= (1 << COM0A0) | (1 << COM0B1) | (1 << WGM01);

    // BITS 2:0, utilisation d un prescaler de 256
    TCCR0B |= (1 << CS02);

    if (note < NOTE_MIN || note > NOTE_MAX) // Arrete le son si hors-cible
        arreterSon();
    else
        TCCR0B |= (1 << CS02);
}

/****************************************************************************
 * Fonction:	sonValidation
 * Description: Signal déterminant que la calibration est terminée
 * Paramètres:	- aucun
 * Retour:		- aucun
 ****************************************************************************/
void sonValidation()
{
    PORTB = 0x01;
    genererSon(65);
    _delay_ms(250);
    genererSon(60);
    _delay_ms(250);
    genererSon(55);
    _delay_ms(250);
    arreterSon();
    PORTB = 0x00;
}

/****************************************************************************
 * Fonction:	sonFin
 * Description: Signal déterminant que le parcours est terminé
 * Paramètres:	- aucun
 * Retour:		- aucun
 ****************************************************************************/
void sonFin()
{
    genererSon(55); 
    _delay_ms(250);
    genererSon(60);
    _delay_ms(250);
    genererSon(65);
    _delay_ms(250);
    arreterSon();
}