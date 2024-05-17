export function useHobbies() {
  const { t } = useI18n()

  const mappedHobbies = [
    { title: t('user.hobbies.gym'), value: 'gym' },
    { title: t('user.hobbies.studyPartner'), value: 'studyPartner' },
    { title: t('user.hobbies.beer'), value: 'beer' },
  ]
  return {
    mappedHobbies,
  }
}
