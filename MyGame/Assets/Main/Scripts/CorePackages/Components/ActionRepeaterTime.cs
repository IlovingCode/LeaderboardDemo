using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class ActionRepeaterTime : MonoBehaviour
{
    [SerializeField] int limit;
    public float Delay;
    [Range(0, 60f)] public float Interval;
    [SerializeField] UnityEventNone action;
    int counter;
    float time;

    public void StopSpawning()
    {
        counter = 0;
    }

    void OnEnable()
    {
        counter = limit;
        time = Delay;
    }

    void Update()
    {
        if (time < 0)
        {
            if (counter != 0)
            {
                action.Invoke();
                time = Interval;
            }
            else
                enabled = false;

            if (counter > 0)
                counter--;
        }
        else
            time -= Time.deltaTime;
    }
}
