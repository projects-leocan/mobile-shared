export const findUpdates = (prev, next) => {
  const updates = next.filter(planning => {
    const previous = prev.find(p => p.id === planning.id)
    if (!previous) {
      return false
    }
    if (previous.is_priority !== planning.is_priority && planning.is_priority === 1) {
      return true
    }
    return false
  })

  if (!updates || !updates.length) {
    return null
  }

  const indexed = updates.reduce((acc, n) => ({
    ...acc,
    [n.id]: n
  }), {})


  return indexed
}
