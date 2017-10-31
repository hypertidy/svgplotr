#pragma once

#include <fstream> // ofstream

#include <Rcpp.h>

void rcpp_svgplot (Rcpp::DataFrame dat, std::string filename, bool html);
