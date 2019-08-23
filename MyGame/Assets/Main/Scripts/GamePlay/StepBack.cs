using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class StepBack : MonoBehaviour
{
    [SerializeField] float onHitDelta;
    Transform cachedTransform;

    public float Speed { get; set; }
    public float Delta
    {
        get { return onHitDelta; }
        set { onHitDelta = value; }
    }
    // Use this for initialization
    void Awake()
    {
        cachedTransform = transform;
    }

    // Update is called once per frame
    void Update()
    {
        if (Speed > 1f)
        {
            Speed *= onHitDelta;
            cachedTransform.Translate(Vector3.left * Speed * Time.deltaTime);
        }
    }
}
