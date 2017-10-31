<!-- README.md is generated from README.Rmd. Please edit that file -->
[![Build Status](https://travis-ci.org/mpadge/svgplotr.svg)](https://travis-ci.org/mpadge/svgplotr) [![codecov](https://codecov.io/gh/mpadge/svgplotr/branch/master/graph/badge.svg)](https://codecov.io/gh/mpadge/svgplotr) [![Project Status: Concept - Minimal or no implementation has been done yet.](http://www.repostatus.org/badges/0.1.0/concept.svg)](http://www.repostatus.org/#concept)

svgplotr
========

Fast `svg` plots in **R**. Currently just a demonstration of speed relative to [`svglite`](https://github.com/r-lib/svglite). The function `getdat()` generates a series of random edges with varying colours and line widths to be plotted. Comparison is against a `ggplot2` object with no embellishments, set up with the following code

``` r
require (ggplot2)
ggmin_theme <- function ()
{
    theme <- theme_minimal ()
    theme$panel.background <- element_rect (fill = "transparent",
                                                     size = 0)
    theme$line <- element_blank ()
    theme$axis.text <- element_blank ()
    theme$axis.title <- element_blank ()
    theme$plot.margin <- margin (rep (unit (0, 'null'), 4))
    theme$legend.position <- 'none'
    theme$axis.ticks.length <- unit (0, 'null')
    return (theme)
}
```

One set of random lines can then be generated and plotted like this:

``` r
dat <- getdat (n = 1e4, xylim = 1000)
fig <- ggplot () + ggmin_theme () +
    geom_segment (aes (x = xfr, y = yfr, xend = xto, yend = yto,
                       colour = col, size = lwd), size = dat$lwd, data = dat)
print (fig)
```

![](README-fig-1.png)

Timing Comparison
-----------------

``` r
require (svglite)
#> Loading required package: svglite
plotgg <- function (fig)
{
    svglite ("lines.svg")
    print (fig)
    graphics.off ()
}

rbenchmark::benchmark (
                       plotgg (fig),
                       svgplot (dat, filename = "lines"),
                       replications = 5) [, 1:5]
#>                               test replications elapsed relative user.self
#> 1                      plotgg(fig)            5   0.908     7.63     0.856
#> 2 svgplot(dat, filename = "lines")            5   0.119     1.00     0.112
```

And `svgplotr` is close to an order of magnitude faster than `svglite`.
