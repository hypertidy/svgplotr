context("svgplot")
test_that("write to svg", {
              n <- 1e3
              dat <- getdat (n = n, xylim = 1000)
              expect_true (nrow (dat) < n)
              svgplot (dat, file = "junk")
              con <- file ("junk.html")
              len <- length (readLines (con))
              expect_true ((len - 9) == nrow (dat))
              close (con)
              chk <- file.remove ("junk.html")
})
