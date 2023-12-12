+++
title = "Notes on Generic Programming - II: Generic Programming"
author = ["En logger"]
date = 2021-09-10
draft = false
+++

## Generic Programming: Generating part of programs {#generic-programming-generating-part-of-programs}


### Introduction {#introduction}

1.  _Generic Programming_: Programming with generic parameters to avoid unnecessary code duplication and encourage code reuse.
    -   Polymorphism is also another technique to solve code reuse

2.  Puts implicit constraints on the generic types that are to be fulfilled by concrete types.

<!--listend-->

```C++
template<typename T>
T adder(T LHS, T RHS) {
    return LHS + RHS;
}
struct Foo {
    inv Val = 0;
}
Foo f = adder<Foo>(Foo{}, Foo{}):
```

In this code snippet, we assume that `Foo` meets the requirement that it has `+` operator implemented. If it doesn't compiler will shout at you.

This example shows that generic programming focuses on some plugin layouts.


### Requirements for Generic Type {#requirements-for-generic-type}

1.  Syntactic Requirements
    1.  These define the operational requirements that a generic type should fulfill.
        -   Examples: operators supported by `T`, where a function is callable on `T`, does `T` support default constructor or not, etc.

2.  Semantic Requirements
    1.  These define the logical properties that a generic code should fulfill. In case we need additional, we should assure that our type supports the commutative property. There may also come a situation where our type should have an order fulfilled. Otherwise, our generic code may break because of flawed semantics. One such example is designing balanced binary trees for the line-segment intersection.

    2.  Semantics are tricky to implement and detect. These can hide in the corner cases that will ultimately produce errors.


### Art of writing generic code {#art-of-writing-generic-code}

1.  Start looking for patterns where different types are implementing similar functions. If these functions are common for all types, then it means we can implement generic code. Introducing generic code allows creating an elegant codebase.
2.  During the implementation of generic code, we need to decide whether it can satisfy the general use cases.
    1.  There are times when we may want to copy values, while other times we may require to move them. Therefore, when it is necessary to move a value, we have to make sure our generic stuff will work only when the move operation is well defined.
    2.  Another situation may be when algorithms will have no dependence on the type of data structure being used. That is the semantics of the algorithm can work for every general case. In such cases, it will be wise to write generic code.
    3.  In cases our implementation will have conflicting behaviors. For example, as we compare one string with another string, we may use different constraints unlike comparing one int to another. Therefore, we have to now think of ways how we can relate these things.
3.  Once we are clear with our constraints and requirement we can easily implement the generic interface.
4.  Lifting the requirements to the user level allows the users to write the generic part or specify the constraints they want.
5.  In case it's not easy to customize things, we can introduce implicit requirements.


## Case Handling for Generic code {#case-handling-for-generic-code}


### Motivation {#motivation}

1.  Generic program tends to generic solution for problems that are usable with all types.
2.  However, there will be cases that won't fit as expected.
3.  We can make the type fit by specializing our generic implementation
4.  Therefore, we may want to specialize our program so that it can fit non-generic cases.


### Specialization {#specialization}

Different programming languages should offer different features for handling generic specialization. `C++` offers template specialization. These come in different forms such as:

1.  Specialized Function template
    -   Requires full specialization
2.  Partial class template specialization.
    -   A method that requires specialization.
        ```C++
        template <typename T, typename Comparator = std::less<>> struct GenericClass {
          T run(int Input) { return Value + Input; }

        private:
          T Value;
        };

        // Specialization for std::vector<int>
        template <typename Comparator>
        struct GenericClass<std::vector<int>, Comparator> {
          int run(int Input) {
            return std::accumulate(Value.begin(), Value.end(), 0) + Input;
          }

        private:
          std::Vector<int> Value;
        };
        ```


### Concrete example {#concrete-example}

Consider a case of specialization of a generic function sum

```C++
template <typename ContainerType>
typename ContainerType::value_type sum(const ContainerType &Container) {
  typename ContainerType::value_type Sum{};
  for (const auto &Elem : Container) {
    Sum += Elem;
  }
  return Sum;
}
```

The above function works as long as the `ContainerType` has a well defined `value_type`. Using `typename ContainerType::value_type`, we are accessing the information of the type of values that are stored in container. `Sum{}` is just calling the constructor for required `value_type.`

This function will not work when we pass a c-style array. After all array is also a container. To fulfill the requirement we will need some specialization.

```C++
template <typename ValueType, std::size_t Size>
ValueType sum(const ValueType (&Array)[Size]) {
  ValueType Sum{};
  for (const auto &Elem : Array) {
    Sum += Elem;
  }
  return Sum;
}
```

