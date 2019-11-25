/****************************************************************************
 * Fichier: gestionnaire.cpp
 * Auteur: Melody Roy (1991902) et Pier-Luc Tanguay (1953707)
 * Date: 8 octobre 2019
 * Description: Implémentation de la classe Gestionnaire
 *				(surcharge opérateurs et vecteurs)
 ****************************************************************************/

#include "gestionnaire.h"


// Constructeurs
Gestionnaire::Gestionnaire()
{
}

// Destructeurs
Gestionnaire::~Gestionnaire()
{
	for (int i = 0; i < membres_.size(); i++) {
			delete membres_[i];
	}

	for (int i = 0; i < coupons_.size(); i++) {
		delete coupons_[i];
	}

	membres_.clear();
	coupons_.clear();

}

// Getters
vector<Membre*> Gestionnaire::getMembres() const
{
	return membres_;
}

vector<Coupon*> Gestionnaire::getCoupons() const
{
	return coupons_;
}


/****************************************************************************
 * Fonction:	Gestionnaire::ajouterMembre
 * Description: Crée et ajoute un membre au programme.
 * Paramètres:	- (const string&) nomMembre: le nom du membre à ajouter
				- (TypeMembre) typeMembre : le type de membre à ajouter
 * Retour:		aucun
 ****************************************************************************/
void Gestionnaire::ajouterMembre(const string& nomMembre, TypeMembre typeMembre)
{
	// On vérifie de quel type nous voulons créer l'objet.
	if (typeMembre == Membre_Occasionnel) {
		Membre* membre = new Membre(nomMembre, typeMembre);
		membres_.push_back(membre);
	}


	else if (typeMembre == Membre_Regulier) {
		MembreRegulier* membre = new MembreRegulier(nomMembre, typeMembre);
		membres_.push_back(static_cast<Membre*>(membre));
	}
		
	else {
		MembrePremium* membre = new MembrePremium(nomMembre);
		membres_.push_back(static_cast<Membre*>(membre));
	}
}

/****************************************************************************
 * Fonction:	Gestionnaire::ajouterCoupon
 * Description: Crée et ajoute un coupon au programme.
 * Paramètres:	- (const string&) code: le code du coupon à ajouter
				- (double) rabais: le rabais qu'offre le coupon en pourcentage
								   (entre 0 et 1)
				- (int) cout: Le nombre de points que coûte le coupon
 * Retour:		aucun
 ****************************************************************************/
void Gestionnaire::ajouterCoupon(const string& code, double rabais, int cout)
{
	coupons_.push_back(new Coupon(code, rabais, cout));
}

/****************************************************************************
 * Fonction:	Gestionnaire::trouverMembre
 * Description: Cherche un membre dans la liste de membre en fonction de son nom.
				Si aucun membre est trouvé, un nullptr est retourné et un message
				d’erreur est affiché
 * Paramètres:	- (const string&) nomMembre: le nom du membre à chercher
 * Retour:		Retourne un un membre actif du programme
 ****************************************************************************/
