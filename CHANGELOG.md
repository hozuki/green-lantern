# Changelog

## 0.3.1-alpha

2016-01-02

- \* Improved rendering efficiency of `flash.display.Graphics`.
- \* Iterations of blurring filters were reduced from 5 to 3,
which worsened image quality but enhanced rendering efficiency.

## 0.3.0-alpha

2015-12-27

- \+ Tween functions.

## 0.2.0-alpha

2015-12-26

- \+ Basic text element.
- \* Blur radius calculation was adjusted to avoid over-blurring.
- \* Filter buffers are correctly cleared now. Result of the draw call
will not affect the next update of final image.

## 0.1.0

2015-12-23

First release.

Features:

- Basic graphics support.
- Filters: Gaussian Blur, Glow.
