+++
title = "Animation: Kinematics"
author = ["En logger"]
date = 2021-11-05
draft = false
+++

## Introduction to Forward Kinematics {#introduction-to-forward-kinematics}

In computer animation techniques, forward kinematics uses the joint orientation and offset to propagate the animation throughout the entire skeleton.

That one line summarizes most of the computer animation.

To understand what it means, we have to understand animation. _"What is animation?"_

Good question!

We can see the renders or visuals, but animation brings these things to life. Therefore we can say animation is the process of bringing virtual objects to life!

Okay, that sounds good enough. I will improve my definition as I progress forward in the animation research.

Once we know what it means to animate - bring life to objects, one follow-up question is, _"But how does animation work?"_

There are different ways to animate the same object. The best example is life. Everything that has life can be called animated. Another is by applying natural forces to some objects such that the force makes them move or simply animated. _"Hey, we are talking about virtual objects, there is no force or life in the virtual world?""_

Since it's the virtual world, we can always create force. The complexity of these forces depends on the amount of precision and compute.

Let's focus on skeletal animation for time being. These animations are inspired by the biology of skeletons where joints are responsible for the movements of bones. In computer graphics applications, these joints are defined by either 2D or 3D coordinates in space. Once we move these joints, it will change the orientation of the bone, and as a result, we have a motion!

_"How does this change come in?"_

If we have physics-based simulation, we can apply forces on these joints! We can create muscles that control the joints.

Otherwise, these forces are something the animator does by manually adjusting the orientation.

Once we have our orientation, we will use it to calculate the skeletal pose. Then we repeat this process for different poses at different "key-frames" to define the animation. Key-frames are like checkpoints that mark the expected pose at a given time.

Once we have the key points, all we have to do is apply interpolation!

This concept is really simple, and I will discuss it further along with this series.

The only missing part _"How does know joint orientation helps estimate the pose?"_

The answer lies in **forward kinematics.**
