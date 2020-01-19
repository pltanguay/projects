RM=rm
GCC=gcc
MKDIR=mkdir
CP=cp
EXEC=newton
DOSSIER=install

# default command, builds an executable called "newton".
# executable can be called with ./newton 49 4
all: $(EXEC)

# link the object files into the executable.
# the -lm option is to tell the linker to include math libraries.
newton: main.o newton.o
	$(GCC) -o $@ $^ -lm

# compile the main.c file into the main.o object file.
main.o: main.c newton.h
	$(GCC) -o $@ -c $<

# compile the newton.c file into the newton.o object file.
newton.o: newton.c newton.h
	$(GCC) -o $@ -c $<

# remove the executable and intermediary object files.
clean:
	$(RM) -rf *.o

dossier:
	$(MKDIR) -p $(DOSSIER) 

install: dossier newton
	$(CP) $(EXEC) $(DOSSIER) 
