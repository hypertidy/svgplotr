#include "svgplot.h"

//' rcpp_svgplot_lines
//' @noRd
// [[Rcpp::export]]
void rcpp_svgplot_lines (Rcpp::DataFrame dat, std::string filename, bool html)
{
    Rcpp::NumericVector xfr = dat ["xfr"];
    Rcpp::NumericVector yfr = dat ["yfr"];
    Rcpp::NumericVector xto = dat ["xto"];
    Rcpp::NumericVector yto = dat ["yto"];
    Rcpp::StringVector col = dat ["col"];
    Rcpp::NumericVector lwd = dat ["lwd"];

    int size_x = static_cast <int> (Rcpp::max (xfr)),
        size_y = static_cast <int> (Rcpp::max (yfr)),
        size_xt = static_cast <int> (Rcpp::max (xto)),
        size_yt = static_cast <int> (Rcpp::max (yto));
    if (size_xt > size_x)
        size_x = size_xt;
    if (size_yt > size_y)
        size_y = size_yt;

    // svg plots have inverted y-axes
    /*
    Rcpp::Rcout << "size_y = " << size_y << "; [1] = " <<
        yfr [0];
    yfr = size_y - yfr;
    yto = size_y - yto;
    Rcpp::Rcout << " -> " << yfr [0] << std::endl;
    */

    std::ofstream out_file;
    out_file.open (filename.c_str (), std::ofstream::out);
    if (html)
    {
        out_file << "<!doctype html> <html>\n" <<
            "<head>\n  <body>\n";
    }
    out_file << "    <svg xmlns=\"http://www.w3.org/2000/svg\" " <<
        "version=\"1.1\" overflow=\"visible\" width=\"" << size_x << 
        "\" height=\"" << size_y << "\" " << "viewBox=\"0 0 " <<
        size_x << " " << size_y << "\">\n      <g class=\"line\">\n";

    // Plot each edge as a separate path rather than using compound paths.
    // This is easier, and apparently doesn't make any difference to rendering
    // speed.
    for (unsigned int i = 0; i < xfr.size (); i++)
    {
        out_file << "        <path d=\"M" << xfr [i] << " " << yfr [i] << " ";

        std::string prefx = "L";
        // check whether line has wrapped around boundary:
        if (fabs (xto [i] - xfr [i]) > (static_cast <double> (size_x) / 2.0) ||
            fabs (yto [i] - yfr [i]) > (static_cast <double> (size_y) / 2.0))
            prefx = "M";

        out_file << prefx << " " << xto [i] << " " << yto [i] <<
            "\" stroke=\"" << col [i] << "\" stroke-width=\"" <<
            lwd [i] << "\"/>\n";
    }

    out_file << "      </g>\n    </svg>\n";
    if (html)
        out_file << "  </body>\n</html>\n";
    out_file.close ();
}

//' rcpp_svgplot_points
//' @noRd
// [[Rcpp::export]]
void rcpp_svgplot_points (Rcpp::DataFrame dat, std::string filename, bool html)
{
    Rcpp::NumericVector x = dat ["x"];
    Rcpp::NumericVector y = dat ["y"];
    Rcpp::StringVector col = dat ["col"];

    int size_x = static_cast <int> (Rcpp::max (x)),
        size_y = static_cast <int> (Rcpp::max (y));

    std::ofstream out_file;
    out_file.open (filename.c_str (), std::ofstream::out);
    if (html)
    {
        out_file << "<!doctype html> <html>\n" <<
            "<head>\n  <body>\n";
    }
    out_file << "    <svg xmlns=\"http://www.w3.org/2000/svg\" " <<
        "version=\"1.1\" overflow=\"visible\" width=\"" << size_x << 
        "\" height=\"" << size_y << "\" " << "viewBox=\"0 0 " <<
        size_x << " " << size_y << "\">\n      <g class=\"circle\">\n";

    // Plot each edge as a separate path rather than using compound paths.
    // This is easier, and apparently doesn't make any difference to rendering
    // speed.
    for (unsigned int i = 0; i < x.size (); i++)
    {
        out_file << "        <circle cx=\"" << x [i] << "\" cy=\"" <<
            y [i] << "\" r = \"2\" fill=\"transparent\" stroke=\"" <<
            col [i] << "\" stroke-width=\"1\"/>\n";
    }

    out_file << "      </g>\n    </svg>\n";
    if (html)
        out_file << "  </body>\n</html>\n";
    out_file.close ();
}
