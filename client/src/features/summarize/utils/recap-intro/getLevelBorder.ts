export function getLevelBorder(level: number) {
  const levelBorders = [
    1, 30, 50, 75, 100, 125, 150, 175, 200, 225, 250, 275, 300, 325, 350, 375, 400, 425, 450, 475,
    500,
  ];
  return levelBorders.findLastIndex((val: number) => level >= val) + 1;
}
