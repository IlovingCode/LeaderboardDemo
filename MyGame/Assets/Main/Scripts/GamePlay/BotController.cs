//using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class BotController : MonoBehaviour
{
    [SerializeField] UserProfile profile;
    [SerializeField] float attackRange;
    [SerializeField] float delta;
    [SerializeField] Transform controller;
    [SerializeField] bool autoAttack;
    TextMesh scoreTxt;
    Transform enemy;
    int score;

    void Start()
    {
        GameEvent.PLAYER_SPAWNED += OnPlayerSpawned;
        GameEvent.PLAYER_OUT += OnPlayerOut;

        var charClass = profile.charClass;
        controller.GetComponent<PlayerController>().Set(charClass.agi, charClass.str);
        controller.GetComponent<Appearance>().Set(controller.position.x < 0 ? 0 : 1, charClass.skin);

        scoreTxt = controller.GetComponentInChildren<TextMesh>();
        scoreTxt.transform.rotation = Quaternion.identity;

        enabled = autoAttack;
    }

    void OnPlayerOut(PlayerController player)
    {
        controller.GetComponent<Appearance>().PlayEmotion(player.transform == controller ? "Sad" : "Haha");
        if (player.transform != controller)
            scoreTxt.text = (++score).ToString();
    }

    void OnPlayerSpawned(PlayerController player)
    {
        if (player != controller.GetComponent<PlayerController>())
            enemy = player.transform;
    }

    void Update()
    {
        if (enemy != null
            && Mathf.Abs(enemy.position.x - controller.position.x)
            < attackRange + Random.Range(-delta, delta))
            controller.GetComponent<PlayerController>().Attack();
    }
}
