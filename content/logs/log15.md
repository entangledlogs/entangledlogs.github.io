+++
title = "Log 15"
author = ["En logger"]
date = 2023-12-19T00:00:00+01:00
lastmod = 2023-12-19T23:56:29+01:00
draft = false
+++

Made some significant progress on the video editing. Sorting out the future action steps was the key to realizing the required action. However, the issue with these action lists is they do not last long. Further, these lists require manual tracking, a tedious task. Also, committing to some of these lists feels like being chained. The whole situation is contradictory because an overview of the possible action steps keeps the brain on track. While having a clear action path confines it, ultimately inducing unnecessary stress.

A delicate balance between freedom and confinement determines whether the next hour will be spent doom-scrolling or doing something productive. Maintaining this whole focus requires tuning the mind into the state of flow. The flow requires keeping up with some challenges and the next step. The mind works when it can anticipate the next steps or visualize possible results. When either anticipation or visualization is missing, the mind defaults to a limbo state.

Unfortunately, there aren't any code snippets that were produced as artifacts for today. Consequently, no CS insights. However, there was some learning going on. Apparently, it is related to C++ and Rust.

```C++
void foo() {
    int volatile *allocate = nullptr;
    int use = *allocate;
}
```

The above snippet results in segfault. If optimized, the code produces something such as:

```asm
mov eax, dword ptr [0]
ret
```

Without the volatile, it would be optimized away. When the code is run, it will result in segfault.

Another thing I learned is,

```C++
int foo(int val) {
    while(val != 2) {
    }
    return val;
}
```

The above snippet will return 2 after optimization. The LLVM IR ignores the not branch and optimizes the code. Need to investigate more on it later.
