/***********************************************************/
/* Fichier: main.cpp                                       */
/* Auteur: Mélody Roy (1991902), Pier-Luc Tanguay(1953707) */
/*Date: 18 novembre 2019                                   */
/*Description: DFonction "main" pour l'exécution des tests */
/***********************************************************/

// Librairies CppUnit nécessaires
#include <cppunit/ui/text/TestRunner.h>

// Fichiers contenant les tests
#include "testeur_rabais.h"

int main( int argc, char **argv)
{
    // Crée un objet pour exécuter les tests.
    // Va résenter les résultats sous forme textuelle.
    CppUnit::TextUi::TestRunner runner;

    // La classe RabaisTest contient des macros. 
    // Ces macros définissent une suite de tests.
    // Cela lui donne la méthode statique "suite" qui est appelée ici.
    // Cette méthode statique retourne des pointeurs vers les méthodes de tests.
    runner.addTest(RabaisTest::suite());

    // Exécute les tests et affiche les résultats.
    runner.run();

    return 0;
}