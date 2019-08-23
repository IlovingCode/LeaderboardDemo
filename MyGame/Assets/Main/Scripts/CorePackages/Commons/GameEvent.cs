using System;

public class GameEvent
{
    public static Action GAME_INIT;
    public static Action GAME_START;
    public static Action GAME_RESET;
    public static Action GAME_OVER;
    public static Action<bool> GAME_CONNECTED;

    public static Action<PlayerController> PLAYER_SPAWNED;
    public static Action<PlayerController> PLAYER_OUT;
    public static Action PLAYER_ATTACK;
}

public class UIEvent
{
    public static Action<int, int> SCORE_CHANGED;
    public static Action<float> COUNTDOWN_CHANGED;
    public static Action<UnityEngine.GameObject> NAME_CHANGED; 
}
