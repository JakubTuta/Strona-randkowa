export function useError() {
  const { t } = useI18n()

  const getAuthError = (error: string) => {
    return t(getTranslationKey(error))
  }

  return {
    getAuthError,
  }
}

function getTranslationKey(error: string) {
  switch (error) {
    case 'auth/invalid-email':
    case 'auth/invalid-credential':
      return 'authErrors.invalidEmailOrPassword'

    default:
      return 'authErrors.unknown'
  }
}
