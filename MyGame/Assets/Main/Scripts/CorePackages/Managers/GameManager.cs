using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;

public class GameManager : MonoBehaviour
{
    void Update()
    {
        ScheduleManager.Instance.Update();
    }

    public void Pause()
    {
        Time.timeScale = 0;
    }

    public void StartGame()
    {
    }

    public void Resume()
    {
        Time.timeScale = 1;
    }

    public void Quit()
    {
        Application.Quit();
    }
}
