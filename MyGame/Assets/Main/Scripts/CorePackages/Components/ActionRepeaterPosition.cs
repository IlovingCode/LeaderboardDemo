using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class ActionRepeaterPosition : MonoBehaviour
{
    [SerializeField] int limit;

    [SerializeField] float Interval;
    [SerializeField] UnityEventVector3 action;
    [SerializeField] Vector3 spawnThreshold;
    int counter;
    Transform cachedTransform;
    Vector3 originThreshold;
    // Use this for initialization
    void Start()
    {
        cachedTransform = transform;
        originThreshold = spawnThreshold;
    }

    public void StopSpawning()
    {
        counter = limit;
    }

    public void Reset()
    {
        spawnThreshold = originThreshold;
    }

    void DoAction()
    {
        action.Invoke(spawnThreshold);
        counter++;
        spawnThreshold.y += Interval;
        spawnThreshold.x += Interval;
        spawnThreshold.z += Interval;
    }

    // Update is called once per frame
    void Update()
    {
        if (counter == limit)
            return;

        if (Interval > 0)
        {
            if (cachedTransform.position.x > spawnThreshold.x
             || cachedTransform.position.y > spawnThreshold.y
             || cachedTransform.position.z > spawnThreshold.z)
                DoAction();
        }
        else if (cachedTransform.position.x < spawnThreshold.x
              || cachedTransform.position.y < spawnThreshold.y
              || cachedTransform.position.z < spawnThreshold.z)
            DoAction();
    }
}
