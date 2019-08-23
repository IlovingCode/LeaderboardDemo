using System.Collections;
using System.Collections.Generic;
using UnityEngine;

[CreateAssetMenu]
public class GameSetting : ScriptableObject
{
    [Header("Time")]
    public float countdownTime;
    public float gameplayTime;
    [Header("Server API")]
    public bool useWebSocket;
    public bool useMatchMaker;
    public float hostDelay;
    public string serverIP;
    public string getPointsCmd;
    public string drawResultCmd;
    public string fullResultCmd;
    public string portCmd;
    [Header("Appearance")]
    public Color[] swordColor;
    public Color[] bodyColor;
    public CharacterClass[] characterClass;

    [HideInInspector] public static GameSetting Instance;
}
