using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class CameraController : MonoBehaviour
{
    [Header("Cooldown")]
    [SerializeField] Vector3 start;
    [SerializeField] Vector3 end;
    [SerializeField] float duration;

    [Header("Follow")]
    [SerializeField] Vector3 min;
    [SerializeField] Vector3 max;
    [SerializeField] Transform P1;
    [SerializeField] Transform P2;

    Transform cachedTransform;
    float maxD;
    Camera main;

    void Start()
    {
        cachedTransform = transform;
        main = GetComponent<Camera>();
        UIEvent.COUNTDOWN_CHANGED += OnCountdown;
        enabled = false;

        GameEvent.GAME_START += () =>
        {
            UIEvent.COUNTDOWN_CHANGED -= OnCountdown;
            maxD = Mathf.Abs(P1.position.x - P2.position.x);
            enabled = true;
        };

        GameEvent.GAME_OVER += () =>
        {
            UIEvent.COUNTDOWN_CHANGED += OnCountdown;
            P1 = P2 = null;
            enabled = false;
        };

        UIEvent.NAME_CHANGED += (player) =>
        {
            if (player.transform.position.x < 0)
                P1 = player.transform.GetChild(0);
            else P2 = player.transform.GetChild(0);
        };
    }

    void OnDisable()
    {
        OnCountdown(0);
    }

    void OnCountdown(float remain)
    {
        var t = Vector3.Lerp(end, start, remain / duration);
        main.orthographicSize = t.z;
        t.z = cachedTransform.position.z;
        cachedTransform.position = t;
    }

    void Update()
    {
        if (P1 != null && P2 != null)
        {
            var d = Mathf.Abs(P1.position.x - P2.position.x);
            var t = Vector3.Lerp(min, max, d / maxD);
            t.x = (P1.position.x + P2.position.x) / 2;

            main.orthographicSize = t.z;
            t.z = cachedTransform.position.z;
            cachedTransform.position = t;
        }
    }
}
