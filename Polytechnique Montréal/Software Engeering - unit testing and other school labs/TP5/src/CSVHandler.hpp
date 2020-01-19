#pragma once

#include <string>
#include <vector>
#include <fstream>
#include <iostream>

class CSVHandler
{
public:
    CSVHandler(std::string filename, char delm = ',');

    std::vector<std::string> split(std::string str);

    const std::vector<std::string> getHeader();
    const std::vector<std::vector<std::string>> getData();
    const void writeData(std::vector<std::string> data);

private:
    std::string fileName;
    char delimeter;
};
