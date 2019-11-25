
#
MCU=atmega324pa
PROJECTNAME= libFonctions
TRG=$(PROJECTNAME).a

# Dossiers
OBJ_DIR = objet
SRC_DIR = source
INC_DIR = ./include

# Fichiers
PRJSRC= $(wildcard $(SRC_DIR)/*.cpp) 
## Liste de tout les fichiers objet que nous devons creer, dans le dossier objet, a partir du nom des fichiers sources
OBJDEPS= $(subst $(SRC_DIR),$(OBJ_DIR),$(PRJSRC:.cpp=.o))

# Compilateur utilise
CC=avr-gcc
AR=avr-ar
REMOVE=rm -f

# Flags pour le compilateur. Nous avons retirer -Wall, puisque les alertes proviennet de fichiers fournis
CFLAGS=-I $(INC_DIR) -MMD -g -mmcu=$(MCU) -Os \
	-fpack-struct -fshort-enums             \
	-funsigned-bitfields -funsigned-char                                         
	
.PHONY: all install clean 


all: $(TRG)

# De objet à librairie
$(TRG): $(OBJDEPS)
	$(AR) -crs $(TRG) $(OBJDEPS) 


# De cpp à objet, créer le dossier objet s'il n'existe pas
$(OBJ_DIR)/%.o: $(SRC_DIR)/%.cpp 
	mkdir -p $(OBJ_DIR)
	$(CC) -c -o $@ $< $(CFLAGS)

# Supprime les fichier .o et .d, supprime le dossier objet
clean:
	$(REMOVE) $(OBJ_DIR)/*.o   
	$(REMOVE) $(OBJ_DIR)/*.d 
	rmdir $(OBJ_DIR) 
	$(REMOVE) *.a

# Tester les variables pour la conception du makefile
vars: 
	@echo "OBJDEPS = $(OBJDEPS)"
	@echo "PRJSRC= $(PRJSRC)"