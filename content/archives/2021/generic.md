+++
title = "Notes on Generic Programming - I: Types"
author = ["Entangled logs"]
date = 2021-08-29
draft = false
+++

These are my notes on Generic Programming. Feel free to skim through them.


## Introduction to Type {#introduction-to-type}


### Type {#type}

1.  A tool to reason or proving properties of the program
2.  Allows understanding and classifying the variables during computation and use
3.  Types require compositional calculation i.e. sub-expressions give rise to higher types.
4.  Understand dynamically typed as dynamically checked.


### Motivation of Requiring Types {#motivation-of-requiring-types}

1.  Language Safety/Error Detection
    -   Can pinpoint some programming errors rather than in runtime
    -   Can guarantee that programs do not follow some kinds of misbehavior. It doesn't mean that it can proscribe all undefined behaviors.
        -   Example array bounds, division by 0, etc.
    -   These kinds of errors are: Run-time errors
    -   Safety of the program is dependent on the type of runtime behavior.
    -   Safe program protects its abstractions.
    -   Prevents the case where some parts are directly accessible i.e can protect the integrity of user-defined abstraction

2.  Allows abstraction and modularity.
    -   Forms a system of module language or even domain-specific languages
    -   Structuring large systems in terms of modules with clear interfaces leads to abstract design, which can facilitate independent implementation

3.  Security
    -   Encoding violations can prevent security bugs.
        For example, conversion of integers to pointers can be detected before runtime.
    -   Another common example is Rust.

4.  Proof checking and efficiency
    -   A well-typed language can verify proofs during the compilation phase.
    -   Typing can allow implementing some fully automatic checks for light classes and types.
    -   Therefore, compilers can optimize these use cases.
    -   Example can be pointer generation in parallel computation
    -   Eliminates dynamic checks for efficiency

5.  Documentation
    -   Types are also useful when reading programs.
    -   Declaration can itself be part of documentation giving useful hints and behaviors
    -   Unlike descriptions, these can't be outdated.


### Interface {#interface}

1.  An application program interface (API) of a component defines how components can interact with each other.
    -   Interface has a hidden role, that is it should prevent from doing wrong things.
    -   If interfaces are poorly defined, exploitation is natural.

2.  Types in interface communicate valid usage of API.
    -   Argument types define what an API expects from the user.
    -   Return types can define what users can expect from the function.

3.  Example in C++
    ```C++
    void handleInput(Foo &) {
        ///
    }

    void handleInput(Foo *){
        ///
    }
    ```
    In the above code snippet, the first API takes a reference, there it can prevent null pointers.
    While in the second case, the API takes pointers. As a result, it can even accept `nullptr`. Therefore library has to handle cases where `nullptr` can occur.


### Dependencies in Public APIs {#dependencies-in-public-apis}

1.  In case we want to support ways to update APIs we will have to handle the cases that can break the current API.

2.  One such way to prevent breakage is by using indirection. In the above example snippet, removing pointer implementation can result in the breakage of API.

3.  Different languages can provide ways to create indirection. One such way of creating indirection is by allowing language to extend old types to new types. C++ provides `using` keyword that carries this functionality.

4.  Therefore indirection removes strict dependence on the internal types which can allow us to extend our codebase to generic cases.

5.  One such example is `std::vector` which uses different `using` declarations.

6.  The advantage of explicitly naming frequently-used or central types makes code easier to read/write and change.

7.  It also helps to reduce tight coupling iterators i.e. instead of having something defined as an iterator, we can define iterator as a type that has \`begin\` and \`end\`. As a result, it loosens the coupling that was already present.
    ```C++
    void sort(std::vector<int> &Vec) {} // Restricted to vectors only.
    ```

To widen the scope, we can change the sort to use `start` and `end`

```C++
template<typename T>
void sort(T* Start, T* End) {}

