using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class SnapPosition : MonoBehaviour
{
    [SerializeField] bool X;
    [SerializeField] bool Y;
    [SerializeField] bool Z;
    // Use this for initialization
    public void Snap(Vector3 target)
    {
        if (!X) target.x = transform.position.x;
        if (!Y) target.y = transform.position.y;
        if (!Z) target.z = transform.position.z;

        transform.position = target;
    }

    public void Snap(Transform target) { Snap(target.position); }

}
