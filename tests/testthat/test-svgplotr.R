context("svgplot")
test_that("lines", {
              n <- 1e3
              dat <- getlines (n = n, xylim = 1000)
              expect_true (nrow (dat) <= n)
              svgplot_lines (dat, file = "junk")
              con <- file ("junk.html")
              len <- length (readLines (con))
              expect_true ((len - 9) == nrow (dat))
              close (con)
              chk <- file.remove ("junk.html")
})

test_that("points", {
              n <- 1e3
              dat <- getpoints (n = n, xylim = 1000)
              expect_equal (nrow (dat), n)
              svgplot_points (dat, file = "junk")
              con <- file ("junk.html")
              len <- length (readLines (con))
              expect_true ((len - 9) == nrow (dat))
              close (con)
              chk <- file.remove ("junk.html")
})
