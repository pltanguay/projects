#pragma once

#include <string>

#define PATIENT_USER_ID 0
#define PATIENT_FNAME 1
#define PATIENT_LNAME 2
#define PATIENT_EMAIL 3
#define PATIENT_TELEPHONE 4
#define PATIENT_STREET_NB 5
#define PATIENT_STREET_NAME 6
#define PATIENT_CITY 7
#define PATIENT_POSTAL_CODE 8
#define PATIENT_DISEASE 9

#define NURSES_USER_ID 0
#define NURSES_FNAME 1
#define NURSES_LNAME 2
#define NURSES_EMAIL 3
#define NURSES_TELEPHONE 4
#define NURSES_STREET_NB 5
#define NURSES_STREET_NAME 6
#define NURSES_CITY 7
#define NURSES_POSTAL_CODE 8
#define NURSES_HOURLY_RATE 9
#define NURSES_LICENSE_NB 10

#define APPOINTMENT_NURSE_ID 0
#define APPOINTMENT_PATIENT_ID 1
#define APPOINTMENT_DATE 2
#define APPOINTMENT_TIME 3
#define APPOINTMENT_REASON 4

const unsigned int CLEAR_SCREEN_LINE_RETURN = 70;
const std::string PATIENTS_CSV_PATH = "data/patients.csv";
const std::string NURSES_CSV_PATH = "data/nurses.csv";
const std::string APPOINTMENTS_CSV_PATH = "data/appointments.csv";
