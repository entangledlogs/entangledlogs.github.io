+++
title = "Log 14"
author = ["En logger"]
date = 2023-12-18T00:00:00+01:00
lastmod = 2023-12-18T22:45:43+01:00
draft = false
+++

Another day passed with limited productivity, but overall, it was a good day. Secret Santa turned out to be an enjoyable event, thanks to having good colleagues. Engaging in bouldering remains an absolute necessity; the grind must persist. It is essential to incorporate some form of physical routine into everyday life to foster an active lifestyle rather than just being in one place and doing nothing.

Concerning projects, progress is gradually being made, though at a slower pace than anticipated. Nonetheless, any progress is still progress. The convergence of multiple progress factors may be contributing to the current pace.


## Segmentation Trick {#segmentation-trick}

A neat trick exists for computing the bounding box and centroid for a given segment of data. The idea is as follows.

```python
h, w = segment_data.shape
hh = np.arange(h)
ww = np.arange(w)
xx, yy = np.meshgrid(ww, hh)

xs = xx[segment_data == i]
ys = yy[segment_data == i]
bbox = [xs.min(), ys.min(), xs.max(), ys.max()]
center = [xs.mean(), ys.mean()]
```

The snippet initializes a meshgrid and filters the segmentation. After that, it's simply a matter of computing the mean, minimum, and maximum values. For those familiar with my work, they might guess where this snippet leads. Fortunately, the popularity of this blog post is zero.


## Working with SSH {#working-with-ssh}

VSCode provides an easy way to connect to an SSH server, making remote editing quite straightforward. The necessity to edit remotely arises from the computational requirements for processing data. This allows for offloading the compute to the cloud, enabling easy batch processing of data.


## What's next? {#what-s-next}

Continue working on the project and seek ways to improve writing. Simultaneously, numerous other projects require attention.
