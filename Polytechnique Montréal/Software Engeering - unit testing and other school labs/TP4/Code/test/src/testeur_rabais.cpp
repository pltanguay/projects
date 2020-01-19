/***********************************************************/
/* Fichier: testeur_rabais.cpp                             */
/* Auteur: Mélody Roy (1991902), Pier-Luc Tanguay(1953707) */
/*Date: 18 novembre 2019                                   */
/*Description: Implémentation de la classe RabaisTest      */
/***********************************************************/

#include "testeur_rabais.h"

void RabaisTest::setUp() {
		this->objet_a_tester = new Rabais();
}

void RabaisTest::tearDown() {
		delete this->objet_a_tester;
}

void RabaisTest::test_getrabais_employe(){

	// Paramètres essentiels au cas de tests:
	int identifiant = 25001;   // Un identifiant supérieur a 25000 représente un employé
	int age = 60;			   // Un employe de plus de 55 ans ne peut obtenir le rabais additionnel de 10%

	// Autres paramètres:
	std::string zone = "T3S";
	tm dateAdhesion; 
	dateAdhesion.tm_year = 2019;

	// Ajoute le client correspondant au cas à tester
	this->objet_a_tester->ajouterClient(new Client(identifiant, "Honnete", "Etudiant", age, zone , dateAdhesion));
	
	// Obtient le rabais a tester
	Facture facture;
	double rabais_a_tester = this->objet_a_tester->getRabais(facture, identifiant);
	
	// Effectue le test en tolérant une marge d'erreur de 0.001
	CPPUNIT_ASSERT_DOUBLES_EQUAL(0.15, rabais_a_tester, 0.001);
} 

void RabaisTest::test_getrabais_55ansPlus(){

	// Paramètres essentiels au cas de tests:
	int age = 60; // Un client de plus de 55 ans

	// Autres paramètres:
	int identifiant = 55;  
	std::string zone = "T3S";
	tm dateAdhesion; 
	dateAdhesion.tm_year = 2019;

	// Ajoute le client correspondant au cas à tester
	this->objet_a_tester->ajouterClient(new Client(identifiant, "Honnete", "Etudiant", age, zone , dateAdhesion));
	
	// Obtient le rabais a tester
	Facture facture;
	double rabais_a_tester = this->objet_a_tester->getRabais(facture, identifiant);
	
	// Effectue le test en tolérant une marge d'erreur de 0.01
	CPPUNIT_ASSERT_DOUBLES_EQUAL(0.1, rabais_a_tester, 0.01);
} 

void RabaisTest::test_getrabais_zoneH1C(){

	// Paramètres essentiels au cas de tests:
	std::string zone = "H1C";// Un client dans la zone cible

	// Autres paramètres:
	int identifiant = 800;  
	int age = 25; 
	tm dateAdhesion; 
	dateAdhesion.tm_year = 2019;

	// Ajoute le client correspondant au cas à tester
	this->objet_a_tester->ajouterClient(new Client(identifiant, "Honnete", "Etudiant", age, zone , dateAdhesion));
	
	// Obtient le rabais a tester
	Facture facture;
	double rabais_a_tester = this->objet_a_tester->getRabais(facture, identifiant);
	
	// Effectue le test en tolérant une marge d'erreur de 0.01
	CPPUNIT_ASSERT_DOUBLES_EQUAL(0.04, rabais_a_tester, 0.001);
} 

void RabaisTest::test_getrabais_zoneH3P(){

	// Paramètres essentiels au cas de tests:
	std::string zone = "H3P";// Un client dans la zone cible

	// Autres paramètres:
	int identifiant = 801;  
	int age = 25; 
	tm dateAdhesion; 
	dateAdhesion.tm_year = 2019;

	// Ajoute le client correspondant au cas à tester
	this->objet_a_tester->ajouterClient(new Client(identifiant, "Honnete", "Etudiant", age, zone , dateAdhesion));
	
	// Obtient le rabais a tester
	Facture facture;
	double rabais_a_tester = this->objet_a_tester->getRabais(facture, identifiant);
	
	// Effectue le test en tolérant une marge d'erreur de 0.01
	CPPUNIT_ASSERT_DOUBLES_EQUAL(0.03, rabais_a_tester, 0.001);
} 

