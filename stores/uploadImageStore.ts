import type { DocumentReference } from 'firebase/firestore'
import { getDownloadURL, ref, uploadString } from 'firebase/storage'

export const useUploadImageStore = defineStore('uploadImage', () => {
  const { storage } = useFirebase()

  const generateRandomText = (length = 30) => {
    const CHAR_SET = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

    return Array(length)
      .fill(CHAR_SET)
      .map((x) => { return x[Math.floor(Math.random() * x.length)] })
      .join('')
  }

  const createAndUploadImage = async (userRef: DocumentReference, imgData: string) => {
    const imagePath = `${userRef.id}/${generateRandomText()}`

    const uploadedData = await uploadString(
      ref(storage, imagePath),
      imgData,
      'data_url',
    )

    const imageUrl = await getDownloadURL(uploadedData.ref)

    return {
      imageUrl,
      imagePath,
      uploadedData,
    }
  }

  return {
    createAndUploadImage,
  }
})
