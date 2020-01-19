#include "CSVHandler.hpp"

CSVHandler::CSVHandler(std::string filename, char delm) : fileName(filename), delimeter(delm) {}

std::vector<std::string> CSVHandler::split(std::string str)
{
    std::vector<std::string> vec;
    std::string field = "";

    for (char token : str)
    {
        if (token == this->delimeter)
        {
            vec.push_back(field);
            field = "";
        }
        else
        {
            field += token;
        }
    }
    vec.push_back(field);
    return vec;
}

void const CSVHandler::writeData(std::vector<std::string> data)
{
    if (this->getHeader().size() != data.size())
    {
        throw std::exception();
    }

    std::fstream file;
    file.open(this->fileName, std::ios::out | std::ios::app);

    file << '\n';
    for (unsigned int i = 0; i < data.size(); i++)
    {
        file << data[i];
        if (i != data.size() - 1)
        {
            file << this->delimeter;
        }
    }
    file.close();
}

/*
* Parses through csv file line by line and returns the data
* in vector of vector of strings.
*/
std::vector<std::vector<std::string>> const CSVHandler::getData()
{
    std::ifstream file(this->fileName);
    std::vector<std::vector<std::string>> dataList;
    std::string line = "";

    getline(file, line); // This skips the header
    // Iterate through each line and split the content using delimeter
    while (getline(file, line))
    {
        dataList.push_back(this->split(line));
    }
    // Close the File
    file.close();

    return dataList;
}

std::vector<std::string> const CSVHandler::getHeader()
{
    std::ifstream file(this->fileName);
    std::string line = "";
    getline(file, line);
    file.close();

    return this->split(line);
}
