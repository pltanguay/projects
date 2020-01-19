
# Fichier exécutable produit
EXEC=typerabais
EXECTEST=typerabais_test

# Répertoire contenant les fichiers source
SOURCE=src

# Répertoire contenant les fichiers compilés
BINAIRE=bin

# Répertoire contenant les données utilisées par le logiciel
DONNEES=data

# Répertoire contenant les fichiers test
TESTS= test

# Nom du fichier contenant les données
CLIENTS=clients.dat

# =======================
# Compilation du logiciel
# =======================

# commande par défaut, construit un exécutable appelé $(EXEC) et le lance.
# l'exécutable est appelé avec ./$(EXEC) nomfichierdonnees.dat
all: $(BINAIRE)/$(EXEC)
	./$(BINAIRE)/$(EXEC) $(DONNEES)/$(CLIENTS)

# Fait le "linking" entre les fichiers objets pour produire l'exécutable
$(BINAIRE)/$(EXEC): $(BINAIRE)/main.o $(BINAIRE)/client.o $(BINAIRE)/rabais.o $(BINAIRE)/facture.o $(BINAIRE)/afficheur.o
	g++ -o $@ $^ 

# Compile le "main" pour produire le fichier objet.
$(BINAIRE)/main.o: $(SOURCE)/main.cpp $(SOURCE)/rabais.h $(SOURCE)/facture.h
	mkdir -p $(BINAIRE)
	g++ -o $@ -c $<

# Compile la classe Client pour produire le fichier objet.
$(BINAIRE)/client.o: $(SOURCE)/client.cpp $(SOURCE)/client.h
	g++ -o $@ -c $<

# Compile la classe Rabais pour produire le fichier objet.
$(BINAIRE)/rabais.o: $(SOURCE)/rabais.cpp $(SOURCE)/rabais.h $(SOURCE)/client.h $(SOURCE)/facture.h
	g++ -o $@ -c $<

# Compile la classe Facture pour produire le fichier objet.
$(BINAIRE)/facture.o: $(SOURCE)/facture.cpp $(SOURCE)/facture.h
	g++ -o $@ -c $<

# Conmpile la classe Afficheur pour produire le fichier objet.
$(BINAIRE)/afficheur.o: $(SOURCE)/afficheur.cpp $(SOURCE)/afficheur.h $(SOURCE)/rabais.h $(SOURCE)/facture.h
	g++ -o $@ -c $<

# ===========
# Utilitaires
# ===========


# Enlève l'exécutable et les fichiers objets intermédiaires.
clean:
	rm -rf $(BINAIRE)/$(EXEC) $(BINAIRE)/*.o
	rm -rf $(TESTS)/$(BINAIRE)/*.o
	rm -rf $(TESTS)/$(BINAIRE)/$(EXECTEST)
	rmdir $(BINAIRE) 
	rmdir $(TESTS)/$(BINAIRE) 

# =================
# Tests du logiciel
# =================

test: $(TESTS)/$(BINAIRE)/$(EXECTEST)
	./$(TESTS)/$(BINAIRE)/$(EXECTEST)

$(TESTS)/$(BINAIRE)/$(EXECTEST): $(TESTS)/$(BINAIRE)/main.o $(TESTS)/$(BINAIRE)/testeur_rabais.o $(TESTS)/$(BINAIRE)/rabais.o $(TESTS)/$(BINAIRE)/facture.o $(TESTS)/$(BINAIRE)/client.o
	g++ -o $@ $^ -lcppunit

$(TESTS)/$(BINAIRE)/main.o: $(TESTS)/$(SOURCE)/main.cpp $(TESTS)/$(SOURCE)/testeur_rabais.h
	mkdir -p $(TESTS)/$(BINAIRE)
	g++ -o $@ -c $<

$(TESTS)/$(BINAIRE)/testeur_rabais.o: $(TESTS)/$(SOURCE)/testeur_rabais.cpp $(TESTS)/$(SOURCE)/testeur_rabais.h $(SOURCE)/rabais.h
	g++ -o $@ -c $<

$(TESTS)/$(BINAIRE)/rabais.o: $(SOURCE)/rabais.cpp $(SOURCE)/rabais.h
	g++ -o $@ -c $<

$(TESTS)/$(BINAIRE)/facture.o: $(SOURCE)/facture.cpp $(SOURCE)/facture.h
	g++ -o $@ -c $<

$(TESTS)/$(BINAIRE)/client.o: $(SOURCE)/client.cpp $(SOURCE)/client.h
	g++ -o $@ -c $<