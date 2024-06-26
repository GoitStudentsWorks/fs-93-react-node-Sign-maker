import {
  selectMonthNotes,
  selectTodayStats,
  selectIsWaterUpdating,
  selectIsTodayLoading,
  selectIsMonthLoading,
} from 'redux-store/water/waterSelectors';
import * as operations from '../redux-store/water/waterOperations';
import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import { waterSlice } from 'redux-store/water/waterSlice';

export const useWater = () => {
  const dispatch = useDispatch();
  const todayStats = useSelector(selectTodayStats);
  const monthNotes = useSelector(selectMonthNotes);
  const isWaterUpdating = useSelector(selectIsWaterUpdating);
  const isTodayLoading = useSelector(selectIsTodayLoading);
  const isMonthLoading = useSelector(selectIsMonthLoading);

  const updateStoreByDailyNorma = dailyNorma =>
    dispatch(waterSlice.actions.updateByDailyNorma(dailyNorma));

  const resetWaterStore = () => dispatch(waterSlice.actions.resetValues());

  const fetchTodayStats = useCallback(
    () => dispatch(operations.fetchTodayStats()),
    [dispatch]
  );

  const fetchMonthStats = useCallback(
    currentMonth => dispatch(operations.fetchMonthStats(currentMonth)),
    [dispatch]
  );

  const addWater = waterNote =>
    dispatch(operations.addWater(waterNote)).unwrap();

  const updateWater = waterNote =>
    dispatch(operations.updateWater(waterNote)).unwrap();

  const deleteWater = waterNote =>
    dispatch(operations.deleteWater(waterNote)).unwrap();

  return {
    todayStats,
    monthNotes,
    isWaterUpdating,
    isTodayLoading,
    isMonthLoading,
    fetchTodayStats,
    fetchMonthStats,
    addWater,
    updateWater,
    deleteWater,
    updateStoreByDailyNorma,
    resetWaterStore,
  };
};