template<typename Iterator>
void sort(Iterator Start, Iterator End) {}
```

Using such indirection allows flexibility in the API.


### Conclusion 1: Well thought out type indirections allow flexible API design {#conclusion-1-well-thought-out-type-indirections-allow-flexible-api-design}

1.  It thinks about the user perspective.
2.  Provides less breakage when things are to be upgraded.


### Usability of Interface {#usability-of-interface}

1.  Easy to use while hard to misuse
    1.  Should be designed from the users' point of view. Therefore design can turn out to be difficult.
    2.  Small changes if causes catastrophic failures on the users' side, it isn't a good API.


### Design Problems {#design-problems}

1.  API may want to satisfy different constraints for different users. It may want to accommodate a larger surface. Without a well-thought design, introducing a larger surface may introduce bugs.
2.  One example is trying to satisfy multiple features through a single API.
    ```C++
    struct RobotLeftArm {
      Coordinates calculateCent(); // ambiguous name. calculateCent can be center of
                                   // gravity or centroid of some mesh
      float value();               // Can represent force of robot
    private:
      float Value = 10; // 10N force

      // Center of coordinate relative to global coordinate
      Coordinates Coord{10, 10};
    };
    ```


### Communication through API {#communication-through-api}

```c++
// An api that is defined to convert the left armed robot to right armed robot
Robot RobotLeftArmToRightArm(RobotLeftArm &Left);
// As a result we may want to modify values.
```

1.  In case different features are tangled, variable or function names may confuse the user side. How can we prevent such confusion?
    -   Type system can check this based on the data type that is being passed to the function.
    -   But, another way is we can split the features into different APIs depending upon the feature required.
        Breaking can be done in following way.
        ```C++
        struct Centroid {
          virtual Coordinates calculateCent() = 0;
        }

        struct BodyPart {
          float value();

        private:
          // ....
        };

        // Here robot now left arm inherits from robot body part and as it's own
        // centroid.
        struct RobotLeftArm : public BodyPart, Centroid {};
        ```

If we want to change our implementation from `...(RobotLeftArm& Left){}` to take it taking somebody part, we will have to think of a way to not break the previous API.
Implementing this way, we can assure that the conversion function requires something that is a body part and the user won't be confused with the centroid. Therefore the user can understand converting from one part to another requires passing values.

```c++
Robot RobotLeftArmToRightArm(BodyPart &Part);
```

However, this introduces some design issues that can be the root of future problems.

Therefore one way to resolve conflicts is to move to higher APIs.


### Hiding Usage to bring clear meaning {#hiding-usage-to-bring-clear-meaning}

In some cases, we can hide some values that are required inside a further abstraction. Hiding it this way, we can remove the dependence from the previous examples.


## Enforcing configurations with types {#enforcing-configurations-with-types}


### Making configurable {#making-configurable}

1.  Even if the algorithms and data structure have the same underlying concepts, they can be used in different contexts and use cases.
    -   Example: A system that has a core part and few configurable parts.
    -   OS kernel can be core and everything on top of the kernel as configurable parts.

2.  Therefore, programs can have some reusable skeletons and specific configurations.
    -   Allowing specific configuration enables users to switch their programs (algorithms/data structure) as necessary.

3.  To enable such configuration in our design, we will have to think of the configurable design. We can have a data structure that can implement a specific algorithm. Depending on the use case, we may want to switch the algorithms.
    -   Consider a case of vector, which can take arbitrary sorting function. In this example, we can divide the sorting function into `Unsorted`, `StableSort`, `Sorted`. In stable sort, the algorithms do not swap positions.

    -   Using a type system, we can implement a sorting function to take any arbitrary type that supports start and begin.

    -   As a result, our vector implementation can take some type "T" . Using the type interface system, we can create other different subtypes.
        ```C++
        template <typename T, void SortingAlgorithm(typename std::vector<T>::iterator,
                                                    typename std::vector<T>::iterator)>
        class SortedVectorImpl {
          using Container = std::vector<T>;

        public:
          using reference = typename Container::reference;
          using size_type = typename Container::size_type;

          SortedVectorImpl() = default;
          template <typename InputIt>
          SortedVectorImpl(InputIt Begin, InputIt End)
              : Storage(std::forward<InputIt>(Begin), std::forward<InputIt>(End)) {
            sort();
          }

        private:
          Container storage;
        };
        ```

    -   In the above snippet, the code takes in a sorting algorithm. Here, `std::vector<T>` is our container. We define some references along with the type of reference that gets inherited from another type. It is then easier to understand the relationship even if we are creating something generic.

    -   The above snippet can lead to a problem because it can break the sorting value if we don't handle sorting when new data are inserted.

    -   As we insert new data, we will have to sort them too.
        ```C++
                template <typename... ArgTypes> inline void emplace_back(ArgTypes &&...Args) {
                  Storage.emplace_back(strd::forward<ArgTypes>(Args)...);
                  sort();
                }
        ```

    -   Consequently, the algorithm will sort the new data points and ensure that our vector is always sorted.

    -   We also need to think of cases where users can change our variant. As a result, we need to prevent data mutation in those cases where mutability can break our API and semantics.
        ```C++
        inline const reference operator[](size_type Pos) { return Storage[Pos]; }
        ```


### Design trade-off {#design-trade-off}

1.  Delegation vs Inheritance
    -   Delegation implies a "has-a" relationship
        -   Used in cases when we want to copy functionality without causing "is-a" horse
        -   Example is a wooden horse and a table can share a similar functionality as both have 4 legs. Therefore, it will be good if we can create some delegation to the table instead of inheriting from it.
        -   It limits the API to only things that are public ultimately forcing the API to prevent from breaking.

    -   Inheritance implies an "is-a" relationship
        -   Inheritance can cause composition where it may be possible to get full API from the parent.
        -   As a result, we will have to check everything.


### Key Insight 1 {#key-insight-1}

1.  Factorize the functionality into smaller configurations that can be chosen by the user.
2.  These small configurations can be combined with a base skeleton template. Generally, base skeletons are a nonconfigurable part of the project.


### Introducing Restrictions {#introducing-restrictions}

1.  Sometimes our design can bring hidden constraints to the system
    -   We may sometimes over constrain most things
    -   In other cases, we may introduce generic behavior at the risk of behavior
2.  There may be cases where we are passing in some type and expecting the type to bear the required data attribute or feature (functions). In such cases, if the type doesn't have the requirements it may break the system.
3.  Other cases may introduce some semantic requirements. When we define algorithms we are hopeful that users will meet the semantics of the algorithms. In case the semantics do not match, such generic code may not behave as they intend to.


## Ensuring Invariance {#ensuring-invariance}


### Invariant {#invariant}

1.  A property of function or object that remains constant even after application of some transformation
2.  Invariance specifies a guarantee about the program state after an operation.
3.  Example: Some algorithms or data structures should guarantee that the program state remains the same even after applying some transformation. Consider a case we are creating a sorted vector, the invariance is the property that the vector remains sorted.
4.  Requires pre-condition match post-condition.


### Necessity of Invariant property {#necessity-of-invariant-property}

1.  In cases where invariant is necessary. Games should update the frame at the same time despite the clock cycle. Otherwise, a faster machine will have faster gameplay while a slower one will have performance lag.
2.  One example highlighting necessity of invariant
    ```C++
    void updateTimePassedSinceLastFrame(int TimePassed) { CurrentTimeValue += TimePassed; }
    ```
3.  Here, the addition is performed based on the integer addition which is dependent on the clock cycle. Therefore, in the case of slower clock cycles, seconds may go out of bounds.
    ```C++
    void resetCooldown(int Seconds){gui->setClockSeconds(Seconds)};

    void actionCallback() {
      TimeCounter Counter;
      resetCooldown(Counter.timePassed());
    }
    ```

Using `int` to represent the time creates an issue where an invariant property of seconds is broken.


### Preserving Invariant property {#preserving-invariant-property}

1.  One way to prevent invariant is by introducing types that can bound seconds in the range \\(0 \leq t \leq 59\\) and enforce this property across the API.

2.  Depending on the language constructs allows forcing the type assertion tests when creating a new object of the type. This assertion protects the invariant property as per our requirements.


### Maintaining on large codebases {#maintaining-on-large-codebases}

1.  Requires heavy refactoring. In some cases, the tool-chain can allow us to change these kinds of stuff.
2.  Practical tips:
    -   In standard C++ libraries allow creating ratios from which we can define further types.


### Lesson: Prevent mishaps using type systems {#lesson-prevent-mishaps-using-type-systems}


### Implementation tip: Implicit conversion {#implementation-tip-implicit-conversion}

One way to do is by defining operator conversion operator constructor itself.

```C++
constexpr operator Distance<OtherRatio>() const {
  return Distance<OtherRatio>(Val * Ratio::num / Ratio::den * OtherRatio::den /
                              OtherRatio::num);
}
```

We can see that a constructor that is not declared "explicit" allows implicit conversion (converting constructor). Another thing is user-defined conversion function can also act as a conversion operator;

```C++
#include <iostream>

