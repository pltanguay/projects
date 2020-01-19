# Compiler parameters
CC=g++ # Compiler
CFLAGS=-Wall -std=c++11 -pedantic -g # Compiler flags
LDFLAGS= # Libraries
LDFLAGS_TEST= -I./ -lcppunit
EXEC=prototype.out # Executable name
EXEC_TEST=test.out

# Directories
SRC_DIR=src/
TEST_DIR=tests/

# Object files to create
SRCM= $(shell find $(SRC_DIR) -name "*.cpp" ! -name "main.cpp") # This finds and enumerate every .cpp files except src/main.cpp
OBJECTS = $(SRCM:.cpp=.o) # This creates an enumeration of .o files for every single .cpp files found 

SRC_TEST= $(shell find $(TEST_DIR) -name "*.cpp")
OBJECTS_TEST = $(SRC_TEST:.cpp=.o)


all: $(EXEC)

test: $(EXEC_TEST)

$(EXEC): $(SRC_DIR)/main.o $(OBJECTS) # Linking
	$(CC) -o $@ $^ $(LDFLAGS)

$(EXEC_TEST): $(OBJECTS_TEST) $(OBJECTS)
	$(CC) -o $@ $^ $(LDFLAGS_TEST)

%.o: %.cpp %.hpp # Compiling
	$(CC) $(CFLAGS) -o $@ -c $<
 
## Dynamic .o and .out file search
OBJECTS_FILES=$(shell find ./ -name "*.o")
OUT_FILES=$(shell find ./ -name "*.out")

clean:
	rm $(OBJECTS_FILES);\
	rm $(OUT_FILES);
