#include <iostream>

#include "Utils.hpp"
#include "Nurses.hpp"
#include "Appointments.hpp"
#include "CSVHandler.hpp"
#include "Constants.hpp"

Patient *login()
{
    std::vector<std::vector<std::string>> patients = CSVHandler(PATIENTS_CSV_PATH).getData();
    std::string userIDEntry = "";
    Patient *user = nullptr;

    while (user == nullptr)
    {
        std::cout << "\nAuthentification du patient\nVeuillez inscrire votre ID d'utilisateur: ";
        std::cin >> userIDEntry;
        user = findPatientByID(patients, userIDEntry);
        if (user == nullptr)
        {
            std::cout << "\nID d'utilisateur invalide, veuillez réessayer.\n";
        }
    }

    return user;
}

int main(int argc, char **argv)
{
    int choice = 0;
    Patient *loggedInUser = login();
    Nurses nurses(NURSES_CSV_PATH);
    Appointments appointments(APPOINTMENTS_CSV_PATH);

    // Les codes ANSI sont utilisés pour mettre le texte en gras.
    std::cout << "\n\n\e[1mBonjour " << loggedInUser->firstName << ' '
              << loggedInUser->lastName << "!\e[0m\n\n";

    do
    {
        std::cout << "Voici la liste des infirmières:\n\n";
        nurses.display();

        std::cout << "\nVeuillez choisir parmis une des options suivantes: \n"
                  << "\t0. Quitter.\n"
                  << "\t1. Consulter les disponibilités d'un.e infirmier.e.\n"
                  << "\t2. Prendre rendez-vous avec un.e infirmier.e\n"
                  << "\t3. Voir mes rendez-vous.\n"
                  << std::endl
                  << "[0, 1, 2 ou 3]: ";
        std::cin >> choice;

        // Switch case pour le choix de l'utilisateur :D !
        switch (choice)
        {
        // Ceci est le cas #1. Il s'agit d'afficher
        // la liste de rendez-vous pour l'utilisateur courrant!
        case 1:
        {
            // On affiche la liste de rendez-vous pour l'utilisateur courrant.
            std::string nurseID = nurses.select()[NURSES_USER_ID];
            std::cout << "Il est impossible de prendre rendez-vous avec cette infirmière pour les dates suivantes:\n";
            appointments.display(APPOINTMENT_NURSE_ID, nurseID, {APPOINTMENT_DATE, APPOINTMENT_TIME});

            // Attend que l'utilisateur appuie sur ENTER pour continuer l'exécution.
            std::cout << "\nAppuyez sur ENTER pour continuer...";
            std::cin.ignore();
            std::cin.get();

            break;
        }
        // Ceci est le cas #2. Il s'agit de permettre
        // à l'utilisateur de prendre un rendez-vous!
        case 2:
        {
            // Prend un rendez-vous pour l'utilisateur.
            std::string nurseId = nurses.select()[NURSES_USER_ID];
            if (appointments.schedule(loggedInUser->profileID, nurseId))
            {
                std::cout << "\nVotre rendez-vous a été correctement enregistré";
            }
            else
            {
                std::cout << "\nCet.te infirmier.e est indisponible pour cette période.";
            }

            // Attend que l'utilisateur appuie sur ENTER pour continuer l'exécution.
            std::cout << "\nAppuyez sur ENTER pour continuer...";
            std::cin.ignore();
            std::cin.get();

            break;

            int s;
            std::cout << "DEBUG3.";
            std::cin >> s;
        }
        // Ceci est le cas #3. Il s'agit de permettre à
        // l'utilisateur de voir les rendez-vous qu'il a pris!
        case 3:
        {
            // Montre la liste des rendez-vous à venir.
            std::cout << "Voici vos rendez-vous à venir:\n\n";
            appointments.display(APPOINTMENT_PATIENT_ID, loggedInUser->profileID);

            // Attend que l'utilisateur appuie sur ENTER pour continuer l'exécution.
            std::cout << "\nAppuyez sur ENTER pour continuer...";
            std::cin.ignore();
            std::cin.get();

            break;
        }
        }
    } while (choice != 0);

    // ICi noUs aLloNs dÉSaLoUEr loGgeDInUSeR
    delete loggedInUser;
    return EXIT_SUCCESS;
}
