+++
title = "Weekly Update-01"
author = ["Entangled Logs"]
date = 2022-06-05
draft = false
+++

## Logs {#logs}

It took a bit amount of time to decide on the name of the series. I went with "Weekly update-##" for the title and "Logs" for the first section. It should be good enough.

One quick update on why it took two weeks to create this post. I went to Metz, France. It is a small beautiful city in Northern France. Notre Dame, there was quite cool. This monument has fascinating lore. It was started by some bishop after slaying a dragon. Yup, it reads straight out of a fantasy novel. Even within the church, different statues and tainted glass art are portraying the bishop slaying Graoully. The cathedral has Gothic vibes in it.

This log features two bullet points for each activity. The first bullet point should have appeared in the previous blog post. Therefore, I have written updates for two weeks on the same blog post.

1.  Maze programming:
    -   Past week I set up a boilerplate for the maze. A maze is a grid of cells. Each cell will have neighbors in different directions. The grid will be responsible for filling up the cells and providing the access to each of these cells.
    -   I implemented a binary tree algorithm for maze generation. This one was fun to implement once I have the basic setup going on. I can quickly create a maze now!  Here is the demo of the algorithm created.

        ```nil
            +---+---+---+---+---+---+---+---+
            |                               |
            +---+   +   +   +   +---+---+   +
            |       |   |   |   |           |
        ​    +   +---+   +   +   +---+   +   +
            |   |       |   |   |       |   |
            +---+   +   +---+---+---+   +   +
            |       |   |               |   |
            +---+---+---+---+---+---+---+---+
        ```

2.  SICP
    -   Did a few more basic exercises. Message passing is a powerful concept that allows the data to transmitted without ever having to modify the original data. Some languages that allow passing functions as objects can easily create something like message passing.
    -   Lambda calculus can present numbers only in terms of lambda functions. They are called [Church numerals](https://en.wikipedia.org/wiki/Church_encoding#Church_numerals). Yes, it's a wild concept!

3.  Proofs
    -   Reviews on propositional logic.
    -   More review on propositional logic.

4.  Dev tools
    -   `vim` has `argsadd` to add files into the buffer list. Then `:b <Ctrl-d>` brings the buffer list.
    -   I wanted to use the **neovim**'s built-in lsp, but that is a hazzle to set up without plugins. Therefore, I have ditched that process altogether.

5.  Graphics
    -   I stole some code for edge filtering using fragshader! I learnt about `texelFetch`. It's a cool operator that can fetch the pixel value at the given point!
    -   Last week, it was a very vanilla implementation to draw lines. I can make a proper texture for papers.

6.  Art
    -   The art gallery in Metz was top-notch. I witnessed some nice artwork there.
    -   On my personal side, I learned more about lights. I haven't drawn anything. So next week will be a practice session.

This week, I am supposed to be on vacation. But I have no clue what to for a vacation. I always get bored when I am constrained free time.
