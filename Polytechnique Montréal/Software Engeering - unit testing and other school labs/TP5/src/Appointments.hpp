#pragma once

#include <string>
#include <vector>
#include <algorithm>
#include <iomanip>
#include <numeric>

#include "Constants.hpp"
#include "CSVHandler.hpp"

class Appointments
{
public:
    Appointments(std::string filePath);

    std::vector<unsigned int> fillDisplayedColumns(std::vector<unsigned int> displayedColumns);
    std::vector<std::vector<std::string>> filterUserAppointments(unsigned int userCol, std::string userId);

    void display(unsigned int userCol, std::string userId, std::vector<unsigned int> displayedColumns = {});
    bool schedule(std::string patientId, std::string nurseId);

    std::vector<std::vector<std::string>>* getData();
    void setData(std::vector<std::vector<std::string>> data);

private:
    std::vector<std::string> createNewAppointment(std::string patientId, std::string nurseId);

    std::vector<std::string> _headers;
    CSVHandler _csvHandler;

    std::vector<std::vector<std::string>> _appointmentsData;

    const unsigned int _COLUMN_WIDTH = 14;
};
