using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.Networking;
using System;

[NetworkSettings(sendInterval = 0)]
public class Player : NetworkBehaviour
{
    [SerializeField] TextMesh indicator;
    [SerializeField] PlayerController playerController;
    [Header("Auto")]
    [SerializeField] bool autoAttack;
    [SerializeField] float attackRange;
    [SerializeField] float delta;

    Appearance appearance;
    Transform playerTransform;
    Transform enemy;
    int hostInputCount = 0;
    float hostDelay = 0;

    [SyncVar] UserProfile profile;

    IEnumerator Start()
    {
        if (isLocalPlayer)
        {
            CmdSendProfile(Profile.Instance.userProfile);
            GameEvent.PLAYER_ATTACK += OnAttackClick;
        }
        else
        {
            autoAttack = false;
        }

        while (profile.isNull)
            yield return null;

        gameObject.name = profile.name;

        if (isServer)
        {
            playerController.enabled = true;
            appearance.SetEnable(false);
        }

        if (isClient)
        {
            indicator.text = string.Empty;
            indicator.transform.rotation = Quaternion.identity;
            appearance.SetEnable(true);
            var charClass = profile.charClass;
            playerController.Set(charClass.agi, charClass.str);
            appearance.Set(transform.position.x < 0 ? 0 : 1, charClass.skin);
            UIEvent.NAME_CHANGED.Invoke(gameObject);
        }
    }

    void Awake()
    {
        GameEvent.PLAYER_OUT += OnPlayerOut;
        UIEvent.SCORE_CHANGED += OnScoreChanged;
        UIEvent.NAME_CHANGED += OnNameChanged;

        appearance = playerController.GetComponent<Appearance>();
        playerTransform = playerController.transform;
    }

    void OnDestroy()
    {
        GameEvent.PLAYER_OUT -= OnPlayerOut;
        UIEvent.SCORE_CHANGED -= OnScoreChanged;
        UIEvent.NAME_CHANGED -= OnNameChanged;

        if (isLocalPlayer)
            GameEvent.PLAYER_ATTACK -= OnAttackClick;
    }

    void OnNameChanged(GameObject player)
    {
        if (player.transform != transform)
            enemy = player.transform.GetChild(0);
    }

    void OnPlayerOut(PlayerController player)
    {
        RpcPlayEmotion(player == playerController ? "Sad" : "Haha");
    }

    void OnScoreChanged(int score1, int score2)
    {
        indicator.text = (transform.position.x < 0 ? score1 : score2).ToString();
    }

    [ClientRpc]
    void RpcPlayEmotion(string id)
    {
        appearance.PlayEmotion(id);
    }

    void OnAttackClick()
    {
        if (isServer)
            hostInputCount++;
        else
            CmdAttack();
    }

    [Command]
    void CmdAttack()
    {
        playerController.Attack();
    }

    [Command]
    void CmdSendProfile(UserProfile _profile)
    {
        profile = _profile;
    }

    void Update()
    {
        if (autoAttack && enemy != null
        && Mathf.Abs(enemy.position.x - playerTransform.position.x)
        < attackRange + UnityEngine.Random.Range(-delta, delta))
            GameEvent.PLAYER_ATTACK.Invoke();

        if (isServer && hostInputCount > 0)
        {
            if (hostDelay > 0)
                hostDelay -= Time.unscaledDeltaTime;
            else
            {
                hostDelay = GameSetting.Instance.hostDelay;
                hostInputCount--;
                CmdAttack();
            }
        }
    }
}
