+++
title = "Log 16"
author = ["En logger"]
date = 2023-12-21T00:00:00+01:00
lastmod = 2023-12-21T21:45:17+01:00
draft = false
+++

Today was a productive day. Some gaming sessions in the morning, food at the university, and gym sessions, finally followed by light coding. This is a total win for this day. There are different ways how people carry out their daily life and work. While others have a way of balancing it, I can't do it properly. The menial daily tasks bore me, thus creating a chain of distractions and triggering a negative loop.

The only way to break is to be free and be myself. Today, the tasks went without friction. That one extra match on the game was fruitful in maintaining sanity and creating urgency in other aspects of life. This is a huge win.

Regarding job and money, the self has given up on the possibility of being hired. The nature of self is such that it doesn't account for the possibility of getting a job. The being that is me allows the decision from self. The self-goal aligns with the inner being, therefore easing the permissions. When the self is aligned with the inner being, the ego doesn't worry much. As a result, it is more about actions than anything else.

Some snippets for today:

1.  **Generating video using still images**
    ```nil
    ffmpeg -framerate 30 -pattern_type glob -i '*.png' -c:v libx264 -pix_fmt yuv420p out.mp4
    ```
2.  **\*Drawing rectangle in matplotlib**
    ```python
    import matplotlib. patches as patches
    import matplotlib.pyplot as plt

    x = 10
    y = 20
    w = 40
    h = 30
    rect = [x, y, x + w, y + h]
    fig, ax = plt.subplots()
    patch = patches.Rectangle((rect[0], rect[1]), rect[2] - rect[0], rect[3] - rect[1], linewidth=1, edgecolor='r', facecolor='none')
    ax.add_patch(patch)
    ```
3.  **To save an plt image**
    ```python
    plt.savefig("path/to/file.png")
    ```
4.  **How to add leading zeros in Python**
    Occasionally, it may be required to convert `int` to `str` and add leading zeros.
    Python supports this with method called `zfill()`
    ```python
    x = str(1).zfill(3) # Occupies three space. It fills two leading zeros.
    ```
    Another way is to use `format`
    ```python
    print(f"{1:03}")
    ```
