#include <math.h>
#include <stdlib.h>
#include <stdbool.h>
#include <time.h>

// Truncate decimal places
double truncateDecimal(double num, int digits)
{
    double factor = pow(10.0, digits);
    return floor(num * factor) / factor;
}

// min ~ max - 1
int getRandomInt(int min, int max)
{
    return rand() % (max - min) + min;
}

// min ~ max
int getRandomIntIncludeMax(int min, int max)
{
    return rand() % (max - min + 1) + min;
}

// min ~ max
float getRandomFloat(float min, float max)
{
    return ((float)rand() / RAND_MAX) * (max - min) + min;
}

// get random bool
bool getRandomBool()
{
    return rand() % 2 == 0;
}
