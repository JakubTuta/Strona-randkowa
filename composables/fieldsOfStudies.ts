export function useFieldsOfStudies() {
  const { t } = useI18n()
  const fieldsOfStudies = [
    'computerScience',
    'automaticsAndRobotics',
    'logistics',
    'maths',
    'physics',
    'architecture',
    'other',
  ]

  const mappedFieldsOfStudies = [
    { title: t('fieldsOfStudies.computerScience'), value: 'computerScience' },
    { title: t('fieldsOfStudies.automaticsAndRobotics'), value: 'automaticsAndRobotics' },
    { title: t('fieldsOfStudies.logistics'), value: 'logistics' },
    { title: t('fieldsOfStudies.maths'), value: 'maths' },
    { title: t('fieldsOfStudies.physics'), value: 'physics' },
    { title: t('fieldsOfStudies.architecture'), value: 'architecture' },
    { title: t('fieldsOfStudies.other'), value: 'other' },
  ]

  return {
    mappedFieldsOfStudies,
    fieldsOfStudies,
  }
}
