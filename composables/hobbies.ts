export function useHobbies() {
  const { t } = useI18n()

  const mappedHobbies = [
    { title: t('user.hobbies.gym'), value: 'gym' },
    { title: t('user.hobbies.studyPartner'), value: 'studyPartner' },
    { title: t('user.hobbies.beer'), value: 'beer' },
    { title: t('user.hobbies.sports'), value: 'sports' },
    { title: t('user.hobbies.karaoke'), value: 'karaoke' },
    { title: t('user.hobbies.running'), value: 'running' },
    { title: t('user.hobbies.music'), value: 'music' },
    { title: t('user.hobbies.books'), value: 'books' },
    { title: t('user.hobbies.jujitsu'), value: 'jujitsu' },
    { title: t('user.hobbies.chess'), value: 'chess' },

  ]
  return {
    mappedHobbies,
  }
}
