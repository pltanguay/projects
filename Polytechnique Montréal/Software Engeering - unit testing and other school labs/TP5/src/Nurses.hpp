#pragma once

#include <vector>
#include <string>
#include <iomanip>

#include "Constants.hpp"
#include "CSVHandler.hpp"

class Nurses {
public:
    Nurses(std::string filePath);

    void display() const;
    std::vector<std::string> select() const;

private:
    void displayHeaders() const;
    void displayNurses() const;

    std::vector<std::string> _headers;
    std::vector<std::vector<std::string>> _nurses;
    const unsigned int _COLUMN_WIDTH = 14;
};
