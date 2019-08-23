using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Networking;
using UnityEngine.Networking.Types;
using UnityEngine.Networking.Match;

public class NetworkLobbyWrapper : MonoBehaviour
{
    void Init()
    {
        if (GameSetting.Instance.useMatchMaker)
        {
            if (NetworkLobbyManager.singleton.matchMaker == null)
                NetworkLobbyManager.singleton.StartMatchMaker();
        }
        else
        {
            NetworkLobbyManager.singleton.useWebSockets = GameSetting.Instance.useWebSocket;
#if SERVER
            NetworkLobbyManager.singleton.networkAddress = "http://0.0.0.0";
#else
            NetworkLobbyManager.singleton.networkAddress = GameSetting.Instance.serverIP;
#endif
        }
    }

    public void StartServer()
    {
        Init();
        if (GameSetting.Instance.useMatchMaker)
            NetworkLobbyManager.singleton.matchMaker.CreateMatch(
                string.Empty, NetworkLobbyManager.singleton.matchSize, true, string.Empty, string.Empty, string.Empty, 0, 0, OnMatchCreate);
        else
        {
            StopAllCoroutines();
            StartCoroutine(GetPort(() =>
            {
                if (NetworkLobbyManager.singleton.StartServer())
                    Debug.Log("Start server at port " + NetworkLobbyManager.singleton.networkPort);
            }));
        }
    }

    public void StartClient()
    {
        Init();
        if (GameSetting.Instance.useMatchMaker)
            NetworkLobbyManager.singleton.matchMaker.ListMatches(0, 1, string.Empty, true, 0, 0, OnMatchList);
        else
        {
            StopClient();
            StartCoroutine(GetPort(() =>
            {
                NetworkLobbyManager.singleton.StartClient();
            }));
        }
        GameEvent.GAME_CONNECTED.Invoke(false);
    }

    public void StopClient()
    {
        StopAllCoroutines();
        NetworkLobbyManager.singleton.StopHost();
        NetworkClient.ShutdownAll();
    }

    public void SendReadyMgs()
    {
        var player = GetComponent<NetworkLobbyPlayer>();

        if (player.isLocalPlayer)
        {
            player.SendReadyToBeginMessage();
            GameEvent.GAME_CONNECTED.Invoke(true);
        }
    }

    IEnumerator GetPort(System.Action action)
    {
        var www = UnityWebRequest.Get(string.Format(
               GameSetting.Instance.portCmd,
               GameSetting.Instance.serverIP, 0, 0));

        yield return www.SendWebRequest();

        if (www.isNetworkError || www.isHttpError)
            Debug.Log(www.error);
        else
        {
            NetworkLobbyManager.singleton.networkPort = int.Parse(www.downloadHandler.text);
            if (action != null)
                action.Invoke();
        }
    }

    void OnMatchCreate(bool success, string extendedInfo, MatchInfo matchInfo)
    {
        if (success)
        {
            //Debug.Log("Create match succeeded");
            //Utility.SetAccessTokenForNetwork(matchInfo.networkId, matchInfo.accessToken);
            NetworkLobbyManager.singleton.StartHost(matchInfo);
        }
        else
        {
            //Debug.LogError("Create match failed");
        }
    }

    void OnMatchList(bool success, string extendedInfo, List<MatchInfoSnapshot> matches)
    {
        if (success && matches != null)
        {
            if (matches.Count > 0)
                NetworkLobbyManager.singleton.matchMaker.JoinMatch(
                    matches[0].networkId, string.Empty, string.Empty, string.Empty, 0, 0, OnMatchJoined);
            else
                StartServer();
        }
    }

    void OnMatchJoined(bool success, string extendedInfo, MatchInfo matchInfo)
    {
        if (success)
        {
            //Debug.Log("Join match succeeded");
            //Utility.SetAccessTokenForNetwork(matchInfo.networkId, matchInfo.accessToken);
            NetworkLobbyManager.singleton.StartClient(matchInfo);
        }
        else
        {
            //Debug.LogError("Join match failed");
        }
    }
}
