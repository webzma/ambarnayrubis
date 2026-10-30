/** "22 de diciembre de 2025". Event dates are stored at UTC midnight, so format in UTC. */
export const formatDate = (value?: string | null) =>
  value ? new Date(value).toLocaleDateString('es', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }) : null