Membre* Gestionnaire::trouverMembre(const string& nomMembre) const
{
	for (int i = 0; i < membres_.size(); i++) {
		if (*membres_[i] == nomMembre) {
			return membres_[i];
		}
	}
	cout << "Le membre " << nomMembre << " n'existe pas\n";

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
void Gestionnaire::assignerBillet(const string& nomMembre, const string& pnr, double prixBase, const string& od, TarifBillet tarif, const string& dateVol, bool utiliserCoupon, TypeBillet typeBillet)
{
	// Trouver membre
	Membre* membre = trouverMembre(nomMembre);
	if (membre == nullptr) {
		return;
	}

	// Calcul le prix
	double prixReel = prixBase;
	if (typeBillet == TypeBillet::Flight_Pass){
		prixReel *= 10;
	}

	if (utiliserCoupon) {
		prixReel -= appliquerCoupon(membre, prixReel);
	}


	// Si membre premium
	if (membre->getTypeMembre() == Membre_Premium) {

		// Rabais par défaut au maximum
		double rabais = REDUCTION_MAXIMUM;


		// On change rabais si nécessaire
		if (static_cast<MembrePremium*>(membre)->getpointsCumulee() < POINTS_MAXIMUM)
			rabais = static_cast<MembrePremium*>(membre)->getpointsCumulee()/TRANCHE_RABAIS * REDUCTION_BASE;

		prixReel -= prixReel * rabais;
		static_cast<MembrePremium*>(membre)->ajouterBillet(pnr, prixReel, od, tarif, typeBillet, dateVol);
	}

	// Si membre regulier
	else if (membre->getTypeMembre() == Membre_Regulier) {
		static_cast<MembreRegulier*>(membre)->ajouterBillet(pnr, prixReel, od, tarif, typeBillet, dateVol);
	}

	// Sinon, on sait que c'est un membre occasionnel
	else {
		membre->ajouterBillet(pnr, prixReel, od, tarif, typeBillet, dateVol);
	}
	
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
double Gestionnaire::appliquerCoupon(Membre* membre, double prix)
{
	if (membre->getTypeMembre() != Membre_Occasionnel) {

		// S'il n'y a pas de coupon
		if (static_cast<MembreRegulier*>(membre)->getCoupons().size() == 0) {
			cout << "Le membre n'a pas de coupon utilisable\n";
			return 0;
		}

		Coupon* meilleurCoupon = static_cast<MembreRegulier*>(membre)->getCoupons()[0];
		vector<Coupon*> coupons = static_cast<MembreRegulier*>(membre)->getCoupons();
		for (int i = 1; i < coupons.size(); ++i) {
			if (*coupons[i] > * meilleurCoupon) {
				meilleurCoupon = coupons[i];
			}
		}

		*(static_cast<MembreRegulier*>(membre)) -= meilleurCoupon;

		return prix * meilleurCoupon->getRabais();
	}
	return 0;
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
void Gestionnaire::acheterCoupon(const string& nomMembre)
{
	if (coupons_.size() == 0) {
		cout << "Le gestionnaire n'a pas de coupon!" << endl;
		return;
	}

	Membre* membre = trouverMembre(nomMembre);

	if (membre == nullptr) {
		return;
	}

	
		Coupon* meilleurCoupon = nullptr;
		int points;
		
	
		
		// Si le membre n'est pas occasionnel, il possède des coupons, sinon aucune manipulation à faire.
		if (membre->getTypeMembre() != Membre_Occasionnel) {
			points = static_cast<MembreRegulier*>(membre)->getPoints();


			for (int i = 0; i < coupons_.size(); i++) {
				if (points >= coupons_[i]->getCout()) {
					// Si on avait pas encore trouve de meilleur coupon, on fait la premiere assignation
					if (meilleurCoupon == nullptr) {
						meilleurCoupon = coupons_[i];
					}
					// Sinon on compare si le coupon courant a un rabais superieur au meilleur coupon
					else if (*coupons_[i] > * meilleurCoupon) {
						meilleurCoupon = coupons_[i];
					}
				}
			}

			if (meilleurCoupon) {
				// Action différente selon le type de coupon 
				if (membre->getTypeMembre() == Membre_Regulier)
					static_cast<MembreRegulier*>(membre)->acheterCoupon(meilleurCoupon);

				if (membre->getTypeMembre() == Membre_Premium)
					static_cast<MembrePremium*>(membre)->acheterCoupon(meilleurCoupon);
			}
			else
				cout << "Le membre ne peut acheter de coupon\n";
		}
}

/****************************************************************************
 * Fonction:	 Gestionnaire::operator<<
 * Description: Surcharge de l'operateur de flux de sortie pour afficher
 *				les attributs d'un Billet.
 * Paramètres:	- (ostream&) out : le flux de sortie
 *				- (const Gestionnaire&) g : le gestionnaire a afficher
 * Retour:		(ostream&) Retourne flux de sorti pour l'appel en cascade
 ****************************************************************************/
ostream& operator<<(ostream& o, const Gestionnaire& gestionnaire)
{
	o << "=================== ETAT ACTUEL DU PROGRAMME ==================\n\n";
	
	for (int i = 0; i < gestionnaire.membres_.size(); i++) {

		// Affichages différentes selon le type de membre
		if ( gestionnaire.membres_[i]->getTypeMembre() == Membre_Regulier) {
			o << *static_cast<MembreRegulier*>(gestionnaire.getMembres()[i]);
		}
		else if (gestionnaire.membres_[i]->getTypeMembre() == Membre_Premium) {
			o << *static_cast<MembrePremium*>(gestionnaire.getMembres()[i]);
		}
		else {
			o << gestionnaire.membres_[i];
		}
		
	}

	return o;
	
}
