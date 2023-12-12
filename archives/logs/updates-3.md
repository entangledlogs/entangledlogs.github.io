+++
title = "Weekly Update-03"
author = ["Entangled Logs"]
date = 2022-06-19
draft = false
+++

## Logs {#logs}

This week was nothing remarkable.

1.  Maze programming:
    -   Implement the Dijkstra's shortest path algorithm. This allows us to find the cost of reaching each cell in the maze.

2.  SICP
    -   I completed the interval exercise. I didn't like to work on all the problems, but at least I am through it! The boring bit is away.

3.  Proofs
    -   Quick introduction to set theory!

4.  Dev tools
    -   Now vim will look for the `.gitignore` file and ignore adding the files into the list. This script is really short!

        ```lua
        -- Add wildcards
        vim.g.wildcards = ""
        local function gitignore()
            local filename = ".gitignore"
            local f = io.open(filename, "rb")
            if f then
        	local igstring = ""
        	for oline in io.lines(filename) do
        	   local line = oline:gsub("%s", "")
        	   if line:sub(1, 1) == "#" then goto continue end
        	   if line:sub(1, 1) == "" then goto continue end
        	   if line:sub(1, 1) == "!" then goto continue end
        	   if line:sub(-1, -1) == "/" then
        		igstring = igstring .. "," .. line .. "*"
        		goto continue
        	   end
        	   igstring = igstring .. "," .. line
        	   ::continue::
        	end
        	vim.g.wildcards = vim.g.wildcards .. igstring:gsub("%^,", "")
            end
        end
        gitignore()
        ```

        -   YES, that is a `goto`! Lua doesn't have `continue`.

5.  Graphics
    -   `smoothstep` allows to create gradients. `smoothstep(A, B, C)`, with \\(A > B\\) will create a nice gradient from lighter to darker value as long as \\(C = len(uv.xy)\\). It means it will factor in the radius!

6.  Art
    -   This week was about layering, composition, and blending.
