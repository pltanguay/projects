#include "Test.hpp"

void Test::setUp()
{
    this->_csvHandler = new CSVHandler(CSV_TEST_FILE_PATH);
    this->_patients = {
        {"test0", "test1","test2","test3","test4","test5","test6","test7","test8","test9"},
        {"test00", "test11","test22","test33","test44","test55","test66","test77","test88","test99"}
    };
}

void Test::tearDown() {}

void Test::testGetHeader()
{
    std::vector<std::string> expectedResult = {"header1", "header2", "header3"};
    std::vector<std::string> actualResult = this->_csvHandler->getHeader();

    for(unsigned int i = 0; i < expectedResult.size(); i++) 
    {
        CPPUNIT_ASSERT_EQUAL(expectedResult[i], actualResult[i]);
    }
}

void Test::testGetData()
{
    std::vector<std::vector<std::string>> expectedResult = {
        {"field1","field2","field3"},
        {"field11","field22","field33"}
    };
    std::vector<std::vector<std::string>> actualResult = this->_csvHandler->getData();

    for(unsigned int i = 0; i < expectedResult.size(); i++)
    {
        for(unsigned int j = 0; j < expectedResult[i].size(); j++) 
        {
            CPPUNIT_ASSERT_EQUAL(expectedResult[i][j], actualResult[i][j]);
        }
    }
}

void Test::testFindPatientByID1()
{
    Patient *patient = findPatientByID(this->_patients, "N'existePas");
    CPPUNIT_ASSERT(patient == nullptr);
}

void Test::testFindPatientByID2()
{
    Patient *patient = findPatientByID(this->_patients, this->_patients[0][0]);
    CPPUNIT_ASSERT(patient != nullptr);
}
