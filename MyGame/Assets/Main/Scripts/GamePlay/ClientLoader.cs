using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class ClientLoader : MonoBehaviour
{
    [SerializeField] GameObject manager;

    void Awake()
    {
        if (Camera.main == null)
            Instantiate(manager).name = manager.name;
    }
}
