using UnityEngine;
using UnityEngine.EventSystems;
using UnityEngine.Events;

public class ClickHandler : MonoBehaviour, IPointerClickHandler
{
    [SerializeField] UnityEvent OnSingleClick;
    [SerializeField] UnityEvent OnDoubleCLick;

    public void OnPointerClick(PointerEventData pointerEventData)
    {
        if (pointerEventData.clickCount == 1)
        {
            OnSingleClick.Invoke();
            Debug.Log("Click");
        }
            
		else
			OnDoubleCLick.Invoke();

    }
}