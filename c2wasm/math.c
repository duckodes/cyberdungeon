#include <math.h>

double truncateDecimal(double num, int digits) {
    double factor = pow(10.0, digits);
    return floor(num * factor) / factor;
}