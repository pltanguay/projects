#pragma once

// Librairies CppUnit nécessaires.
#include <cppunit/TestCase.h>
#include <cppunit/TestFixture.h>
#include <cppunit/extensions/HelperMacros.h>
#include <vector>

// Le fichier à tester, qui se trouve dans un répertoire différent.
#include "../src/CSVHandler.hpp"
#include "../src/Utils.hpp"

const std::string CSV_TEST_FILE_PATH = "tests/test.csv";

class Test: public CppUnit::TestFixture
{
    CPPUNIT_TEST_SUITE(Test);
    CPPUNIT_TEST(testGetHeader);
    CPPUNIT_TEST(testGetData);
    CPPUNIT_TEST(testFindPatientByID1);
    CPPUNIT_TEST(testFindPatientByID2);
    CPPUNIT_TEST_SUITE_END();

public:
	// Fonctions d'échafaudage
    void setUp();
    void tearDown();
    
    // Fonctions de tests
    void testGetHeader();
    void testGetData();
    void testFindPatientByID1();
    void testFindPatientByID2();

private:
    CSVHandler* _csvHandler;
    std::vector<std::vector<std::string>> _patients;
};
