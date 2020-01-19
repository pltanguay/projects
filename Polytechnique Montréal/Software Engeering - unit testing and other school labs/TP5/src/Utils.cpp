#include "Utils.hpp"

Patient *findPatientByID(std::vector<std::vector<std::string>> &patients, std::string id)
{
    for (std::vector<std::string> patient : patients)
    {
        if (patient[PATIENT_USER_ID] == id)
        {
            return new Patient(patient);
        }
    }

    return nullptr;
}