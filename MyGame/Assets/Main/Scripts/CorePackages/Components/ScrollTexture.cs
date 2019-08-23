using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class ScrollTexture : MonoBehaviour
{
    [SerializeField] float speed;
    [SerializeField] string textureName;
    [SerializeField] Renderer render;
    [SerializeField] Vector2 origin;

    void Start()
    {
        render.material.SetTextureOffset(textureName, origin);
    }

    public void Scroll(Vector3 target)
    {
        render.material.SetTextureOffset(textureName, target);
    }

    void Update()
    {        
        origin.y += speed * Time.deltaTime;
		Scroll(origin);
    }
}
