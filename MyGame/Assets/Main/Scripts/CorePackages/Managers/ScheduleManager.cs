using System.Collections.Generic;
using UnityEngine;

public partial class ScheduleManager : Singleton<ScheduleManager>
{
    List<Timer> SchedulerList;
    public ScheduleManager()
    {
        SchedulerList = new List<Timer>();
    }

    public static void CreateScheduler(float interval, System.Func<float> action)
    {
        if (interval > 0 && action != null)
        {
            var schedule = new Scheduler(interval, action);
            Instance.SchedulerList.Add(schedule);
        }
    }

    public static void CreateRepeater(float interval, System.Func<float, float> action)
    {
        if (interval > 0 && action != null)
        {
            var repeater = new Repeater(interval, action);
            Instance.SchedulerList.Add(repeater);
        }
    }

    public void Reset()
    {
        SchedulerList.Clear();
    }

    public void Update()
    {
        int i = 0;
        while (i < SchedulerList.Count)
        {
            if (SchedulerList[i].Update())
                SchedulerList.RemoveAt(i);
            else
                i++;
        }
    }
}