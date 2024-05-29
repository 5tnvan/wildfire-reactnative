/**
 * FUNCTION: calculateSum()
 * RETURN: { totalSumEth }
 **/
export const calculateTotalViews = (data: any[]) => {
  return data.reduce((total, item) => total + item.view_count, 0);
};