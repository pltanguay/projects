#include "Nurses.hpp"

Nurses::Nurses(std::string filePath)
{
    CSVHandler csvHandler(filePath);
    this->_headers = csvHandler.getHeader(); // It is correct to return vector<T> as lvalue.
    this->_nurses = csvHandler.getData();
}

void Nurses::display() const
{
    this->displayHeaders();
    this->displayNurses();
}

std::vector<std::string> Nurses::select() const
{
    unsigned int selectedNurseIdx = 0;
    std::cout << "\nVeuillez sélectionner un.e infirmier.e par son index: ";
    std::cin >> selectedNurseIdx;
    std::cout << std::endl;
    return this->_nurses[selectedNurseIdx - 1];
}

void Nurses::displayHeaders() const
{
    for (std::string header : this->_headers)
    {
        std::cout << std::setw(this->_COLUMN_WIDTH) << header;
    }
    std::cout << std::endl << std::string(this->_headers.size() * this->_COLUMN_WIDTH, '_') << std::endl;
}

void Nurses::displayNurses() const
{
    for (unsigned int i = 0; i < this->_nurses.size(); i++)
    {
        std::cout << i + 1 << '.' << std::setw(this->_COLUMN_WIDTH - 2); // We let two spaces since we add two characters
        
        for (std::string field : this->_nurses[i])
        {
            // We use substr, so there is at least one space between all fields.
            std::cout << field.substr(0, this->_COLUMN_WIDTH - 1) << std::setw(this->_COLUMN_WIDTH);
        }
        std::cout << '\n';
    }
}
