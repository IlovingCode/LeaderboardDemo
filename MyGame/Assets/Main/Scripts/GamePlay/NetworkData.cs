using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Networking;

[NetworkSettings(sendInterval = 0)]
public class NetworkData : NetworkBehaviour
{
    PlayerController player1;
    //PlayerController player2;
    bool isPlaying;
    float cachedCountdown = 1000;
    int cachedScore = 0;
    string name1;
    string name2;

    [SyncVar] int score1;
    [SyncVar] int score2;
    [SyncVar] float countdown;

    void Start()
    {
        if (isServer)
        {
            isPlaying = false;
            name1 = name2 = string.Empty;
            countdown = GameSetting.Instance.countdownTime;

            if (!GameSetting.Instance.useMatchMaker)
                StartCoroutine(SendPort());
        }

        if (isClient)
        {
            GameEvent.GAME_INIT.Invoke();
        }
    }

    void Update()
    {
        if (isServer)
        {
            if (countdown > 0)
            {
                countdown -= Time.deltaTime;
                if (countdown <= 0)
                    OnCountDownEnd();
            }
        }

        if (isClient)
        {
            if (countdown < cachedCountdown)
            {
                cachedCountdown = countdown;
                UIEvent.COUNTDOWN_CHANGED.Invoke(countdown);
            }
            else if (countdown > cachedCountdown)
            {
                cachedCountdown = countdown;
                if (!isServer)
                    GameEvent.GAME_START.Invoke();
            }

            if (cachedScore != score1 + score2)
            {
                cachedScore = score1 + score2;
                UIEvent.SCORE_CHANGED.Invoke(score1, score2);
            }
        }
    }

    void Awake()
    {
        GameEvent.PLAYER_SPAWNED += OnPlayerSpawned;
        GameEvent.PLAYER_OUT += OnOut;
        GameEvent.GAME_OVER += OnGameOver;
    }

    void OnDestroy()
    {
        GameEvent.PLAYER_SPAWNED -= OnPlayerSpawned;
        GameEvent.PLAYER_OUT -= OnOut;
        GameEvent.GAME_OVER -= OnGameOver;

        if (isClient)
            GameEvent.GAME_OVER.Invoke();
    }

    void OnPlayerSpawned(PlayerController player)
    {
        if (player.transform.position.x < 0)
        {
            player1 = player;
            name1 = player.transform.parent.gameObject.name;
        }
        else
        {
            //player2 = player;
            name2 = player.transform.parent.gameObject.name;
        }
    }

    void OnOut(PlayerController player)
    {
        if (player == player1) score2++;
        else score1++;
    }

    void OnCountDownEnd()
    {
        if (isPlaying)
        {
            GameEvent.GAME_OVER.Invoke();
        }
        else
        {
            countdown = GameSetting.Instance.gameplayTime;
            isPlaying = true;
            GameEvent.GAME_START.Invoke();
        }
    }

    void OnGameOver()
    {
        StopAllCoroutines();
        var winner = score1 > score2 ? name1 : name2;
        var loser = score1 > score2 ? name2 : name1;

        if (score1 == score2)
        {
            StartCoroutine(SendMatchResult(null, null));
        }
        else
        {
            StartCoroutine(SendMatchResult(winner, loser));
        }
    }

    IEnumerator SendPort()
    {
        var www = UnityWebRequest.Get(string.Format(GameSetting.Instance.portCmd,
                GameSetting.Instance.serverIP,
                System.Diagnostics.Process.GetCurrentProcess().Id,
                NetworkLobbyManager.singleton.networkPort));
        yield return www.SendWebRequest();
    }

    IEnumerator SendMatchResult(string winner, string loser)
    {
        UnityWebRequest www;
        if (winner == null || loser == null)
        {
            www = UnityWebRequest.Get(string.Format(
                GameSetting.Instance.drawResultCmd,
                GameSetting.Instance.serverIP,
                System.Diagnostics.Process.GetCurrentProcess().Id));
        }
        else
        {
            www = UnityWebRequest.Get(string.Format(
                GameSetting.Instance.fullResultCmd,
                GameSetting.Instance.serverIP,
                System.Diagnostics.Process.GetCurrentProcess().Id,
                winner, loser));
        }
        yield return www.SendWebRequest();
        NetworkLobbyManager.singleton.StopHost();
    }
}

#if !UNITY_2018
public static partial class Extension
{
    public static AsyncOperation SendWebRequest(this UnityWebRequest www)
    {
        return www.Send();
    }
}
#endif