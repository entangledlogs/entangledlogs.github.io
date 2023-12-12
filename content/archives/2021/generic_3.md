+++
title = "Notes on Generic Programming - III: Generative Programming"
author = ["En logger"]
date = 2021-09-20
draft = false
+++

## Product line Engineering {#product-line-engineering}


### A configurable software {#a-configurable-software}

A configurable software has different options that allow its users to chose variations from these options according to their requirements. The end result is a unique tailored binary that is customized to meet the demands of the given user.  If everything is built into a single binary, it creates bloated features that may not constrain users' requirements. Therefore, configurable software allows users to design products that are tailored to their needs.

Example: Linux kernel, Apache spark, etc.

Goals of configurable software:

1.  Should offer several/configuration options/
2.  Should allow stakeholders to _select options_
3.  Should create a tailor-made _system variant_

Therefore, configurable software is something that a software product line instead of just being software.


### Software product line {#software-product-line}

**Definition of Software pipeline**:

1.  Configurable
2.  Built from a common set of core features
3.  Should satisfy the demands of the domains or market segment it is designed for.


### Feature {#feature}

1.  _Key abstraction of application domain_
    Finds the specific part that is important for the user to change or adapt.

2.  _Represents commonalities and variability_
    A switch that can enable a specific part of the software. It can be some isolated codes if selected properly create different software.

3.  _Means of communication_
    Documentation and default values. The system can specify some values and should be able to reason about these values. The stakeholders can then try suggestions or come up with their own version.

4.  _Means to specify product variants_
    Since features can be enabled or disabled, these can allow us to distinguish different product variants.

In some situations, users can easily understand a feature while in other situations they may not. These features irrelevant to users can come up as implicit requirements based on user choice. For example, to enable X, the user should enable Y before using X.


### Domain engineering {#domain-engineering}

1.  Collect, organize, and store past user experiences when building systems for a particular domain. This can be from development or looking at existing systems.
2.  Another way to learn about a domain is by deeply analyzing the given domain.
3.  Should satisfy the requirements for stakeholders in that given domain.
4.  Can start with the most common and required feature in that domain and build upon these features.
5.  Should facilitate reuse of assets when building new systems.
6.  It focuses on two things
    1.  _Feature model_: Represents design feature space and connections on how these features are dependent upon each other.
    2.  _Reusable Design_: Design isolated and reusable components that can be part of something big. Should be extensible.


### Application engineering {#application-engineering}

1.  _Feature selection_: User selects the features from available configurations based on their requirements.
2.  _Variant generation_: Based on the selected features, the system uses the reusable design and fetches program and combines them to produce a specific software variant

A software pipeline provides means to communicate with users in situations when configurations don't fit together. The pipeline should notify the user when their configuration does not match or are incompatible.


### Feature Model {#feature-model}

1.  This area means to describe different features for a given system.
2.  Allows ways to provide a dependency relationship among these features.
3.  Can also define constraints.


#### Representation {#representation}

1.  Propositional formulas
    1.  These are a formal and machine-readable representation of features.
    2.  These allow automating the feature space and prevents enabling of some feature based on the constraints.
    3.  Aren't easily readable without formal knowledge
2.  Feature diagrams
    1.  These are informal graphical models that are easily readable by humans.
        Some common symbols are:
        -   _Filled circle_: Mandatory feature.
        -   _Unfilled circle_: Optional feature
        -   _XOR group_: Represented by unfilled arch. This means exactly one feature should be allowed.
        -   _OR group_: Represented by filled arch. Means at least 1 should be allowed.
    2.  Inner nodes represent abstract features
    3.  Leaves represent concrete features.

{{< figure src="feature_diagram.png" >}}


### Purpose of Domain analysis {#purpose-of-domain-analysis}

1.  Select and define the domain of focus
    1.  Explore different parts of the domain.
    2.  Can be flexible
2.  Collect relevant information and combine it to the domain model


### Domain model {#domain-model}

1.  Represents common properties.
2.  Represents variable properties
3.  Help understand the domain boundary and dependencies between the variable properties.

