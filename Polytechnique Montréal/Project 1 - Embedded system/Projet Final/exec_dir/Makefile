#####################################################
### MAKEFILE ÉQUIPE 0106
### Date : Mardi 22 octobre 2019
### Description: Création de l'exécutable
#####################################################



#################### Preparation ####################

# Projet
MCU=atmega324pa
PROJECTNAME=projet_final
TRG=$(PROJECTNAME).out
HEXROMTRG=$(PROJECTNAME).hex


# Dossiers
OBJ_DIR = ./objet
SRC_DIR = ./source
INC_DIR = ./include
LIB_DIR = ../lib_dir/

# Fichiers sources
PRJSRC= $(wildcard $(SRC_DIR)/*.cpp)
 
# Fichiers objets
OBJDEPS= $(subst $(SRC_DIR),$(OBJ_DIR),$(PRJSRC:.cpp=.o))

# Librairie
NOM_LIB= fonctions

# Programmer ID
AVRDUDE_PROGRAMMERID=usbasp

# Commandes compilateur
CC=avr-gcc
OBJCOPY=avr-objcopy
AVRDUDE=avrdude
REMOVE=rm -f
HEXFORMAT=ihex



############# Options de compilation ###############

# Flags pour le compilateur en C
CFLAGS= -MMD -g -mmcu=$(MCU) -Os \
	-fpack-struct -fshort-enums  \
	-funsigned-bitfields -funsigned-char \
	-Wall -DF_CPU=8000000

# Flags pour le compilateur en C++
CXXFLAGS=-fno-exceptions

# Linker pour lier les librairies utilisees
LDFLAGS=-Wl,-Map,$(TRG).map -mmcu=$(MCU)

# Inclusions
INC = -I $(LIB_DIR)$(INC_DIR) -I ../$(INC_DIR)



##################### Cible (Target) ###############

#Nom des cibles par défaut
.PHONY: all install clean debug



# Compilation du projet
all: $(TRG)



# Implementation de l'executable
$(TRG): $(OBJDEPS)
	make -C $(LIB_DIR)
	$(CC) $(LDFLAGS) -o $(OBJ_DIR)/$@ $(OBJDEPS) -L $(LIB_DIR) -l $(NOM_LIB)

# Creation des fichiers objets
$(OBJ_DIR)/%.o: $(SRC_DIR)/%.cpp
	mkdir -p $(OBJ_DIR)
	$(CC) $(INC) $< -c -o $@ $(CFLAGS) $(CXXFLAGS) 

# Verification des dependances (header dependencies)
-include *.d

%.hex: $(OBJ_DIR)/%.out
	$(OBJCOPY) -j .text -j .data -O $(HEXFORMAT) $< $@

install: $(HEXROMTRG)				
	$(AVRDUDE) -c $(AVRDUDE_PROGRAMMERID) -p $(MCU) -P -e -U flash:w:$(HEXROMTRG)

# Effacer les cibles
clean:
	$(REMOVE) $(OBJ_DIR)/$(TRG) $(HEXROMTRG) $(OBJDEPS) $(OBJ_DIR)/*.d *.out.map
	make clean -C $(LIB_DIR)
	rmdir $(OBJ_DIR) 


# Tester des variables pour la conception du makefile
debug: 
	@echo "OBJDEPS = $(OBJDEPS)"
	@echo "PRJSRC= $(PRJSRC)"
	@echo "LIB_DIR = $(LIB_DIR)"
	@echo "INC = $(INC)"
	@echo "HEXROMTRG = $(HEXROMTRG)"