struct To {
  To() = default;
  To(int value) : value(value) {}
  // To(const struct From &data) {} // converting constructor
  void print() { std::cout << "The value in To is: " << value << std::endl; }

private:
  int value;
};

struct From {
  From(int val) : value(val) {}
  operator To() const { return To(this->value); } // conversion function
  void print() { std::cout << "The value in From is: " << value << std::endl; }
  int getValue() { return value; }

private:
  int value;
};

int main() {
  From f(10);
  f.print();
  To t1(0);
  t1.print();
  t1 = f;
  t1.print();
  To t2 = f;
  t2.print();
}
```

This snippet highlights how implicit conversion takes place when creating `t2` from `f`. Instead of calling the copy constructor, the copy function gets called. However, if there is something already present in the `To` type, then it will call the value from `To` type


## Functional Abstractions {#functional-abstractions}


### Ways to solve a problem using computers {#ways-to-solve-a-problem-using-computers}

1.  One has to think about the conceptual part of the problem.
2.  Then, one has to figure out ways to express the solution in a targeted programming language

Even though these things look independent, they are not. The difficulty of implementation depends on the paradigm or language features.


### Functional abstraction {#functional-abstraction}

1.  These provide a construct to lift our design from _imperative style_ (how something should be done) to _declarative style_ (what should be done.)
2.  In some cases, functional style allows us to be more expressive. One such case is in `haskell`
    ```haskell
    doubleOdds :: [Int] -> [Int]
    doubleOdds Dataset = map multiplyBy2 (filter isOdd Dataset)

    multiplyBy2 :: Int -> Int
    multiplyBy2 n = n * 2

    isOdd :: Int -> Bool
    isOdd n = (mod n 2) == 1
    ```
    The idea here is that even if the syntax is wrong, it's easy to understand that code is trying to multiply the returned list from the filtered dataset by 2.

    Doing the same in  `C++` creates a verbose construct.


### Advantages with a declarative approach {#advantages-with-a-declarative-approach}

1.  Allows checking small modules in parts, i.e. every function is independently testable
    -   Testing a function once can guarantee that behavior remains the same throughout the life cycle of software
2.  Allows decomposing high-level ideas into smaller functions that create composability.


### Pure Functions {#pure-functions}

1.  A pure function is something that has no side effects. It should return identical values for identical arguments.
2.  If a function doesn't return anything then such a function can't be pure at all. Also, the returned value of the pure function should be used wherever it was called.
3.  C++ allows creating pure function using `[[ nodiscard ]]`


### Benefits of using Pure function {#benefits-of-using-pure-function}

1.  No side effects: Identical values always return identical types.
2.  Debugging: It is easier because we don't have to worry about the global state.
3.  Doesn't have callbacks (calling other functions)
4.  It is easy to create parallelism since the function is pure and doesn't depend on the global state. This purity can break if the same data is passed to all these functions
5.  Composability: Meaning functions can be combined to further higher-order style.


### Higher-order function {#higher-order-function}

1.  Higher-order function is a function that takes a function and returns a function.
2.  It achieves the following things:
    1.  Allows capturing high-level concepts or patterns into the reusable skeleton
    2.  Introduces configuration options as a result of specific functions being passed to it.
3.  Higher-order functions provide a mental overview of how things are done.


### Examples of Higher-order function {#examples-of-higher-order-function}

1.  _Map_ It takes in a list of arguments and a function. Then it applies the function to each value in the list.

2.  _Filter_ It takes a list of arguments and a function (predicate) and returns another list that satisfies the predicate.

3.  _Fold (or reduce)_ takes in a function, a list of arguments, and initial value in a defined order and then computes the final result.
    1.  _Fold left_ Applies function from left to right. It starts at the front.
    2.  _Fold right_ Applies function from right to left. It starts from the back.

        In both of these cases, the binary function takes the initial value _z_ and applies the function until it reaches the end of the function.


### Language construct and Potential bugs {#language-construct-and-potential-bugs}

In some cases, `C++` reducing can execute things in any arbitrary order. As a result, it can result in some complicated issues. But the language construct allows the specifying the execution policy.

```C++
std::string listToString(const std : vector<std::string> &Strings) {
  return std::accumulate(std::next(Strings.begin(), strings.end()),
                         Strings.front(),
                         [](std::string Current, const std::string &Next) {
                           return std::move(Current) + ", " + Next;
                         });
}
```

In languages like `Rust` pattern matching plays role where it allows us to define the case for `none` and case for `Some`. By default in `C++` such things can't occur because the above function can take in empty vector or `nullptr` and which can result in undefined behavior.

```rust
fn listToString(strings: Vec<&str>) -> String {
    match strings.first() {
        None => return "".to_string(),
        Some(first_string) => {
            return strings
                .iter()
                .skip(1) // skip the first string because we already did pattern matching.
                .fold(first_string.to_string(), |current, next| {
                    current + " " + next
                });
        }
    }
}
pub fn main() {
    let result = listToString(vec!["I", "am", "doing", "great"]);
    println!("{:?}", result);
}
```

The reason is because in `rust`,

```rust
pub fn first(&self) -> Option<&T> {
    //....
}
```

The first returns an option that may or may not contain any value.


### Purity of Higher-Order Functions {#purity-of-higher-order-functions}

1.  The purity of higher-order functions depends on the function that is being passed to it as an argument.
2.  A higher-order function is pure if and only if,
    1.  The higher-order function itself meets the pureness guarantees, i.e shouldn't have side effects
    2.  All the functions passed to it should be pure


### Implementation C++ {#implementation-c-plus-plus}

1.  In C++ higher order functions can be represented as lambdas or function objects.
2.  A function object is a class that has defined call operator "`()`".
    ```C++
    struct isAwesome {
      bool operator()(const int value) const { return value <= 100 && value >= 90; }
    };

    bool AwesomeCars(const std::vector<Car> &Cars) {
        return std::all_of(Cars.begin(), Cars.end(), isAwesome{});
    }
    ```

In the above snippet `isAwesome{}` is a function object.

1.  Even these function objects can be templated to work depending on the value it receives or even be extended to introduce runtime configurations.


### Partial Function {#partial-function}

1.  These are functions that allows us to pass in less than the full number of arguments required to a function.
2.  In programming languages like Haskell, there is concept called as currying.
    ```haskell
    mySub:: Int -> Int -> Int
    mySub a b = (-) a b
    myAdd20 =  mySub (-20)
    mySub 20 (-22)
    myAdd20 22
    ```
    In this example, `myAdd20` is a function that has it's `a` parameter loaded with `-20`

    -   In this process, `haskell` enables partial function application by representing the function in curried form.

    -   By currying, the function that takes multiple arguments in its tuple is transformed into a function that takes a single argument and returns another function.

    -   In other languages, these are to be explicitly defined.


### Implementation details {#implementation-details}

-   Create a wrapper that accepts a function as well as arguments.
-   The constructor is responsible for creating a function object and a tuple of arguments
-   Overload a call operator that returns the curried function.
    -   The overload handles the case when the function should be called and when a curried form should be returned.

<!--list-separator-->

- <span class="org-todo todo TODO">TODO</span>  Write code


### Algebraic Data Types {#algebraic-data-types}

1.  _Product types_ where severally potentially different types can be grouped. The value space is the cartesian product of the different value spaces of these combined types.
    -   Examples: Tuple, Pair, Record
2.  _Sum Types_ can take one type at a time which are chosen from a fixed set of different types.
    -   Examples: Union, Variant, Optional

Variants are like `enums` in `Rust` which can be useful in creating certain patterns such as visitor patterns.


### Expression problem {#expression-problem}


#### Premise {#premise}

-   Consider C++: In cases, one needs to extend the old code base, for example, modify the parent class at the root of the inheritance tree, it may cause issues because one may have to change in multiple places and recompile the existing code.

-   This problem is also present in functional programming languages because we have to modify existing functions to handle new types.

-   Insightful problem because it helps understand the difference between procedural data abstraction and abstract data types.

-   In OOP. It's easy to add new types but hard to add new operations

-   In functional style: It's easy to add new operations but hard to deal with type.

More on: [Expression Problem](https://eli.thegreenplace.net/2016/the-expression-problem-and-its-solutions/)


#### Multiple Dispatch {#multiple-dispatch}

-   A feature that allows function or method to be dynamically dispatched based on the run-time type of it and its arguments.

-   C++ requires using tricks such as multiple inheritances, virtual inheritance, and dynamic type checking.

-   On the other hand languages like `julia` support it out of the box. They allow us to define an abstract class and depending on the runtime value dispatch appropriate function


## Computing with types {#computing-with-types}


### Motivation {#motivation}

1.  Large machines may also take time to compute things.
2.  Compute what is required rather than compute every operation.
3.  Hide computational complexity from the user.

To tackle the above requirement, we can use compile-time computations to perform a task such that most of the things are calculated during compilation. On the other hand, we can also compute and build optimized data structures at compile time.

Doing so can improve runtime performance as well.


### Computing Fibonacci sequence at compile time. {#computing-fibonacci-sequence-at-compile-time-dot}

```C++
tempate <> struct fib<0> {
    enum {value = 0};
}
template <> struct fib<1> {
    enum {value = 1};
}

