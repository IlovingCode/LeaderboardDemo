using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Appearance : MonoBehaviour
{
    [SerializeField] SpriteRenderer body;
    [SerializeField] SpriteRenderer sword;
    [SerializeField] TrailRenderer trail;
    [SerializeField] Animator emotionAnim;
    // Use this for initialization
    public void Set(int id, Sprite skin)
    {
        //body.color = GameSetting.Instance.bodyColor[id];
        sword.color = GameSetting.Instance.swordColor[id];
        trail.startColor = GameSetting.Instance.swordColor[id];

        body.sprite = skin;
    }

    public void SetEnable(bool isEnabled)
    {
        trail.enabled = isEnabled;
        emotionAnim.enabled = isEnabled;
    }

    public void PlayEmotion(string id)
    {
        emotionAnim.SetTrigger(id);
    }
}
