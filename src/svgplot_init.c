#include <R.h>
#include <Rinternals.h>
#include <stdlib.h> // for NULL
#include <R_ext/Rdynload.h>

/* FIXME: 
   Check these declarations against the C/Fortran source code.
*/

/* .Call calls */
extern SEXP _svgplotr_rcpp_svgplot(SEXP, SEXP, SEXP);

static const R_CallMethodDef CallEntries[] = {
    {"_svgplotr_rcpp_svgplot", (DL_FUNC) &_svgplotr_rcpp_svgplot, 3},
    {NULL, NULL, 0}
};

void R_init_svgplotr(DllInfo *dll)
{
    R_registerRoutines(dll, NULL, CallEntries, NULL, NULL);
    R_useDynamicSymbols(dll, FALSE);
}
