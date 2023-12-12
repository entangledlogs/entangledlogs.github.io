+++
title = "Quaternions"
author = ["En logger"]
date = 2021-09-23
draft = false
katex = true
+++

To visualize quaternions in the fanciest way, visit [Ben eater, Quaternion](https://eater.net/quaternions).

Euler angles suffer from a problem of gimbal lock. When rotating around a 3-perpendicular axis in euclidean space, if either two of these axes align i.e becomes parallel, it causes gimbal lock. Once the object is locked, the object will lose one degree of freedom for rotation.
This [video](https://youtu.be/zc8b2Jo7mno) provides an intuitive explanation of the problem.


## Pitfalls {#pitfalls}

-   When converting the Euler angle to a quaternion, it will lose some information. For example, Rotating about the x-axis for \\(720^\circ\\) will be equivalent to performing \\(0^\circ\\) rotation about the x-axis.
-   When the amount of rotation is necessary, quaternions can't preserve this information. For most computer graphics tasks, we can avoid this.


## Representation of Unit Quaternion {#representation-of-unit-quaternion}

-   A unit quaternion of form \\(w + x\hat{i} + y\hat{j} + z\hat{k}\\), can represent a 3D rotation of any object in the space. The alternative form is angle axis representation
    \\[(\theta,(x, y, z)) = \cos(\theta/2) + \sin(\theta/2)(x\hat{i} + y\hat{j} + z\hat{k})\\]
-   Property:
    For a given angle and axis, rotating about the negative angle and negated axis is the same as rotating about the given angle and axis.


## Operations and Conversions {#operations-and-conversions}


### Addition: {#addition}

Simple and straight forward. Add angles with angles, and axis with axis.
     \\[q\_1  = w\_1 + x\_1\hat{i} + y\_1\hat{j} + z\_1\hat{k}\\]
     \\[q\_2  = w\_2 + x\_2\hat{i} + y\_2\hat{j} + z\_2\hat{k} \\]
     \\[q\_1 + q\_2 = (w\_1 + w\_2) + (x\_1 + x\_2)\hat{i} + (y\_1 + y\_2)\hat{j} + (z\_1 + z\_2)\hat{k}\\]
     Or,
     \\[[\theta\_1, (x\_1, y\_1, z\_1)] + [\theta\_2, (x\_2, y\_2, z\_2)] =
        [(\theta\_1 + \theta\_2) + (x\_1 + x\_2, y\_1 + y\_2, z\_1 + z\_2)]\\]


### Multiplication: {#multiplication}

Quaternion multiplication is associative but not commutative. Using     angle-axis  notation, we can represent multiplication in easy terms
    \\[q\_1 = (\theta\_1, \boldsymbol{a\_1}), \textnormal{where} \boldsymbol{a\_1} = x\_1\hat{i} + y\_1\hat{j} + z\_1\hat{k}\\]
    \\[q\_2 = (\theta\_2, \boldsymbol{a\_2}), \textnormal{where} \boldsymbol{a\_2} = x\_2\hat{i} + y\_2\hat{j} + z\_2\hat{k}\\]
    Now,
    \\[q\_1q\_2 = (\theta\_1\theta\_2 - \boldsymbol{a\_1\cdot a\_2}, \theta\_1\boldsymbol{a\_2} + \theta\_2\boldsymbol{a\_1} + \boldsymbol{a\_1 \times a\_2})\\]

Note: Multiplying two quaternions results in adding the rotation.


### Inverse {#inverse}

To calculate the inverse of the quaternions.

-   Find the magnitude as:
    \\(|q| = \sqrt{w^2 + x^2 + y^2 + z^2}\\)
-   Then,
    \\(q^{-1} = \left(\dfrac{1}{|q|}\right)^2(\theta, -\boldsymbol{a}) = \left(\dfrac{1}{|q|}\right)^2 q^\*\\), where \\(q^\*\\) represents conjugate


### From Quaternion to Euler angle {#from-quaternion-to-euler-angle}

```python
def quat2euler(quat):
    """Requires quaternion in form of [w, x, y, z]"""
    w, x, y, z = quat
    test = x * y + z * w
    if test > 0.499:  # singularity at north pole
        yaw = 2 * np.arctan2(x, w)
        pitch = np.pi / 2
        roll = 0
        return np.array([roll, yaw, pitch]) * 180 / np.pi

    if test < -0.499:  # singularity at south pole
        yaw = -2 * np.arctan2(x, w)
        pitch = -np.pi / 2
        roll = 0
        return np.array([roll, yaw, pitch]) * 180 / np.pi

    sqx = x * x
    sqy = y * y
    sqz = z * z
    yaw = np.arctan2(2 * y * w - 2 * x * z, 1 - 2 * sqy - 2 * sqz)
    pitch = np.arcsin(2 * test)
    roll = np.arctan2(2 * x * w - 2 * y * z, 1 - 2 * sqx - 2 * sqz)

    return np.array([roll, yaw, pitch]) * 180 / np.pi
```

The [link](https://www.euclideanspace.com/maths/geometry/rotations/conversions/quaternionToEuler/) to original Java implementation.


### From Euler angles to Quaternions {#from-euler-angles-to-quaternions}

```python
def euler2quat(angle):
    """Requires angle in order of Z, Y, X
    """
    yaw = angle[:, 0]
    pitch = angle[:, 1]
    roll = angle[:, 2]
    cy = np.cos(yaw * 0.5);
    sy = np.sin(yaw * 0.5);
    cp = np.cos(pitch * 0.5);
    sp = np.sin(pitch * 0.5);
    cr = np.cos(roll * 0.5);
    sr = np.sin(roll * 0.5);

    w = cr * cp * cy + sr * sp * sy;
    x = sr * cp * cy - cr * sp * sy;
    y = cr * sp * cy + sr * cp * sy;
    z = cr * cp * sy - sr * sp * cy;

    return np.array([w, x, y, z]).T
```

-   The [link](https://en.wikipedia.org/wiki/Conversion_between_quaternions_and_Euler_angles#Euler_angles_to_quaternion_conversion) to original implementation.


### Quaternions to Matrix transformations {#quaternions-to-matrix-transformations}

```python
def quat2mat(quat):
    qw = quat[:, 0]
    qx = quat[:, 1]
    qy = quat[:, 2]
    qz = quat[:, 3]

    sqrx = np.square(qx)
    sqry = np.square(qy)
    sqrz = np.square(qz)

    rot = np.zeros((quat.shape[0], 3, 3))
    rot[:, 0, 0] = 1.0 - 2.0 * (sqry + sqrz)
    rot[:, 0, 1] = 2.0 * (qx * qy - qz * qw)
    rot[:, 0, 2] = 2.0 * (qx * qz + qy * qw)

    rot[:, 1, 0] = 2.0 * (qx * qy + qz * qw)
    rot[:, 1, 1] = 1.0 - 2.0 * (sqrx + sqrz)
    rot[:, 1, 2] = 2.0 * (qy * qz - qx * qw)

    rot[:, 2, 0] = 2.0 * (qx * qz - qy * qw)
    rot[:, 2, 1] = 2.0 * (qy * qz + qx * qw)
    rot[:, 2, 2] = 1.0 - 2.0 * (sqrx + sqry)
    return rot
```

This conversion is found in every standard text book.


### Angle-axis representation {#angle-axis-representation}

It comes form the fact that:
\\[[ \cos(\theta/2), a\_x\sin(\theta/2), a\_y\sin(\theta/2), a\_z\sin(\theta/2)]^T = [w, x, y, z]^T\\]

```python
def angleaxis(quat):
    qw = quat[:, 0]
    qx = quat[:, 1]
    qy = quat[:, 2]
    qz = quat[:, 3]
    mag = np.sqrt(qw ** 2 + qx ** 2 + qy ** 2 + qz ** 2)
    angle = 2 * np.arccos(qw / mag)
    sin_factor = np.sqrt(1.0 - (qw / mag) ** 2)
    sin_factor[sin_factor == 0] = 1e-4
    axis = np.array([qx, qy, qz]) / sin_factor
    return angle.T, axis.T
```
