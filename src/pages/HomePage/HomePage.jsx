import React, { useEffect } from 'react';
import css from './HomePage.module.css';
import { DailyNorma } from '../../components/DailyNorma/DailyNorma';
import { WaterRatioPanel } from '../../components/WaterRatioPanel/WaterRatioPanel';
import Calendar from '../../components/Сalendar/calendar';
import { TodayWaterList } from '../../components/TodayWaterList/TodayWaterList';
import { useWater } from 'hooks/useWater';

const HomePage = () => {
  const { fetchTodayStats } = useWater();

  useEffect(() => {
    fetchTodayStats();
  }, [fetchTodayStats]);

  // useEffect(() => {
  //   const now = new Date();
  //   const monthParam = `${now.getFullYear()}-${(now.getMonth() + 1)
  //     .toString()
  //     .padStart(2, '0')}`;
  //   fetchMonthStats(monthParam);
  // }, [fetchMonthStats]);

  return (
    <section className={css.section_HomePage}>
      <h1 className="visually-hidden" aria-label="Water tracker">
        Water tracker join us
      </h1>
      <div className={'container'}>
        <div className={css.container_HomePage}>
          <div className={css.container_daliNorma}>
            <DailyNorma />
            <WaterRatioPanel />
          </div>

          <div className={css.container_MonthStats}>
            <TodayWaterList />

            <Calendar />
            {/* <PopUpCalendar /> */}
            {/* <CalendarContainer /> */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomePage;
