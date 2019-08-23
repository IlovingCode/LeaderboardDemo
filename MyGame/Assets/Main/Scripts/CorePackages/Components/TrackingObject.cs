using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class TrackingObject : MonoBehaviour
{
    [SerializeField] float speed;
    [SerializeField] Transform m_target;

    [SerializeField] UnityEventTransform OnReach;
    [SerializeField] UnityEventTransform OnTracking;

    Transform cachedTransform;

    public Transform Target
    {
        set
        {
            m_target = value;
        }
        get
        {
            return m_target;
        }
    }

    public GameObject ObjectTarget
    {
        set
        {
            m_target = value.transform;
        }
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

    // Use this for initialization
    void Start()
    {
        cachedTransform = transform;
    }

    // Update is called once per frame
    void Update()
    {
        if (m_target != null)
        {
            Vector3 direction = m_target.position - cachedTransform.position;

            OnTracking.Invoke(m_target);

            if (speed != 0)
            {
                float delta = speed * Time.deltaTime;

                if (direction.sqrMagnitude < delta * delta)
                {
                    cachedTransform.position = m_target.position;
                    m_target = null;
                    OnReach.Invoke(m_target);
                }
                else
                    cachedTransform.position += direction.normalized * delta;
            }
        }
    }
}
