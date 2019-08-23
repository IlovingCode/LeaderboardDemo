using System;
using UnityEngine;
using UnityEngine.UI;

[RequireComponent(typeof(Text))]
public class Timer : MonoBehaviour
{
    Text text;
    int cached;

    void Awake()
    {
        text = GetComponent<Text>();
    }

    void OnEnable()
    {
        UIEvent.COUNTDOWN_CHANGED += OnTimer;
        text.text = String.Empty;
        cached = 1000;
    }

    void OnDisable()
    {
        UIEvent.COUNTDOWN_CHANGED -= OnTimer;
    }

    void OnTimer(float remain)
    {
        var t = Math.Ceiling(remain);
        if (t < cached)
        {
            cached = (int)t;
            var timeSpan = TimeSpan.FromSeconds(t);
            text.text = String.Format("{0:D1}:{1:D2}", timeSpan.Minutes, timeSpan.Seconds);
        }
    }
}
