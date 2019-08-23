using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Spawner : MonoBehaviour {
[SerializeField] ListPicker obj;
[SerializeField] ListPicker spawnPos;
[SerializeField] bool isChild;

	public void Spawn()
	{
		obj.Get().Spawn(spawnPos.Get().transform, isChild);
	}
}
