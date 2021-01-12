#define F_CPU 8000000
#include <fonctionsCommunes.h>



////////////////////////////////////////////////////////////////////////////////////////
// TP2
// Debounce bouton appuyé
////////////////////////////////////////////////////////////////////////////////////////

bool boutonAppuye()
{
  if (PIND & 0x04)
  {
    _delay_ms(DELAI_DEBOUNCE);
    if (PIND & 0x04)
      return true;
    else 
      return false;
  }
  else
    return false;
}

////////////////////////////////////////////////////////////////////////////////////////
// TP2-PB2
// Couleur Ambree
////////////////////////////////////////////////////////////////////////////////////////
void couleurAmbre()
{
  PORTB = LED_VERT;
  _delay_ms(DELAI_AMBRE_VERT);
  PORTB = LED_ROUGE;
  _delay_ms(DELAI_AMBRE_ROUGE);
}

void attenuerDEL(const unsigned long couleur, double dureeSeconde)
{

  for (int i = 0; i < (dureeSeconde * 1000); i++)
  {
    int increment = 2 * i / dureeSeconde;

    if (increment == 0)
      increment = 1;

    PORTB = couleur;
    _delay_loop_2(2000 - increment);
    PORTB = LED_ETEINT;
    _delay_loop_2(increment);
  }
}

////////////////////////////////////////////////////////////////////////////////////////
// TP3-PB2
// PWM logiciel
////////////////////////////////////////////////////////////////////////////////////////

void pwmLogiciel(double pourcentage, double frequence, double dureeSeconde)
{

  double ratioFrequence = 2000000 / frequence;
  double ratio = 2000000 / ratioFrequence * dureeSeconde;

  if (pourcentage == 0)
  {
    PORTB = 0;
    _delay_ms(2000);
  }
  else if (pourcentage == 1)
  {
    PORTB = LED_VERT;
    _delay_ms(2000);
  }
  else
  {
    for (int i = 0; i < ratio; i++)
    {
      PORTB = LED_VERT;
      _delay_loop_2(pourcentage * ratioFrequence);
      PORTB = LED_ETEINT;
      _delay_loop_2((1 - pourcentage) * ratioFrequence);
    }
  }
}

////////////////////////////////////////////////////////////////////////////////////////
// TP4-PB3
// PWM matériel, on entre en paramètre un % entre 0 et 1.
////////////////////////////////////////////////////////////////////////////////////////

void ajustementPWM(double pourcentage)
{

  OCR1A = pourcentage * HUIT_BIT_MAX; // pourcentage droit

  OCR1B = pourcentage * HUIT_BIT_MAX; //pourcentage gauche

  // division d'horloge par 8 - implique une frequence de PWM fixe // ICRn or OCRnA

  TCCR1A =
      (1 << WGM10) |  // PWM, Phase Correct, 8-bit
      (1 << COM1A1) | // Set OCnA/OCnB on Compare Match when up-counting. Clear OCnA/OCnB on Compare Match when downcounting.
      (1 << COM1B1);

  TCCR1B = (1 << CS11); // Horloge par 8

  TCCR1C = 0;
}

////////////////////////////////////////////////////////////////////////////////////////
// TP6-PB1
// Clignotement de deux couleur, selon la duree
////////////////////////////////////////////////////////////////////////////////////////

void clignoter2Couleur(uint8_t couleur1, uint8_t couleur2, uint8_t nbFois) // la lumiere pour duree = nbre de secondes/4
{
  for (uint8_t i = 0; i > nbFois; i++)
  {
    PORTB = couleur1;
    _delay_ms(DUREE_CLIGNOTEMENT);
    PORTB = couleur2;
    _delay_ms(DUREE_CLIGNOTEMENT);
  }
}

////////////////////////////////////////////////////////////////////////////////////////
// TP6-PB2
// Convertisseur Analogique-Numérique
////////////////////////////////////////////////////////////////////////////////////////
void changementDeLumiere(uint8_t voltageNiveau1, uint8_t voltageNiveau2,
                         uint8_t positionBrocheA, int8_t couleurDelNiveau1,
                         int8_t couleurDelNiveau2, int8_t voltageMaxTheorique,
                         can convertisseurAnaNum)
{
  uint8_t valeurMin = (voltageNiveau1 * HUIT_BIT_MAX) / voltageMaxTheorique;
  uint8_t valeurMax = (voltageNiveau2 * HUIT_BIT_MAX) / voltageMaxTheorique;
  for (;;) // boucle sans fin
  {

    uint8_t lecture = (convertisseurAnaNum.lecture(positionBrocheA)) >> 2;
    if (lecture < valeurMin)
      PORTB = couleurDelNiveau1;
    else if ((lecture > valeurMin) && (lecture < valeurMax))
      couleurAmbre();
    else
      PORTB = couleurDelNiveau2;
  }
}
