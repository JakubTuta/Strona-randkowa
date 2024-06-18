export function useRelationship() {
  const { t } = useI18n()

  const mappedRelationships = [
    { title: t('user.preferredRelationship.relationship'), value: 'relationship' },
    { title: t('user.preferredRelationship.friendship'), value: 'friendship' },
    { title: t('user.preferredRelationship.studyPartner'), value: 'studyPartner' },
    { title: t('user.preferredRelationship.other'), value: 'other' },
  ]

  return {
    mappedRelationships,
  }
}
