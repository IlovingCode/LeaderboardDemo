using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.Networking;

[System.Serializable]
public struct UserProfile
{
    public string name;
    public float agi;
    public float str;
    public bool isNull
    {
        get
        {
            return string.IsNullOrEmpty(name) || agi == 0 || str == 0;
        }
    }

    public int charID
    {
        get
        {
            var charList = GameSetting.Instance.characterClass;
            for (int i = 0; i < charList.Length; i++)
            {
                if (charList[i].str > str)
                {
                    return str < 0.5f ? i : (i - 1);
                }
            }

            return charList.Length - 1;
        }
    }

    public CharacterClass charClass
    {
        get
        {
            return GameSetting.Instance.characterClass[charID];
        }
    }
}

public class Profile : MonoBehaviour
{
    [SerializeField] InputField inputField;
    [SerializeField] Text points;
    [SerializeField] Slider slider;
    [SerializeField] SpriteRenderer[] skinList;
    public UserProfile userProfile;
    public static Profile Instance;

    // Use this for initialization
    IEnumerator Start()
    {
        Instance = this;
        userProfile.name = PlayerPrefs.GetString("playerName", userProfile.name);
        inputField.text = userProfile.name;
        OnAttributeChanged(slider.value);

        yield return GetPoints();
    }

    public void OnAttributeChanged(float value)
    {
        for (int i = 0; i < skinList.Length; i++)
            skinList[i].color = Color.gray;

        userProfile.agi = value;
        userProfile.str = 1 - value;

        skinList[userProfile.charID].color = Color.white;
    }

    public void OnNameChanged(string _name)
    {
        userProfile.name = _name;
        StopAllCoroutines();
        StartCoroutine(GetPoints());
    }

    IEnumerator GetPoints()
    {
        var www = UnityWebRequest.Get(string.Format(GameSetting.Instance.getPointsCmd,
                   GameSetting.Instance.serverIP,
                   userProfile.name));

        yield return www.SendWebRequest();

        if (www.isNetworkError || www.isHttpError)
        {
            Debug.Log(www.error);
        }
        else
        {
            int t = 0;
            points.text = string.Empty;
            if (int.TryParse(www.downloadHandler.text, out t))
                points.text = www.downloadHandler.text;
        }
    }
}
