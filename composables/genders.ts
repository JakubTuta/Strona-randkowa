export function useGenders() {
  const { t } = useI18n()

  const mappedGenders = [
    { title: t('user.sex.male'), value: 'male' },
    { title: t('user.sex.female'), value: 'female' },
    { title: t('user.sex.other'), value: 'other' },
  ]

  const mappedGendersPreferences = [
    { title: t('user.sex.male'), value: 'male' },
    { title: t('user.sex.female'), value: 'female' },
    { title: t('user.sex.other'), value: 'other' },
    { title: t('user.sex.any'), value: 'any' },
  ]
  return {
    mappedGenders,
    mappedGendersPreferences,
  }
}
