using System.Collections.Generic;
using UnityEngine;

public partial class ScheduleManager
{
    internal abstract class Timer
    {
        protected float timer;
        internal abstract bool Update();
    }
    internal class Scheduler : Timer
    {
        System.Func<float> DoJob;
        internal Scheduler(float interval, System.Func<float> job)
        {
            DoJob = job;
            timer = interval;
        }
        internal override bool Update()
        {
            if (timer > 0)
                timer -= Time.deltaTime;
            else
            {
                timer = DoJob();
                return timer < 0;
            }

            return false;
        }
    }
    internal class Repeater : Timer
    {
        System.Func<float, float> DoJob;
        internal Repeater(float interval, System.Func<float, float> job)
        {
            DoJob = job;
            timer = interval;
        }
        internal override bool Update()
        {
            if (timer > 0)
            {
                timer = DoJob(timer - Time.deltaTime);
                return timer < 0;
            }

            return false;
        }
    }
}