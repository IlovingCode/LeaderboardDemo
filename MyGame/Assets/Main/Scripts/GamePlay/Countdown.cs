using System;
using UnityEngine;
using UnityEngine.UI;

[RequireComponent(typeof(Text))]
public class Countdown : MonoBehaviour
{
    Text text;
    int cached;

    void Awake()
    {
        text = GetComponent<Text>();
    }

    void OnEnable()
    {
        UIEvent.COUNTDOWN_CHANGED += OnCountdown;
        text.text = String.Empty;
        cached = 1000;
    }

    void OnDisable()
    {
        UIEvent.COUNTDOWN_CHANGED -= OnCountdown;
    }

    void OnCountdown(float remain)
    {
        var t = Math.Ceiling(remain);
        if (t < cached)
        {
            cached = (int)t;
            text.text = String.Format("{0:D1}", cached);
        }
    }
}