void RabaisTest::test_getrabais_zoneJ40(){

	// Paramètres essentiels au cas de tests:
	std::string zone = "J4O";// Un client dans la zone cible

	// Autres paramètres:
	int identifiant = 802;  
	int age = 25; 
	tm dateAdhesion; 
	dateAdhesion.tm_year = 2019;

	// Ajoute le client correspondant au cas à tester
	this->objet_a_tester->ajouterClient(new Client(identifiant, "Honnete", "Etudiant", age, zone , dateAdhesion));
	
	// Obtient le rabais a tester
	Facture facture;
	double rabais_a_tester = this->objet_a_tester->getRabais(facture, identifiant);
	
	// Effectue le test en tolérant une marge d'erreur de 0.01
	CPPUNIT_ASSERT_DOUBLES_EQUAL(0.02, rabais_a_tester, 0.001);
} 

void RabaisTest::test_getrabais_adhesion(){

	// Paramètres essentiels au cas de tests:
	tm dateAdhesion; 
	dateAdhesion.tm_year = 2012; // Rabais 0.02 par tranche de 3 ans, 
								 // ici 2019-2012 = 7 ans / 3 = 2 * 0.02 = rabais de 0.04

	// Autres paramètres:
	int identifiant = 505;  
	int age = 25; 
	std::string zone = "T3S";


	// Ajoute le client correspondant au cas à tester
	this->objet_a_tester->ajouterClient(new Client(identifiant, "Honnete", "Etudiant", age, zone , dateAdhesion));
	
	// Obtient le rabais a tester
	Facture facture;
	double rabais_a_tester = this->objet_a_tester->getRabais(facture, identifiant);
	
	// Effectue le test en tolérant une marge d'erreur de 0.001
	CPPUNIT_ASSERT_DOUBLES_EQUAL(0.04, rabais_a_tester, 0.001);
} 

void RabaisTest::test_getrabais_adhesionMax(){

	// Paramètres essentiels au cas de tests:
	tm dateAdhesion; 
	dateAdhesion.tm_year = 1900; // Rabais maximum = 0.10, soit 0.02 par tranche de 3 ans, 
								 // rabais maximal lorsqu'on atteint le 15 ans

	// Autres paramètres:
	int identifiant = 505;  
	int age = 25; 
	std::string zone = "T3S";


	// Ajoute le client correspondant au cas à tester
	this->objet_a_tester->ajouterClient(new Client(identifiant, "Honnete", "Etudiant", age, zone , dateAdhesion));
	
	// Obtient le rabais a tester
	Facture facture;
	double rabais_a_tester = this->objet_a_tester->getRabais(facture, identifiant);
	
	// Effectue le test en tolérant une marge d'erreur de 0.01
	CPPUNIT_ASSERT_DOUBLES_EQUAL(0.1, rabais_a_tester, 0.01);
} 

void RabaisTest::test_getrabais_facture(){

	// Autres paramètres:
	int identifiant = 200;  
	int age = 25; 
	std::string zone = "T3S";
	tm dateAdhesion; 
	dateAdhesion.tm_year = 2019;

	// Ajoute le client correspondant au cas à tester
	this->objet_a_tester->ajouterClient(new Client(identifiant, "Honnete", "Etudiant", age, zone , dateAdhesion));
	

	// Paramètres essentiels au cas de tests:
	Facture facture;
	facture.ajouterItem(125.00);
	
	// Obtient le rabais a tester
	double rabais_a_tester = this->objet_a_tester->getRabais(facture, identifiant);
	
	// Effectue le test en tolérant une marge d'erreur de 0.01
	CPPUNIT_ASSERT_DOUBLES_EQUAL(0.01, rabais_a_tester, 0.001);
} 

void RabaisTest::test_getrabais_factureMax(){

	// Autres paramètres:
	int identifiant = 201;  
	int age = 25; 
	std::string zone = "T3S";
	tm dateAdhesion; 
	dateAdhesion.tm_year = 2019;

	// Ajoute le client correspondant au cas à tester
	this->objet_a_tester->ajouterClient(new Client(identifiant, "Honnete", "Etudiant", age, zone , dateAdhesion));
	
	// Paramètres essentiels au cas de tests:
	Facture facture;
	facture.ajouterItem(750.00);

	// Obtient le rabais a tester
	double rabais_a_tester = this->objet_a_tester->getRabais(facture, identifiant);
	
	// Effectue le test en tolérant une marge d'erreur de 0.01
	CPPUNIT_ASSERT_DOUBLES_EQUAL(0.06, rabais_a_tester, 0.001);
} 