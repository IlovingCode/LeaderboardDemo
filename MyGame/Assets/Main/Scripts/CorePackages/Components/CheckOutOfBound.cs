using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class CheckOutOfBound : MonoBehaviour
{
    [SerializeField] Collider col;
    [SerializeField] UnityEventGameObject action;
    Transform cachedTransform;

    public Collider Bound
    {
        set
        {
            col = value;
        }

        get
        {
            return col;
        }
    }

    // Use this for initialization
    void Awake()
    {
        cachedTransform = transform;
    }

    // Update is called once per frame
    void Update()
    {
        if (!col.bounds.Contains(cachedTransform.position))
            action.Invoke(gameObject);
    }
}