Focuses on the following properties.

1.  _Domain definition_: Without clear boundaries, it will be difficult to incorporate the software into different domains.

2.  _Domain lexicon_: Defines the most occurring vocabulary in the domain. These are the specifics and jargon of the domain.

3.  _Concept model_: Understand the formal relationship among the higher order of abstraction.

4.  _Feature models_: Understand the relationship among available features.

5.  _Domain scoping_: Understand stakeholders and goals of stakeholders.


### Summary {#summary}

The clear domain analysis allows us to design a software pipeline that can be tailored to users in the given domain.


## Generative Programming {#generative-programming}


### Feature Binding Time {#feature-binding-time}

Features can be enabled during different phases of software production and deployment.

1.  _Compile time features:_
    1.  These are features decided in compile time.
    2.  As a result, they are responsible for producing different software variants.

2.  _Runtime features_:
    1.  These are features that are baked into the program.
    2.  Are highly adaptable to execution of the program.
    3.  Can be selected interactively or automatically.

3.  _Load-time features_:
    1.  These are configuration files and binding files that are loaded when program execution starts.
    2.  Depending on the configuration, the program will change its state and enable/disable features depending on the configuration.


### Binding Modes {#binding-modes}

Features can be bound differently.

1.  _Static binding_: These call specific methods as per intention. Therefore introduce rigidity where it doesn't allow features to be rebound.

2.  _Dynamic binding_: These are features bound before use and unbound after use. A virtual polymorphic class can represent some of the ideas. Another way is using function pointers.

3.  _Changeable binding_: Features are bound between uses but have options to unbind them.

Depending on the feature binding time and bounding mode, we can drive our design to perform different things.


### Variant Generation Methods {#variant-generation-methods}

1.  Internal generators
    -   These use the language tools or internal DSLs to generate the required part of software code.
2.  External Generators
    -   Can be external programs or application that generates code.
    -   Allows combination with external DSLs.
3.  Build Systems
    -   These provide options to select different pieces during the compile-time and configuration option.
    -   Are usable with other generator methods.


### Creating Framework {#creating-framework}

1.  Understand the basic requirements of the software.
2.  Find the common parts of the programs and the common process that links these parts.
3.  Allow for options to control different items required in the process.


### Summary {#summary}

1.  Create an abstraction that helps to interconnect generated code with normal code.
2.  Internal generators are useful when we are constrained to host language and provide ways to create generators.
3.  Sometimes build system can be used to enable or disable the flags.


## Generative Domain Model {#generative-domain-model}


### Handling optional features. {#handling-optional-features-dot}

1.  Throw runtime error when the unwanted item is processed.
    -   Reduces the amount of compile-time features.
    -   To this, we may require a runtime switch.

2.  Check the requirements during compile time. This is simple to implement and to understand. The side effect user can implement the features but these are not able to compile the program.

3.  We can remove the code related to unwanted features during the compile time. Removing all the parts of the program that aren't unnecessary forces users to work with only available features. However, this idea is difficult to maintain and should be a design consideration.


### Generative Domain models. {#generative-domain-models-dot}

1.  Generative Programming
    1.  Automate manufacture of intermediate and end products.
        1.  Problem space ( Domain-specific concepts  )
        2.  Features
    2.  Configuration knowledge.
        1.  Define and encode the constraints and invalid features.
        2.  Define optimization and construction rules.
        3.  Define dependencies of the software.
            For example, if certain features (eg. NTFS) are disabled, we can remove the parts that are used to process (eg. Read/write on NTFS type) these features.
    3.  Solution Space
        1.  Elements can be combined and removes duplication (_minimum dependency_)
        2.  Understand the domain and build software that allows enabling/disabling features without worrying about breaking the system.

    4.  Allows tailoring the experience per customer and per their requirements which can improve the relationship.

Dimension of concepts and product line such that it works for different stakeholders and their requirements. Another dimension is about how these are implemented i.e how to engineer them without compromising the design and modularity.
