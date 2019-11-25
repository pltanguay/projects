/*
 * Date : 12 Septembre 2019
 * Auteur : Philippe C�T�-MORNEAULT
 */

#include "gestionnaire.h"
// Constructeur
Gestionnaire::Gestionnaire()
{
}

// Destructeur
Gestionnaire::~Gestionnaire()
{
	for (int i = 0; i < membres_.size(); i++) {
		delete membres_[i];
	}

	for (int i = 0; i < coupons_.size(); i++) {
		delete coupons_[i];
	}
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

// Methodes

/****************************************************************************
 * Fonction:	Gestionnaire::ajouterMembre
 * Description: Cr�e et ajoute un membre au programme.
 * Param�tres:	- (const string&) nomMembre: le nom du membre � ajouter
 * Retour:		aucun
 ****************************************************************************/
void Gestionnaire::ajouterMembre(const string& nomMembre)
{
	Membre* membre = new Membre(nomMembre);
	membres_.push_back(membre);
}

/****************************************************************************
 * Fonction:	Gestionnaire::ajouterCoupon
 * Description: Cr�e et ajoute un coupon au programme.
 * Param�tres:	- (const string&) code: le code du coupon � ajouter
				- (double) rabais: le rabais qu'offre le coupon en pourcentage
								   (entre 0 et 1)
				- (int) cout: Le nombre de points que co�te le coupon
 * Retour:		aucun
 ****************************************************************************/
void Gestionnaire::ajouterCoupon(const string& code, double rabais, int cout)
{
	Coupon* coupon = new Coupon(code, rabais, cout);
	coupons_.push_back(coupon);
}

/****************************************************************************
 * Fonction:	Gestionnaire::trouverMembre
 * Description: Cherche un membre dans la liste de membre en fonction de son nom.
				Si aucun membre est trouv�, un nullptr est retourn� et un message
				d�erreur est affich�
 * Param�tres:	- (const string&) nomMembre: le nom du membre � chercher
 * Retour:		Retourne un un membre actif du programme
 ****************************************************************************/
Membre* Gestionnaire::trouverMembre(const string& nomMembre) const
{
	for (int i = 0; i < membres_.size(); i++) {
		// Surcharge de l'operateur ==
		if (*membres_[i] == nomMembre) {
			return membres_[i];
		}
	}
	cout << "Le membre " << nomMembre << " n'existe pas\n";

	return nullptr;
}

/****************************************************************************
 * Fonction:	Gestionnaire::assignerBillet
 * Description: Assigne un billet � un membre. Si un coupon est utilis�,
				calcule le prix r�el apr�s avoir utilis� le meilleur coupon
				possible, avant de l�assigner � un membre.
 * Param�tres:	- (const string&) nomMembre: le nom du membre o� l'on veut
											 assigner un billet
				- (const string&) pnr : num�ro de r�servation du billet � assigner
				- (double) prixBase : prix du billet sans coupon appliqu�
				- (double) od : origine - destination du nouveau billet
				- (TarifBillet) tarif : type de tarif du nouveau billet
				- (const string&) dateVol : date du vol du nouveau billet
				- (bool) utiliserCoupon : vrai si on utilise le meilleur coupon
 * Retour:		- aucun
 ****************************************************************************/
void Gestionnaire::assignerBillet(const string& nomMembre, const string& pnr, double prixBase, const string& od, TarifBillet tarif, const string& dateVol, bool utiliserCoupon)
{
	double prixReel;
	Membre* membre = trouverMembre(nomMembre);

	if (membre == nullptr) {
		return;
	}

	if (utiliserCoupon) {
		prixReel = prixBase - appliquerCoupon(membre, prixBase);
	}
	else {
		prixReel = prixBase;
	}
	membre->ajouterBillet(pnr, prixReel, od, tarif, dateVol);
}

/****************************************************************************
 * Fonction:	Gestionnaire::appliquerCoupon
 * Description: Calcule et utilise le meilleur coupon que poss�de le membre.
				Cherche dans la liste des coupons du membre celui qui a le
				plus grand taux de r�duction. Si le membre ne poss�de aucun
				coupon, un message d�erreur est affich�.
 * Param�tres:	- (Membre*) membre : �l�ment membre dans lequel nous voulons
									ajouter le coupon
				- (double) prix : prix de base sans rabais
 * Retour:		- Retourne le rabais, en dollars, que permet le coupon
 ****************************************************************************/
double Gestionnaire::appliquerCoupon(Membre* membre, double prix)
{
	if (membre->getCoupons().size() == 0) {
		cout << "Le membre n'a pas de coupon utilisable\n";
		return 0;
	}

	Coupon* meilleurCoupon = membre->getCoupons()[0];
	vector<Coupon*> coupons = membre->getCoupons();
	for (int i = 1; i < membre->getCoupons().size(); i++) {
		// Surcharge de l'operateur > de la classe Coupon
		if (coupons[i] > meilleurCoupon) {
			meilleurCoupon = membre->getCoupons()[i];
		}
	}

	// Surcharge de l'operateur -= de la classe Membre
	*membre -= meilleurCoupon;

	return prix * meilleurCoupon->getRabais();
}

/****************************************************************************
 * Fonction:	Gestionnaire::acheterCoupon
 * Description: Utilise les points d'un membre pour acqu�rir un coupon, celui
				le plus avantageux. Afffiche erreur si le membre n'a pas assez
				de points.
 * Param�tres:	- (const string&) nomMembre: le nom du membre qui veut acheter
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

	for (int i = 0; i < coupons_.size() ; i++) {
		if (membre->getPoints() >= coupons_[i]->getCout()) {
			// Si on avait pas encore trouve de meilleur coupon, on fait la premiere assignation
			if (meilleurCoupon == nullptr) {
				meilleurCoupon = coupons_[i];
			}
			// Sinon on compare si le coupon courant a un rabais superieur au meilleur coupon
			// Surcharge de l'operateur > de la classe Coupon
			else if (coupons_[i] > meilleurCoupon) {
				meilleurCoupon = coupons_[i];
			}
		}
	}

	if (meilleurCoupon) {
		membre->acheterCoupon(meilleurCoupon);
	}
	else {
		cout << "Le membre ne peut acheter de coupon\n";
	}
}

/****************************************************************************
 * Fonction:	operator<<
 * Description: Surcharge de l'operateur de flux de sortie pour afficher
 *				les attributs d'un Billet.
 * Param�tres:	- (ostream) out : le flux de sortie
 *				- (Gestionnaire) g : le gestionnaire a afficher
 * Retour:		(ostream) pour l'appel en cascade
 ****************************************************************************/
ostream& operator<<(ostream& out, const Gestionnaire& g) {
	out << "=================== ETAT ACTUEL DU PROGRAMME ==================\n\n";

	for (int i = 1; i < g.getMembres().size(); i++) {
		out << *g.getMembres()[i];
	}
	return out;
}