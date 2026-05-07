export function calculateAnnualSavings(monthly: number) {
  return monthly * 12;
}

export function calculateTotalSavings(
  recommendations: any[]
) {
  return recommendations.reduce(
    (acc, item) => acc + item.savings,
    0
  );
}