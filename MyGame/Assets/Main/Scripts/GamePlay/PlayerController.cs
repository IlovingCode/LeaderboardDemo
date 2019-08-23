using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class PlayerController : MonoBehaviour
{
    [SerializeField] float onHitSpeed;
    [SerializeField] float trackingSpeed;
    [SerializeField] float moveDelta;
    [SerializeField] Transform pivot;

    Transform target;


    TrackingObject trackingObject;
    StepBack stepBack;
    Animator animator;
    Vector2 startPos;

    void Awake()
    {
        stepBack = GetComponent<StepBack>();
        trackingObject = GetComponent<TrackingObject>();
        animator = GetComponent<Animator>();
    }

    void Start()
    {
        var checkOutOfBound = GetComponent<CheckOutOfBound>();

        checkOutOfBound.Bound = GameObject.FindWithTag("Floor").GetComponent<BoxCollider>();
        startPos = transform.position;

        trackingObject.enabled = true;
        stepBack.enabled = true;
        animator.enabled = true;
        checkOutOfBound.enabled = true;
        GetComponent<BoxCollider2D>().enabled = true;
        GetComponentInChildren<Rigidbody2D>().bodyType = RigidbodyType2D.Kinematic;

        GameEvent.GAME_RESET += Reset;
        GameEvent.PLAYER_SPAWNED += OnPlayerSpawned;
        GameEvent.GAME_START += StartMatch;
    }

    void OnDestroy()
    {
        GameEvent.GAME_RESET -= Reset;
        GameEvent.PLAYER_SPAWNED -= OnPlayerSpawned;
        GameEvent.GAME_START -= StartMatch;
    }

    public void Set(float agi, float str)
    {
        stepBack.Delta -= (str - 0.5f) / 10f;
        moveDelta += (agi - 0.5f) / 10f;
    }


    void StartMatch()
    {
        GameEvent.PLAYER_SPAWNED.Invoke(this);
    }

    void OnPlayerSpawned(PlayerController player)
    {
        if (player != this)
        {
            target = player.pivot;
            OnReach();
        }
    }

    void Reset()
    {
        transform.position = startPos;
        trackingObject.Speed = trackingSpeed;
        stepBack.Speed = 0;
    }

    public void OnHit()
    {
        stepBack.Speed = onHitSpeed;
        trackingObject.Speed = trackingSpeed;
        animator.SetTrigger("Idle");
    }

    public void OnReach()
    {
        trackingObject.Target = target;
        trackingObject.Speed = trackingSpeed;
    }

    void OnEnable()
    {
        trackingObject.Speed = trackingSpeed;
        stepBack.Speed = 0;
    }

    void OnDisable()
    {
        trackingObject.Speed = 0;
    }

    public void IncreaseSpeed()
    {
        if (trackingObject.Speed < onHitSpeed)
            trackingObject.Speed *= moveDelta;
    }

    public void OnOut()
    {
        GameEvent.PLAYER_OUT.Invoke(this);
        GameEvent.GAME_RESET.Invoke();
    }

    public void Attack()
    {
        animator.SetTrigger("Attack");
    }
}