In this specialized case, the compiler will find this construct and will compile the program. The reason it works is that we provided two different definitions, as a result, the compiler was able to find the correct definition.

[SFINAE](https://en.cppreference.com/w/cpp/language/sfinae) is a `C++` concept "Substitution Failure Is Not An Error" which applies overload resolution rules for the given template. This replaces the value with the actual type. When we add the second source, the compiler will resolve the correct function if the array is passed to `sum()`.

After `C++ 20`, we can use `concepts` to force the substitution rules and is preferred over SFINAE.


### SFINAE {#sfinae}

Nevertheless, it's a concept to be learned if we are to deal with legacy codes.

1.  If we have two functions that take in the same parameter, then at compile time because of ambiguity SFINAE can't occur. To create some failure mode for substitution we can use constructs like `std::enable_if`.
    ```C++
    template <typename ValueType, size_t Size,
              std::enable_if<Size % 4 != 0, bool> = true>
    ValueType sum(ValueType (&Array)[Size]) {
      // unoptimized implementation
    }

    template <typename ValueType, size_t Size,
              std::enable_if<Size % 4 == 0, bool> = true>
    ValueType sum(ValueType (&Array)[Size]) {
      // ptimized implementation
    }
    ```

If we pass in data where size is not 4, then in the first template, `bool` will be enabled and assigned a value of `true`. As for the second case, since the size isn't multiple of 4, there will be an error because we can't assign `true` to any arbitrary type.

Since only one of the templated functions is working, overload resolution takes place.

1.  SFINAE becomes difficult when we have to deal with multiple cases and multiple requirements.

_Note:_ As I am not extremely comfortable with SFINAE, I have linked the following resources to SFINAE.


### For Advanced Constructs and case handling. {#for-advanced-constructs-and-case-handling-dot}

1.  When we construct our generic examples, it may create some difficult cases where we may have to specialize depending on the problem scenario.
2.  Different techniques offer a different solution in such cases. One such technique is creating guards.
3.  The idea behind guards is it assures that the state is initialized upon construction and destroyed upon destruction.


### Summary {#summary}

1.  Once we handle the special cases, we will be able to support even more generic types.
    As a result, this makes our program widely applicable.
2.  Further, depending on the flags we can enable optimization and reduce memory footprints.


## Simplifying Meta-Programming {#simplifying-meta-programming}


### Motivation {#motivation}

1.  As we try to solve for generic programs, we may not have information of generic type `T`. We can't understand any of its properties. As a result, we need to find ways to handle this.
2.  Therefore to write meta-programs, we need a way to infer properties of user-defined types.


### Type traits. {#type-traits-dot}

`C++` provides us with features that allow us to control the types we are interested in. These can allow us to define the properties that can be queried in compile time.
Examples:

1.  `is_const<T>::value`, If `T` is constant, access the value of `T`.
2.  `is_same_v<T, U>`, If `T` and `U` are same then access the value

These are type-functions that can transform a type or provide information about the type.

1.  Constructing `is_same` type trait.
    First, we can define something that is false.
    ```C++
        struct FalseType {
            inline static bool value = false;
        };

        struct TrueType {
            inline static bool value = true;
        }; // alternative std::true_type;
    ```
    A `FalseType` is something that stores `false` value, while `TrueType` stores `true` value. Expanding on this construct we can now define `isSameType`.
    ```C++
        template<typename T, typename U>
        struct isSameType : FalseType {};
    ```
    Since `T` and `U` are different types, we inherit from `FalseType{}`. Forcing a template specialization,
    ```C++
        template<typename T>
        struct isSameType<T, T> : TrueType {};
        // struct isSameType<T, T> : std::true_ype {};
    ```

2.  Standard library supports a different variety of questions which allows us to query and compute complex properties for type.

3.  Type traits supported by the standard library can also aid in changing from one type to another.


### Policy Classes {#policy-classes}

1.  Define ways to inject configurable behavior into a generic function and types. In short term, the generic components of the program can be moved into policy class.

2.  Depending on the behavior we expect from a program, we want to support different features.
    One case is when we are creating a cooking library, we may want to round things to easy numbers then we can use different policies to round them
    ```C++
    struct DefaultRounding {
        static int round(double Val) {return std::round(Val);}
    }

    struct CeilRound {
        static int round(double Val) {return ceil(Val);}
    }
    // And more

    template<typename RoundingPolicy = DefaultRounding>
    Weight convertToInts(Weight X) {
        return Weight{RoundingPolicy::round(X.value())};
    }
    ```
    In the snippet, we can see that weight gets rounded off to the nearest integer.

3.  To use these policies, we can design APIs that store these values in a type-interface.
    ```C++
    struct Container {
      using RoundingPolicy = CeilRound;

    private:
      static Weight itemWeight(const Weight &W) {
        return convertToInts<RoundingPolicy>(W);
      }
    }
    ```
    In this case, the end-user can see what rounding policy is being used. As a result, we can assure that in each place where the container is used we get the same `RoundingPolicy.` The advantage is also pronounced when we are dealing with nested class hierarchy.

    Allowing us to use things in such a manner can help us detect errors in compile time.


### Type Traits and Type API {#type-traits-and-type-api}


#### Motivation of using Type Traits {#motivation-of-using-type-traits}

Using type traits we can achieve several objectives at once. These allow us to communicate properly.

```C++
template <typename Type> struct Trait {
  bool property = false; // Communicate a property value.
  std::string getFoo() {
    return "default"
  }                       // Allows us to communicate behaviors
  using OtherType = Type; // Allows aliases to communicate types.
}
```

Even traits can be specialized for certain types.


#### Use of type traits in API design {#use-of-type-traits-in-api-design}

1.  To make our code generic while assuring constraints, type traits provide us ways to deal with such requirements.
2.  The idea is to introduce indirection via traits. We can define APIs in such a way that user can extend their API as necessary. Our definition of API can document the style on what traits are required for API to function. Since the API is used throughout the codebase, users can extend upon this generic structure by specializing for their types.

    For example, we can define a container API that let's us add element to the container.
    ```C++
    template <typename ContainerType> class ContainerTrait {
    public:
      using value_type = typename ContainerType::value_type;
      static void putInContainer(ContainerType &Container,
                                 const value_type &Value) {
        Container.push_back(Value);
      }
    };
    ```
    Since we have defined how our container should behave, we can use our trait to perform further computation as desired.
    ```C++
    template <typename ContainerType>
    void GenericContainerUsage(ContainerType &Container) {
      ContainerTrait<ContainerType>::putInContainer(Container, 39);
    }
    ```
    That happens if the container doesn't support push_back?
    The answer is simple, since we have specified how containers behave and what value type they store, we can then specialize our container trait to work for cases that don't have `push_back.`
    ```C++
    template <typename... MissingTypeArgs>
    class ContainerTrait<std::set<MissingTypeArgs...>> {
      using ContainerType =
          std::set<MissingTypeArgs...>; // Define the container type
    public
      ;
      using value_type = typename ContainerTrait::value_type;
      static void putInContainer(ContainerType &Container,
                                 const value_type &Value) {
        Container.insert(Value); // Now we use specialized function.
      }
    }
    ```
    As a result, we have now working generic usage defined for a new type that wasn't previously on the system.


### Summary {#summary}

1.  These type-traits are used throughout the industry and allows us to extend our generic case.
2.  Using type traits, we can query about our type and create an API that adds extensibility to our codebase.
3.  Policy classes offer us ways to inject customization into our generic codebase.


## Building Embedding DSLs {#building-embedding-dsls}


### Motivation {#motivation}

1.  For complex library components or part of the project, the end-user may not know about the details on how to implement the given functionality.
2.  Configuration may require different parameters which may be unknown to the user. For example, data type, input range, processing functions, and so on.
3.  Therefore, the problem is a two-fold problem which is
    1.  Configuration specific
    2.  Language-specific
4.  What we want is to write in some simple way and get our result in actual code format. We want to do this so that it's easier to navigate. It also hides some dependencies and options.
5.  Therefore, the question arises on how we can build translation between 'A' and 'foreign translation language'.


### Domain-specific language. {#domain-specific-language-dot}

1.  These define a programming language that focuses on a specific domain.
2.  Offer a higher level of abstraction that is related only to the domain.
3.  Benefits:
    1.  _Efficiency_: Allows domain experts to be expressive. Therefore, it can utilize domain-related information to optimize the cases which may be difficult when considering general purpose stuff. For example, a mathematician can write normal equations which can get translated to actual code.
    2.  _Clarity_: Since DSLs allows expressiveness, it brings clarity on the ideas that are being presented. DSLs remove the necessity to boilerplate the design in the implementing language.
    3.  _Communication_: Offers a bridge between domain experts and users. Since DSLs making DSLs require domain knowledge, end users can work on specific parts of the problem without worrying about the abstraction.
    4.  _Bugs_: Without DSLs user may have to write all the parameters required for configuring a system. Having DSL removes the necessity to write these configurations. As a result, it can verify domain constraints and check them before preventing invalid configurations.


### Types of DSL {#types-of-dsl}

1.  External DSL

    1.  These are DSLs that are independent of the host general-purpose language.
    2.  They may or may not be Turing complete.
    3.  They have defined keywords and syntax.
    4.  Has higher development as well as maintenance cost.
    5.  These require their own compilers or binaries. Thus, these are complex compared to internal DSL.

    Examples: \\(\LaTeX\\), AWK, regex, etc.

2.  Embedded/Internal DSL

    1.  Implemented using host machinery.
    2.  Stay in a high-level language. Therefore can be used alongside the host language
    3.  Introduce domain concepts into the host language
    4.  These stay in the domain of the host language and use all host features. Thus, these are easier to maintain.

    Examples: jQuery, Embedded SQL, templating language, etc.


### What should DSL allow? {#what-should-dsl-allow}

1.  Provide easy to use configuration interface for the user.
    1.  The new syntax should ease users to configure the options.
    2.  Users should only be able to see the required choice.
    3.  Users should be able to pass the normal (non-configuration) part that defines the type.
    4.  Should allow users to reuse existing configuration.

2.  As we translate the user chooses to language constructor type, we have to enable the following options.
    1.  Map configuration to actual type arguments. _(Template arguments)_
    2.  Generate the type that is valid in the language domain. _(Type should be valid C++)_


## Enforcing Type Requirements {#enforcing-type-requirements}


### Motivation {#motivation}

Consider the following case.

```C++
template <class T> struct W {
  T v;
  W(T v) : v(v) {}
};

template <class T> int f(T x) { f(W<T>(x)); }

int main() {
  f(0);
  return 0;
}
```

In this seemingly harmless code, lies a bug that causes infinite recursion.

1.  In first function call, `f` takes in `0(int)` and calls itself. In that call it calls `W` as `W<int>(0).`
2.  In first recursion, `f` takes in `W<int>(0)` and calls itself. But this time, it calls `W` with
    `W<W<int>>(0).`
3.  Then it goes into infinite recursion.
4.  The idea here is template debugging is difficult because the compiler message is difficult to understand. (`Rust` has really good error messages)
5.  When building a generic function, our language construct may force us to define errors in a verbose manner that is not easily understandable by the end-user.
6.  In the case of `C++` using templates create generic types which call other generic code. This combination results in entanglement, and we need to make these coherent.
7.  Therefore, we need to find a way to make constrained generic code.

Therefore we want to achieve the following objectives:

1.  _Syntactic methods_: Make helpful error messages for the end-user.
2.  _Semantic methods_: Since these require runtime components, we will have to lift them to type level to make them work.
    -   To lift the runtime component to the compilation domain
        -   We have to use constructs and expression that gets evaluated at compile time.
        -   Another thing is that we have to define requirements.

In `C++`, we can achieve this using `concepts`


### Understanding requirements {#understanding-requirements}

One concrete examples is using xor to perform in-place swapping. Because of property of `XOR`, we can achieve this in three simple steps.

```C++
#include <iostream>
int main() {
  unsigned char X = 0b1011; // 11
  unsigned char Y = 0b1001; // 9
  std::cout << "X was: " << int(X) << " and Y was: " << int(Y) << "\n";
  std::cout << "After flipping. \n";
  X ^= Y; // flip the bits of X. Result X = 0010
  Y ^= X; // flip the bits of Y. Result Y = 1011
  X ^= Y; // flip the bits of X. Result X = 1001
  std::cout << "X is: " << int(X) << " and Y is: " << int(Y) << "\n";
}
```

To make this generic work for any type `T`, we will have to understand the property of this operation.
[XOR swap](https://en.wikipedia.org/wiki/XOR_swap_algorithm) has the proof of idea. The proof requires the value \\(A\\) and \\(B\\) to be commutative, associative, have an identity, and have a self inverse.

Therefore to express the idea in a generic form, we require our type fulfills all the semantic and syntactic properties.


### C++ Concepts {#c-plus-plus-concepts}

1.  Allows constraining the template types by explicitly defining the requirements.

2.  Benefits:
    1.  Allows defining types that an API needs to support to be used with the template.
    2.  Increases readability when names describe the requirements
    3.  Allows the compiler to produce comprehensive error messages.
    4.  Provides an easier way to remove overloads.

3.  Therefore, concepts can encode syntactic requirements and even semantic requires (if encoded correctly)
