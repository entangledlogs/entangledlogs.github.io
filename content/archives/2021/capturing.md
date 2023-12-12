+++
title = "Using Emacsclient + Org Capture + System Keybinds for capturing findings."
author = ["En logger"]
date = 2021-08-14
draft = false
+++

**Disclaimer**: This configuration requires running [doom-emacs](https://github.com/hlissner/doom-emacs).

You may have read different note-taking techniques, stumbled upon countless blog posts. Yet, here you are, reading another hack to satisfy your itch. If the title caught your eyes, then it's probably the
words "emacs", "org" and "system keybinds".

Emacs offer a powerful [server](https://www.gnu.org/software/emacs/manual/html_node/emacs/Emacs-Server.html) that allows to clients which spawn frame equivalent to the editor window. Since
emacs is easily hackable using `emacs-lisp`, it won't take long to come up with scripts to create a new frame, change the
editor buffer to capture buffer, allow capturing, and finally close the capture window.

If you are a veteran emacs user you have probably done this multiple times. But for someone who is just starting it out,
it may be overwhelming and magical. Once you feel the magic, you will get hooked to it.

Here you find a spell in `emacs-lisp` that defines a function to launch the capture buffer.

```emacs-lisp
(defun launch-note (&optional initial-input key)
  (set-frame-name "doom-capture")
  (add-hook 'org-capture-after-finalize-hook 'post-org-launch-note)
  (letf! ((#'pop-to-buffer #'switch-to-buffer))
    (interactive)
    (switch-to-buffer (doom-fallback-buffer))
    (let ((org-capture-initial initial-input)
          org-capture-entry)
      (when (and key (not (string-empty-p key)))
        (setq org-capture-entry (org-capture-select-template key)))
      (funcall #'org-capture))
    )
  )

(defun post-org-launch-note ()
  (remove-hook 'org-capture-after-finalize-hook 'post-org-launch-note)
  (delete-frame))
```

If you are confused (especially when starting out), that is totally normal. Emacs offer [hooks](https://www.gnu.org/software/emacs/manual/html_node/emacs/Hooks.html) that allows
to define extra invocable after calling certain functions.

The above snippet adds a function `post-org-launch-note`  to `org-capture-after-finalize-hook`. Therefore whatever is inside the `post-org-launch-note`
is going to be called after you complete org capture. The code inside `letf!` creates a pop-up buffer and runs the `org-capture` inside it.

Once you have this code snippet running, all you have to do is bind the keys in your window manager, or shortcut manager so that it can run the following script.
following way

```sh
emacsclient -c -F "((name . \"doom-capture\"))" --eval '(launch-note)'
```

For non-doom users the functions `letf!` is a macro defined [here](https://github.com/hlissner/doom-emacs/blob/2d2246d7ca5ec084f4bee9a5de14256eb6828837/core/core-lib.el#L142).
