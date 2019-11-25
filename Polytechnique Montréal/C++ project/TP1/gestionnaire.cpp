/****************************************************************************
 * Fichier: gestionnaire.cpp
 * Auteur: Melody Roy (1991902) et Pier-Luc Tanguay (1953707)
 * Date: 17 septembre 2019
 * Description: Implementation de la classe Gestionnaire
 ****************************************************************************/

#include "gestionnaire.h"

// Constructeur
Gestionnaire::Gestionnaire(): 
	nbCoupons_(0), 
	nbMembres_(0), 
	capaciteCoupons_(CAPACITE_INITIALE) {

	membres_ = new Membre * [CAPACITE_INITIALE];
	for (int i = 0; i < CAPACITE_INITIALE; i++) {
		membres_[i] = nullptr;
	}
	capaciteMembres_ = CAPACITE_INITIALE;
	coupons_ = new Coupon * [CAPACITE_INITIALE];

	for (int i = 0; i < CAPACITE_INITIALE; i++) {
		coupons_[i] = nullptr;
	}
}

// Destructeur
Gestionnaire::~Gestionnaire() {
	for (int i = 0; i < nbMembres_; i++) {
		delete membres_[i];
		membres_[i] = nullptr;
	}
	delete membres_;

	for (int i = 0; i < nbCoupons_; i++) {
		delete coupons_[i];
		coupons_[i] = nullptr;
	}
	delete coupons_;
}

// Getters
Membre** Gestionnaire::getMembres() const {
	return membres_;
}

int Gestionnaire::getNbMembres() const {
	return nbMembres_;
}

int Gestionnaire::getCapaciteMembres() const {
	return capaciteMembres_;
}

Coupon** Gestionnaire::getCoupons() const {
	return coupons_;
}
int Gestionnaire::getNbCoupons() const {
	return nbCoupons_;
}

int Gestionnaire::getCapaciteCoupons() const {
	return capaciteCoupons_;
}

// Méthodes

/****************************************************************************
 * Fonction:	Gestionnaire::ajouterMembre
 * Description: Crée et ajoute un membre au programme. (Doubler la capacité si nécessaire)
 * Paramètres:	- (const string&) nomMembre: le nom du membre à ajouter
 * Retour:		aucun
 ****************************************************************************/
void Gestionnaire::ajouterMembre(const string& nomMembre) {

	if (nbMembres_ == capaciteMembres_) {
		capaciteMembres_ *= 2;
		Membre** temporaire = membres_;
		membres_ = new Membre * [capaciteMembres_];

		for (int i = 0; i < nbMembres_; i++) {
			membres_[i] = temporaire[i];
		}
		delete[] temporaire;
	}

	membres_[nbMembres_] = new Membre(nomMembre);
	nbMembres_++;
}


/****************************************************************************
 * Fonction:	Gestionnaire::ajouterCoupon
 * Description: Crée et ajoute un coupon au programme. (Doubler la capacité si 
				nécessaire)
 * Paramètres:	- (const string&) code: le code du coupon à ajouter
				- (double) rabais: le rabais qu'offre le coupon en pourcentage
								   (entre 0 et 1)
				- (int) cout: Le nombre de points que coûte le coupon
 * Retour:		aucun
 ****************************************************************************/
void Gestionnaire::ajouterCoupon(const string& code, double rabais, int cout) {

	if (nbCoupons_ == capaciteCoupons_) {
		capaciteCoupons_ *= 2;
		Coupon** temporaire = coupons_;
		coupons_ = new Coupon * [capaciteCoupons_];

		for (int i = 0; i < nbCoupons_; i++) {
			coupons_[i] = temporaire[i];
		}
		delete[] temporaire;
	}		

	coupons_[nbCoupons_] = new Coupon(code, rabais, cout);
	nbCoupons_++;
}

/****************************************************************************
 * Fonction:	Gestionnaire::trouverMembre
 * Description: Cherche un membre dans la liste de membre en fonction de son nom.
				Si aucun membre est trouvé, un nullptr est retourné et un message 
				d’erreur est affiché
 * Paramètres:	- (const string&) nomMembre: le nom du membre à chercher
 * Retour:		Retourne un un membre actif du programme
 ****************************************************************************/
Membre* Gestionnaire::trouverMembre(const string& nomMembre) const {
	for (int i = 0; i < nbMembres_; i++) {
		if (nomMembre == membres_[i]->getNom()) {
			return membres_[i];
		}
	}
	cout << "Le membre " << nomMembre << " n'existe pas !" << endl;
	return nullptr;
}
 
