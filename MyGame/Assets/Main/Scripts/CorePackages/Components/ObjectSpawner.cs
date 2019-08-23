using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class ObjectSpawner : MonoBehaviour
{
    // Use this for initialization
    [SerializeField] GameObject SpawnedObject;
    [SerializeField] Transform spawnPosition;
    [SerializeField] bool spawnAsChild;

    ObjectPool objectPool;
    GameObject last;

    void Start()
    {
        if (!spawnAsChild)
            objectPool = new ObjectPool(SpawnedObject);
    }

    public void ReturnObject(GameObject obj)
    {
        obj.SetActive(false);
        objectPool.Return(obj);
    }

    public void SpawnSelf()
    {
        last = Spawn(spawnPosition);
    }

    public GameObject Spawn(Transform spawnPos)
    {
        if (SpawnedObject != null)
        {
            if (spawnAsChild)
            {
                last = (GameObject)Instantiate(SpawnedObject, spawnPos);
                last.SetActive(true);
                return last;
            }
            else
            {
                last = objectPool.Get();
                last.SetActive(true);
                last.transform.position = spawnPos.position;
                last.transform.rotation = spawnPos.rotation;
                return last;
            }
        }

        return null;
    }
}
