export function useRelationship() {
  const { t } = useI18n()

  const mappedRelationships = [
    { title: t('user.prefferedRelationship.relationship'), value: 'relationship' },
    { title: t('user.prefferedRelationship.friendship'), value: 'friendship' },
    { title: t('user.prefferedRelationship.studyPartner'), value: 'studyPartner' },
    { title: t('user.prefferedRelationship.other'), value: 'other' },
  ]

  return {
    mappedRelationships,
  }
}