/****************************************************************************
 * Fonction:	Gestionnaire::assignerBillet
 * Description: Assigne un billet à un membre. Si un coupon est utilisé, 
				calcule le prix réel après avoir utilisé le meilleur coupon 
				possible, avant de l’assigner à un membre.
 * Paramètres:	- (const string&) nomMembre: le nom du membre où l'on veut 
											 assigner un billet
				- (const string&) pnr : numéro de réservation du billet à assigner
				- (double) prixBase : prix du billet sans coupon appliqué
				- (double) od : origine - destination du nouveau billet
				- (TarifBillet) tarif : type de tarif du nouveau billet
				- (const string&) dateVol : date du vol du nouveau billet
				- (bool) utiliserCoupon : vrai si on utilise le meilleur coupon
 * Retour:		- aucun
 ****************************************************************************/
void Gestionnaire::assignerBillet(const string& nomMembre,
	const string& pnr, double prixBase, const string& od,
	TarifBillet tarif, const string& dateVol, bool utiliserCoupon) {

	double montantRabais=0;
	
	if (utiliserCoupon)
		montantRabais = appliquerCoupon(trouverMembre(nomMembre), prixBase);

	double prixFinal = prixBase - montantRabais;

	trouverMembre(nomMembre)->ajouterBillet(pnr, prixFinal, od, tarif, dateVol);
}


/****************************************************************************
 * Fonction:	Gestionnaire::appliquerCoupon
 * Description: Calcule et utilise le meilleur coupon que possède le membre.
				Cherche dans la liste des coupons du membre celui qui a le 
				plus grand taux de réduction. Si le membre ne possède aucun 
				coupon, un message d’erreur est affiché.
 * Paramètres:	- (Membre*) membre : élément membre dans lequel nous voulons
									ajouter le coupon
				- (double) prix : prix de base sans rabais
 * Retour:		- Retourne le rabais, en dollars, que permet le coupon
 ****************************************************************************/
double Gestionnaire::appliquerCoupon(Membre* membre, double prix) {

	double pourcentageRabais = 0;

	if (membre->getNbCoupons() == 0) {
		cout << "Le membre n'a pas de coupon utilisable !" << endl;
	}
	else {
		int indiceMeilleurCoupon;
		for (int i = 0; i < membre->getNbCoupons(); i++) {
			if (membre->getCoupons()[i]->getRabais() > pourcentageRabais) {
				pourcentageRabais = membre->getCoupons()[i]->getRabais();
				indiceMeilleurCoupon = i;
			}
		}
		membre->retirerCoupon(membre->getCoupons()[indiceMeilleurCoupon]);
	}
	return pourcentageRabais*prix;
}


/****************************************************************************
 * Fonction:	Gestionnaire::acheterCoupon
 * Description: Utilise les points d'un membre pour acquérir un coupon, celui
				le plus avantageux. Afffiche erreur si le membre n'a pas assez 
				de points.
 * Paramètres:	- (const string&) nomMembre: le nom du membre qui veut acheter 
											 un coupon
 * Retour:		- aucun
 ****************************************************************************/
void Gestionnaire::acheterCoupon(const string& nomMembre) {
	double meilleurRabais = 0;
	int indiceMeilleurCoupons;
	for (int i = 0; i < nbCoupons_; i++) {
		if (trouverMembre(nomMembre)->getPoints() > coupons_[i]->getCout() &&
			coupons_[i]->getRabais() > meilleurRabais) {
			meilleurRabais = coupons_[i]->getRabais();
			indiceMeilleurCoupons = i;
		}
	}
	if (meilleurRabais == 0) {
		cout << "Le membre " << nomMembre << " ne peut pas acheter de coupon !" << endl;
	}
	else {
		trouverMembre(nomMembre)->acheterCoupon(coupons_[indiceMeilleurCoupons]);
	}
}
		
/****************************************************************************
 * Fonction:	Gestionnaire::afficherInfos
 * Description: Afficher les informations du gestionnaire
 * Paramètres:	- aucun
 * Retour:		- aucun
 ****************************************************************************/
void Gestionnaire::afficherInfos() const {
	for (int i = 0; i < nbMembres_; i++) {
		membres_[i]->afficherMembre();
		cout << endl;
	}
}