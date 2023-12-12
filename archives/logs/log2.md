+++
title = "Log 2"
author = ["En logger"]
lastmod = 2023-11-03T23:00:58+01:00
draft = false
+++

Days pass by without any contribution. Now there is an urge to start something because of some goals. It is hard, but there is hope at the end of the tunnel. _There is peace in knowing I am about to do something_. It is necessary to create a brand recognition and craft an experience that is enjoyable to work with.

Things will take time; therefore, _I must let go of the emotions and be in the moment_. There is an interesting article on [narratives](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4445577). Then there is a deep desire to craft visual narratives and create some story out of this boring life.

Regarding skills, things will take time. Explored the repo of the project that seemed interesting. Upon doing so, there is an even firmer understanding of the repo. However, there are still certain aspects preventing me from working on the project. These challenges include tedious tasks like dataset loading and handling. Since this is a niche area, it will be challenging for me to get things running. Apart from that, sent my draft for review. I will not be working on it further unless absolutely necessary.


## How to get distracted {#how-to-get-distracted}

On writing some `Elisp` to streamline the logging process. There must be a way to facilitate this!

_And yes, I wrote some code! with help from my friend: ChatGPT_

```emacs-lisp
(defun get-next-log-number ()
  (let* ((directory "/path/to/content-org/directory")
         (all-files (directory-files directory nil "^log[0-9]+\\.org$"))
         (all-numbers (mapcar (lambda (file)
                                (if (string-match "^log\\([0-9]+\\)\\.org$" file)
                                    (string-to-number (match-string 1 file))
                                  0))
                              all-files)))
    (1+ (apply 'max all-numbers))))

(defun create-next-log-file ()
  (interactive)
  (let* ((next-log-number (get-next-log-number))
         (filename (format "/path/to/content-org/directory/log%d.org" next-log-number))
         (template (format "#+title: Log %d\n#+AUTHOR: [YOUR NAME HERE]\n#+Date:  [[%s]]\n#+HUGO_SECTION: logs\n#+hugo_auto_set_lastmod: t"
                           next-log-number (format-time-string "%Y-%m-%d"))))
  (with-temp-file filename
      (insert template))
  (find-file filename)))

(map! :leader
      "nj" #'create-next-log-file)
```

Replace `[YOUR NAME HERE]` with the hugo author name and then provide proper path to the directory! This way you can use `Spc n j` to easily create new logs!
