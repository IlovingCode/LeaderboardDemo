using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class MoveComponent : MonoBehaviour
{
    [SerializeField] Vector2 velocity;
    [SerializeField] Vector2 accel;
    Transform cachedTransform;
    Vector2 origin;

    void Awake()
    {
        cachedTransform = transform;
        origin = cachedTransform.position;
    }

    public Vector3 Veclocity
    {
        get
        {
            return velocity;
        }
        set
        {
            velocity = (Vector2)value;
        }
    }

    public void Jump(float vY)
    {
        if (accel.y != 0)
            return;
            
        velocity.y += vY;
        accel.y = Physics2D.gravity.y;
    }

    public void OnGround()
    {
        accel.y = 0;
        velocity.y = 0;
        origin.x = cachedTransform.position.x;
        cachedTransform.position = origin;
    }

    // Update is called once per frame
    void Update()
    {
        if (accel != Vector2.zero)
            velocity += accel * Time.deltaTime;

        if (velocity != Vector2.zero)
            cachedTransform.Translate(velocity * Time.deltaTime);
    }
}
