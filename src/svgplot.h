#pragma once

#include <fstream> // ofstream

#include <Rcpp.h>

void rcpp_svgplot_edges (Rcpp::DataFrame dat, std::string filename, bool html);
void rcpp_svgplot_points (Rcpp::DataFrame dat, std::string filename, bool html);
