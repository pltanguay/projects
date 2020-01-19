
#include "stdio.h" // printf
#include "stdlib.h" // atoi, atof
#include "comparison.c"
#include "comparison.h"
#include "newton.h"

/*
 * argc : Number of parameters passed to the program. The value is almost always one, for the program name.
 * argv : A list of char* strings. One a proper call, the first char* is the program name, the second char* is the value for which we want the root, and the third char* is the number of iteration we want for the Newton approximation of the root. 
 * return : Zero if the program worked allright, or the error code : 1 means not enought arguments were given. 2 means that the value to root is invalid. 3 means that the number of iterations is invalid.
 */

 // Melody ajoute un commentaire à la même ligne
// Pier-Luc ajoute un commentaire à la même ligne

int main(int argc, char** argv) {

	// Check the number of arguments.
	if (argc<3) return -1;

	// Transform the char* arguments to numerical values.
	double value_to_root = atof(argv[1]);
	int iterations = atoi(argv[2]);

	// Check if the numerical values are valid.
	if (value_to_root < 0) return -2;
	if (iterations < 1) return -3;

	// Print out the initial values.
	printf("Compute the root value of %f\n", value_to_root);
      	printf("With %d iterations\n", iterations);	

	// Perform the Newton approximation of the root.
	float root = newton(value_to_root, iterations);

	// Print out the results.
	printf("Result = %f\n", root);
float resultat = 100-(100*comparison(value_to_root,root));
	// TODO add the comparison code.
	printf("Le résultat est valide à %f %% \n", resultat);
	// Normal execution, return zero to indicate no error.
 	return 0;
}

