using System.Collections;
using System.Collections.Generic;
using UnityEngine;

enum Rule
{
    Random,
    RoundRobin
}

public class ListPicker : MonoBehaviour
{
    [SerializeField] GameObject[] objList;
    [SerializeField] Rule rule;
    int currentId;

    public GameObject Get()
    {
        if (objList.Length == 1)
            return objList[0];

        currentId = rule == Rule.Random
        ? Random.Range(0, objList.Length)
        : (currentId++) % objList.Length;

        return objList[currentId];
    }
}
