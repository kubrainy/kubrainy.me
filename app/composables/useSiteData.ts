// Birden fazla sayfada kullanılan veriler: aynı anahtar her yerde aynı
// fonksiyonla çağrılsın diye burada tanımlıdır.

export function useSocials() {
  return useAsyncData('socials', () => queryCollection('socials').all())
}

export function useExperience() {
  return useAsyncData('experience', () => queryCollection('experience').all())
}

export async function usePhotos() {
  const l = useLocalized()
  const { data } = await useAsyncData('photos', () => queryCollection('photos').all())
  return {
    photos: computed(() => (data.value ?? []).map(photo => ({ image: photo.image, alt: l(photo.alt), exif: photo.exif, palette: photo.palette }))),
  }
}
