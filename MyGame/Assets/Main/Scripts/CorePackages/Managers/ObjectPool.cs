using UnityEngine;
using System.Collections;
using System.Collections.Generic;


public static partial class Extension
{
    public static GameObject Spawn(this GameObject obj, Transform parent, bool isChild = true)
    {
        if (isChild)
        {
            var instance = PoolManager.Instance.Spawn(obj);
            instance.transform.parent = parent;
            instance.transform.localPosition = Vector3.zero;
            instance.transform.localRotation = Quaternion.identity;
            return instance;
        }
        else
        {
            return Spawn(obj, parent.position, parent.rotation);
        }
    }
    public static GameObject Spawn(this GameObject obj, Vector3 pos, Quaternion rot)
    {
        var instance = PoolManager.Instance.Spawn(obj);

        instance.transform.position = pos;
        instance.transform.rotation = rot;

        return instance;
    }

    public static void Kill(this GameObject obj)
    {
        PoolManager.Instance.Kill(obj);
    }
}

class PoolManager : Singleton<PoolManager>
{
    Dictionary<GameObject, ObjectPool> poolMap;

    public PoolManager()
    {
        poolMap = new Dictionary<GameObject, ObjectPool>();
    }

    public GameObject Spawn(GameObject obj)
    {
        if (!poolMap.ContainsKey(obj))
            poolMap[obj] = new ObjectPool(obj);

        return poolMap[obj].Get();
    }

    public void Kill(GameObject obj)
    {
        var it = poolMap.Values.GetEnumerator();

        do it.Current.Return(obj);
        while (it.MoveNext());
    }
}

class ObjectPool
{
    List<GameObject> m_AvaliableObject;
    List<GameObject> m_DispatchedObjects;

    GameObject m_origin;

    protected ObjectPool()
    {
        m_AvaliableObject = new List<GameObject>();
        m_DispatchedObjects = new List<GameObject>();
    }

    public ObjectPool(GameObject origin) : this()
    {
        m_origin = origin;
    }

    public GameObject Get()
    {
        GameObject l_instance = null;

        if (m_AvaliableObject.Count == 0)
        {
            l_instance = GameObject.Instantiate(m_origin);
        }
        else
        {
            l_instance = m_AvaliableObject[m_AvaliableObject.Count - 1];
            m_AvaliableObject.Remove(l_instance);
        }

        m_DispatchedObjects.Add(l_instance);

        return l_instance;
    }

    public void Return(GameObject instance)
    {
        if (instance != null && m_DispatchedObjects.Contains(instance))
        {
            m_DispatchedObjects.Remove(instance);
            m_AvaliableObject.Add(instance);
        }
    }

    public void ReturnAll()
    {
        while (m_DispatchedObjects.Count > 0)
        {
            Return(m_DispatchedObjects[m_DispatchedObjects.Count - 1]);
        }
    }

    public void Clear()
    {
        ReturnAll();

        for (int i = 0; i < m_AvaliableObject.Count; i++)
        {
            GameObject l_obj = m_AvaliableObject[i];

            if (l_obj != null)
            {
                GameObject.DestroyImmediate(l_obj);
            }
        }

        m_AvaliableObject.Clear();
        m_DispatchedObjects.Clear();
    }
}
