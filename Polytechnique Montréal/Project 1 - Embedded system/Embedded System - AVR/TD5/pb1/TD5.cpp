

#define F_CPU 8000000
#include <avr/io.h>
#include <util/delay.h>
#include <avr/interrupt.h>
#include "memoire_24.h"
#include <string.h>


int main()
{

DDRB = 0xff;

char chaineEcrite[] = "*P*O*L*Y*T*E*C*H*N*I*Q*U*E* *M*O*N*T*R*E*A*L*"; 



char chaineLu[strlen(chaineEcrite)+1];

Memoire24CXXX memoire = Memoire24CXXX();

memoire.ecriture(0x00, (uint8_t*) chaineEcrite, strlen(chaineEcrite));

memoire.ecriture(strlen(chaineEcrite), 0);

memoire.lecture(0x00, (uint8_t*) &chaineLu, strlen(chaineLu));

bool resultat=true;
for(unsigned int i=0 ; i<strlen(chaineEcrite); i++)
{
	if(chaineLu[i]!=chaineEcrite[i])
		resultat = false;
}
if (chaineLu[strlen(chaineEcrite)]!= 0)
	resultat = false;

if(resultat)
{
	PORTB = 0x01;
}
else
{
	PORTB = 0x02;
}
	return 0;
}