using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class GameEventTrigger : MonoBehaviour
{
    [SerializeField] string[] eventName;
    // Use this for initialization
    void OnEnable()
    {
        for (int i = 0; i < eventName.Length; i++)
        {
            var e = typeof(GameEvent).GetField(eventName[i]).GetValue(null);
            ((System.Action)e).Invoke();

            enabled = false;
        }
    }
}
