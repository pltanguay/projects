/***********************************************************/
/* Fichier: testeur_rabais.h                               */
/* Auteur: Mélody Roy (1991902), Pier-Luc Tanguay(1953707) */
/*Date: 18 novembre 2019                                   */
/*Description: Définition de la classe RabaisTest          */
/***********************************************************/

// Librairies CppUnit nécessaires.
#include <cppunit/TestCase.h>
#include <cppunit/TestFixture.h>
#include <cppunit/extensions/HelperMacros.h>

// Le fichier à tester
#include "../../src/rabais.h"

class RabaisTest : public CppUnit::TestFixture
{
    CPPUNIT_TEST_SUITE(RabaisTest);
    CPPUNIT_TEST(test_getrabais_employe);
    CPPUNIT_TEST(test_getrabais_55ansPlus);
    CPPUNIT_TEST(test_getrabais_zoneH1C);
    CPPUNIT_TEST(test_getrabais_zoneH3P);
    CPPUNIT_TEST(test_getrabais_zoneJ40);
    CPPUNIT_TEST(test_getrabais_adhesion);
    CPPUNIT_TEST(test_getrabais_adhesionMax);
    CPPUNIT_TEST(test_getrabais_facture);
    CPPUNIT_TEST(test_getrabais_factureMax);
    CPPUNIT_TEST_SUITE_END();
    
private:
	Rabais* objet_a_tester;
    
public:
	// Fonctions d'échafaudage
    void setUp();
    void tearDown();
    
    // Fonctions de tests
    void test_getrabais_employe(); //SRS01 - SRS02 - SRS03
    void test_getrabais_55ansPlus(); //SRS04
    void test_getrabais_zoneH1C(); //SRS05
    void test_getrabais_zoneH3P(); //SRS05
    void test_getrabais_zoneJ40(); //SRS05
    void test_getrabais_adhesion(); //SRS06
    void test_getrabais_adhesionMax(); //SRS07
    void test_getrabais_facture(); //SRS08
    void test_getrabais_factureMax(); //SRS09
};
