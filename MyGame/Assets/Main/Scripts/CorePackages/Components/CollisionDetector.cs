using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class CollisionDetector : MonoBehaviour
{
    [SerializeField] string targetTag;
    [SerializeField] UnityEventGameObject action;
    // Use this for initialization
    void OnTriggerEnter2D(Collider2D col)
    {
        if (col.tag == targetTag)
        {
            action.Invoke(col.gameObject);
        }
    }

    void OnCollisionEnter2D(Collision2D col)
    {
        if (col.transform.tag == targetTag)
        {
            action.Invoke(col.gameObject);
        }
    }

    void OnTriggerEnter(Collider col)
    {
        if (col.tag == targetTag)
        {
            action.Invoke(col.gameObject);
        }
    }

    void OnCollisionEnter(Collision col)
    {
        if (col.transform.tag == targetTag)
        {
            action.Invoke(col.gameObject);
        }
    }
}
