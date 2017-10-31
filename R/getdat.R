#' getlines
#'
#' Make a single trail from a bunch of random connected edges
#' @param n Number of edges
#' @param xylim Maximal x and y values 
#' @return A \code{data.frame} of randomly wandering edges
#' @export
getlines <- function (n = 1e3, xylim = 1000)
{
    xfr <- yfr <- xto <- yto <- rep (NA, n)
    xy <- ceiling (runif (2) * xylim)

    for (i in seq (n))
    {
        xfr [i] <- xy [1]
        yfr [i] <- xy [2]
        jump <- 20 * rexp (1)
        xy <- xy + ceiling ( (runif (2) - 0.5) * jump)
        if (!(any (xy < 1) | any (xy > xylim)))
        {
            xto [i] <- xy [1]
            yto [i] <- xy [2]
        } else
        {
            xy [xy < 1] <- xy [xy < 1] + xylim
            xy [xy > xylim] <- xy [xy > xylim] - xylim
        }
    }
    indx <- which (!is.na (xto) & !is.na (yto))
    xfr <- xfr [indx]
    yfr <- yfr [indx]
    xto <- xto [indx]
    yto <- yto [indx]

    # scale red to x, green to y, and blue to this:
    blu <- sqrt ( ( (xfr - xylim / 2) / xylim) ^ 2 +
                 ( (yfr - xylim / 2) / xylim) ^ 2) / sqrt (0.5)
    col <- rgb (xfr / xylim, yfr / xylim, blu)

    data.frame (xfr = xfr, yfr = yfr, xto = xto, yto = yto,
                col = col, lwd = blu * 2,
                stringsAsFactors = FALSE)
}

#' getpoints
#'
#' Get a bunch of random points along with colour attributes
#' @param n Number of points
#' @param xylim Maximal x and y values 
#' @return A \code{data.frame} of random points
#' @export
getpoints <- function (n = 1e3, xylim = 1000)
{
    x <- ceiling (runif (n) * xylim)
    y <- ceiling (runif (n) * xylim)

    # scale red to x, green to y, and blue to this:
    blu <- sqrt ( ( (x - xylim / 2) / xylim) ^ 2 +
                 ( (y - xylim / 2) / xylim) ^ 2) / sqrt (0.5)
    col <- rgb (x / xylim, y / xylim, blu)

    data.frame (x = x, y = y, col = col,
                stringsAsFactors = FALSE)
}
