/**
 * Rental Pricing Service
 * Calculates rental cost based on vehicle daily rate and number of days
 */

/**
 * @param {Object} vehicle - Vehicle document with dailyRate, weekdayRate, weekendRate, securityDeposit
 * @param {string|Date} startDate
 * @param {string|Date} endDate
 * @returns {{ totalDays: number, totalCost: number, securityDeposit: number, breakdown: Object }}
 */
const calculateRentalCost = (vehicle, startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const msPerDay = 1000 * 60 * 60 * 24;
  const totalDays = Math.max(1, Math.round((end - start) / msPerDay));

  const dailyRate = vehicle.dailyRate || vehicle.weekdayRate || 1000;
  const securityDeposit = vehicle.securityDeposit || 0;

  const totalCost = dailyRate * totalDays + securityDeposit;

  return {
    totalDays,
    totalCost,
    securityDeposit,
    dailyRate,
    breakdown: {
      days: totalDays,
      ratePerDay: dailyRate,
      subtotal: dailyRate * totalDays,
      deposit: securityDeposit,
      total: totalCost
    }
  };
};

module.exports = { calculateRentalCost };
