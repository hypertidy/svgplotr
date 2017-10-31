#pragma once

#include <fstream> // ofstream

#include <Rcpp.h>

void rcpp_svgplot_lines (Rcpp::DataFrame dat, std::string filename, bool html);
void rcpp_svgplot_points (Rcpp::DataFrame dat, std::string filename, bool html);
