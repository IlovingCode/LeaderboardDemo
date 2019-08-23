using UnityEngine;
using UnityEngine.SceneManagement;

public class BootLoader : MonoBehaviour
{
    public enum BootType
    {
        AUTO,
        SERVER,
        CLIENT,
        COUNT
    }

    [SerializeField] GameSetting gameSetting;
    [SerializeField] BootType bootType;
    // Use this for initialization
    void Awake()
    {
        GameSetting.Instance = gameSetting;

        if (bootType == BootType.AUTO)
        {
#if SERVER
            SceneManager.LoadScene(BootType.SERVER.ToString());
#else
            SceneManager.LoadScene(BootType.CLIENT.ToString());
#endif
        }
        else if (bootType != BootType.COUNT)
            SceneManager.LoadScene(bootType.ToString());
    }
}
