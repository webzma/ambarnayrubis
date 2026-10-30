/** Album categories, shared by the admin select field and the public site. */
export const albumCategories = [
  { label: 'Bodas', value: 'bodas' },
  { label: 'Retratos', value: 'retratos' },
  { label: 'Familias', value: 'familias' },
  { label: 'Eventos', value: 'eventos' },
  { label: 'Maternidad', value: 'maternidad' },
  { label: 'Comercial', value: 'comercial' },
]

export const categoryLabel = (value?: string | null) =>
  albumCategories.find((category) => category.value === value)?.label ?? value ?? ''
