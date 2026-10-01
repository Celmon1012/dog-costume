/** Zero-based index before the next dog is added (0 = first dog). */
export function computeRoundAndOrder(totalBeforeAdd: number) {
  const roundNumber = Math.floor(totalBeforeAdd / 10) + 1;
  const displayOrder = (totalBeforeAdd % 10) + 1;
  return { roundNumber, displayOrder };
}

export function formatUniqueDogId(sequenceNumber: number) {
  return `DOG-${String(sequenceNumber).padStart(3, "0")}`;
}
