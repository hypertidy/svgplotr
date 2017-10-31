#' svgplot
#'
#' Plot data as \code{html}-formatted \code{svg} file.
#'
#' @param dat A test \code{data.frame} from \link{getdat}
#' @param filename Name of \code{html} file to write \code{svg} data
#' @return Nothing
#' @export
svgplot <- function (dat, filename)
{
    filename <- paste0 (tools::file_path_sans_ext (filename), ".html")
    rcpp_svgplot (dat, filename)
}
