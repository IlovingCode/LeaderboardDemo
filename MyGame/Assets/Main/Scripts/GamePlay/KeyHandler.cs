using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class KeyHandler : MonoBehaviour
{
    [SerializeField] KeyCode code;
    [SerializeField] UnityEventInt action;

    // Update is called once per frame
    void Update()
    {
        if (Input.GetKeyDown(code))
            action.Invoke((int)code);
    }
}
