using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class RotateComponent : MonoBehaviour
{
    public void LookAt(Vector3 rotate)
	{
		float angle = (Mathf.Atan2(rotate.y, rotate.x) + Mathf.PI / 2) * Mathf.Rad2Deg;
		transform.eulerAngles = new Vector3(0, 0, angle);
	}
}
