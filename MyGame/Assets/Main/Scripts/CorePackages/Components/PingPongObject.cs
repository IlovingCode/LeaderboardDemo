using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class PingPongObject : MonoBehaviour
{
    [SerializeField] float speed;
    [SerializeField] float length;
    [SerializeField] float limit;
    [SerializeField] UnityEventNone OnLimit;
    Transform cachedTransform;
    Vector3 origin;
    float t;
    // Use this for initialization
    void Awake()
    {
        cachedTransform = transform;
        //origin = cachedTransform.position;
    }

    void OnEnable()
    {
        t = 0;
        origin = cachedTransform.position;
    }

    public float Speed
    {
        set
        {
            speed = value;
        }
        get
        {
            return speed;
        }
    }

    // Update is called once per frame
    void Update()
    {
        t += Time.deltaTime * speed;
        if (Mathf.Abs(t) > limit)
        {
            t = t > 0 ? limit : -limit;
            OnLimit.Invoke();
        }
        cachedTransform.position = origin + (t > 0 ? Vector3.right : Vector3.left) * Mathf.PingPong(t, length);
    }
}
