#pragma once

#include <string>
#include <vector>

#include "Constants.hpp"
#include "CSVHandler.hpp"

struct Location
{
    std::string streetNumber;
    std::string streetName;
    std::string city;
    std::string postalCode;
};

struct Patient {
    Patient(std::vector<std::string> row):
        profileID(row[PATIENT_USER_ID]),
        firstName(row[PATIENT_FNAME]),
        lastName(row[PATIENT_LNAME]),
        email(row[PATIENT_EMAIL]),
        telephone(row[PATIENT_TELEPHONE])
    {
        location = Location{
                row[PATIENT_STREET_NB],
                row[PATIENT_STREET_NAME],
                row[PATIENT_CITY],
                row[PATIENT_POSTAL_CODE]
        };
        disease = row[PATIENT_DISEASE];
    };

    std::string profileID;
    std::string firstName;
    std::string lastName;
    std::string email;
    std::string telephone;
    Location location;
    std::string disease;
};

Patient *findPatientByID(std::vector<std::vector<std::string>> &patients, std::string id);
