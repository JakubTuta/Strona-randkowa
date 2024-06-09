export default defineNuxtRouteMiddleware(async () => {
    const { auth } = useFirebase()

    await auth.authStateReady()

    if (!auth.currentUser)
        return navigateTo('/')
})