template <int n> struct fib {
    enum {value = fib<n - 1>::value + fib<n-2>::value}:
}
```

In the above snippets, we are using `enum` to hold values. This process doesn't require memorization because everything will happen at compile time.

The template acts as a function-like mechanism that takes in some value as a template parameter and passes it into another template.

This chaining is a powerful construct that allows us to compute using the type definition at compile time.

Therefore, extending types allows us to create procedures that can be evaluated at the compile time.


### Complicated example List {#complicated-example-list}

1.  From functional construct, we can consider `list` as a data structure that has its base value where it is empty. To add to a list, we can extend its head to point to a new value.
2.  We can achieve the same idea using templates.
    First, we have to define a type that represents an empty list. We can always attach the empty list to the end.
    ```C++
    struct ListEnd {};
    ```
    Expanding from this construct we can create a list as
    ```C++
    template <typename HeadTy, typename TailTy = ListEnd>
    struct TypeList {
        using Head = HeadTy;
        using Tail = TailTy;
    }
    ```

Now we have basic definition of a list. Therefore we can define functions that allows adding and removing elements from the list.

```C++
template<typename ListTy, typename T> struct Prepend {
    using List = TypeList<T, ListTy>;
}
```

Notice how we have added an element of type T on the head of the list. This function will now create a new type. Here the function is not a normal function but the type `Prepend` itself.

Likewise we can also define functions for popping an element from list.

```C++
template <typename ListTy> struct PopFront {
    using List = typename ListTy::Tail;
}
```

Here list will borrow the type that is present in the tail.

Based on these constructs, we can expand to other functions such as `append.` We can add functionalities to `print` type name and `popback` an element from end of list.


### Metaprogramming constructs for C++ {#metaprogramming-constructs-for-c-plus-plus}

1.  Variadiac Templates &gt; allows working with the abstract concept of a list of types.
2.  Fold expression `...` which allows expanding over parameter pack. Variadic templates combined with Folds `...` form powerful constructs that allow effortlessly writing generic code.
3.  `constexpr` it doesn't mean constant. It refers to an expression that can be computed at the compile time.
    -   However, it requires knowing certain values at the compile time.
    -   `if constexpr` is extension over `constexpr` to ease writing conditionals for generic code.
4.  `consteval` specifies that a function is an immediate function, that is, every call to it produces some compile-time constant.


### Exposing APIs and Benchmarking {#exposing-apis-and-benchmarking}

1.  As we create something that is known at compile-time, we may want to provide easy APIs to the user. Providing easy APIs means that users can use them without worrying about the details.
2.  Another good way to understand the performance of the algorithm is by benchmarking.
    -   We can benchmark for different options.
    -   As a result, we can automatically check for different factors that are present within the program to run the analysis to find the best possible combination.
    -   Benchmarking makes it easier to provide the best default configuration that can work in the general case.


### Lookup tables {#lookup-tables}

1.  Creating a lookup reduces the computation cost for operations that take a large time to compute. This happens because we are allowed to look up pre-computed values from the table.

2.  This comes at a trade-off for which our binary will include the lookup table with it which increases the binary size.

3.  Another potential drawback is that we will be expending resources on compile time.


### Optimized data structure {#optimized-data-structure}


#### Motivation {#motivation}

1.  We may want to optimize some part of the problem where computations are expensive and want to delay computation for a larger part.


#### Solution {#solution}

1.  Express the computation as a computation graph and proceed with computation from there.
2.  As a result, the computation graph will only perform the required computation whenever data is passed into the system.
