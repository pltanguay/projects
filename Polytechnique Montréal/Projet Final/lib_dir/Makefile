#####################################################
### MAKEFILE ÉQUIPE 0106
### Date : Mardi 22 octobre 2019
### Description: Création de la librairie
#####################################################



#################### Preparation ####################

# Projet
MCU=atmega324pa
PROJECTNAME= libfonctions
TRG=$(PROJECTNAME).a

# Dossiers
OBJ_DIR = ./objet
SRC_DIR = ./source
INC_DIR = ./include

# Fichiers sources
PRJSRC= $(wildcard $(SRC_DIR)/*.cpp) 
# Fichiers objets
OBJDEPS= $(subst $(SRC_DIR),$(OBJ_DIR),$(PRJSRC:.cpp=.o))

# Compilateur utilise
CC=avr-gcc
AR=avr-ar
REMOVE=rm -f




############# Options de compilation ###############


# Flags pour le compilateur. 
CFLAGS= -MMD -g -mmcu=$(MCU) -Os \
	-fpack-struct -fshort-enums \
	-funsigned-bitfields -funsigned-char \
	-Wall -DF_CPU=8000000

OPT_AR = -crs

# Inclusions
INC = -I $(INC_DIR)

# Flags pour le compilateur en C++
CXXFLAGS= -fno-exceptions

# Verification des dependances (header dependencies)
-include $(OBJ_DIR)/*.d





##################### Cible (Target) ###############
	
.PHONY: all install clean debug

# Compilation du projet
all: $(TRG)

# Implementation de la librairie
$(TRG): $(OBJDEPS)
	$(AR) $(OPT_AR) $(TRG) $(OBJDEPS) 

# Creation des objets
$(OBJ_DIR)/%.o: $(SRC_DIR)/%.cpp $(INC_DIR)/%.h
	mkdir -p $(OBJ_DIR)
	$(CC) $(INC) -c -o $@ $< $(CFLAGS) $(CXXFLAGS)

# Supprime les fichier .o et .d, supprime le dossier objet
clean:
	$(REMOVE) $(OBJDEPS) $(OBJ_DIR)/*.d $(TRG)
	rmdir $(OBJ_DIR) 

# Tester les variables pour la conception du makefile
debug: 
	@echo "OBJDEPS = $(OBJDEPS)"
	@echo "PRJSRC= $(PRJSRC)"
