using UnityEngine;
using UnityEngine.UI;

public class UIManager : MonoBehaviour
{
    [SerializeField] GameObject mainMenu;
    [SerializeField] GameObject actionPhase;
    [SerializeField] GameObject transitionScreen;
    [SerializeField] Button attackBtn;
    [SerializeField] GameObject cancelBtn;
    [SerializeField] Text connectStatus;
    [SerializeField] Text P1;
    [SerializeField] Text P2;
    public static UIManager Instance;

    // Use this for initialization
    void Awake()
    {
        Instance = this;
    }

    void Start()
    {
        mainMenu.SetActive(true);
        actionPhase.SetActive(false);

        attackBtn.onClick.AddListener(() =>
        {
            GameEvent.PLAYER_ATTACK.Invoke();
        });

        GameEvent.GAME_INIT += () =>
        {
            mainMenu.SetActive(false);
            cancelBtn.SetActive(false);
            transitionScreen.SetActive(true);
        };

        GameEvent.GAME_START += () =>
        {
            actionPhase.SetActive(true);
            transitionScreen.SetActive(false);
        };

        GameEvent.GAME_OVER += () =>
        {
            actionPhase.SetActive(false);
            mainMenu.SetActive(true);
        };

        GameEvent.GAME_CONNECTED += (connected) =>
        {
            connectStatus.text = connected ? "Waiting..." : "Finding...";
        };

        UIEvent.NAME_CHANGED += (player) =>
        {
            if (player.transform.position.x < 0)
                P1.text = player.name;
            else P2.text = player.name;
        };
    }
}
