#' svgplot_lines
#'
#' Plot line data as \code{html}-formatted \code{svg} file.
#'
#' @param dat A test \code{data.frame} from \link{getlines}
#' @param filename Name of \code{html} file to write \code{svg} data
#' @param html If \code{TRUE}, produce file in \code{html} format; otherwise
#' straight \code{svg}.
#' @return Nothing
#' @export
svgplot_lines <- function (dat, filename, html = TRUE)
{
    filename <- tools::file_path_sans_ext (filename)
    if (html)
        filename <- paste0 (filename, ".html")
    else
        filename <- paste0 (filename, ".svg")

    # svg plots have inverted y-axes:
    ymax <- max (c (dat$yfr, dat$yto))
    dat$yfr <- ymax - dat$yfr
    dat$yto <- ymax - dat$yto

    rcpp_svgplot_lines (dat, filename, html)
}

#' svgplot_points
#'
#' Plot point data as \code{html}-formatted \code{svg} file.
#'
#' @param dat A test \code{data.frame} from \link{getpoints}
#' @param filename Name of \code{html} file to write \code{svg} data
#' @param html If \code{TRUE}, produce file in \code{html} format; otherwise
#' straight \code{svg}.
#' @return Nothing
#' @export
svgplot_points <- function (dat, filename, html = TRUE)
{
    filename <- tools::file_path_sans_ext (filename)
    if (html)
        filename <- paste0 (filename, ".html")
    else
        filename <- paste0 (filename, ".svg")

    # svg plots have inverted y-axes:
    dat$y <- max (dat$y) - dat$y

    rcpp_svgplot_points (dat, filename, html)
}
