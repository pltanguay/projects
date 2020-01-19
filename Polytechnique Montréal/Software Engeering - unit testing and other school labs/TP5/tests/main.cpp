// Librairies CppUnit nécessaires
#include <cppunit/ui/text/TestRunner.h>

#include "Test.hpp"

int main(int argc, char** argv)
{
    // On crée un TestRunner qui va encadrer le roulement des tests, ainsi que
    // l'affichage des résultats de ceux-ci.
    CppUnit::TextUi::TestRunner runner;
    runner.addTest(Test::suite());
    runner.run();
    return 0;
}