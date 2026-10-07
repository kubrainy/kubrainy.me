import type { Directive } from 'vue'

/**
 * v-reveal: eleman ekrana girerken hafifçe belirir. İlk açılışta zaten
 * görünen elemanlara dokunmaz (titreme olmasın diye) ve hareketi azaltma
 * tercihine saygı duyar. `v-reveal="2"` gibi bir sayı gecikmeyi kademelendirir.
 */
const reveal: Directive<HTMLElement, number | undefined> = {
  getSSRProps: () => ({}),
  mounted(el, binding) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches)
      return
    if (el.getBoundingClientRect().top < window.innerHeight)
      return

    el.style.setProperty('--reveal-delay', `${(binding.value ?? 0) * 70}ms`)
    el.classList.add('reveal')

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting)
        return
      el.classList.add('reveal-visible')
      observer.disconnect()
    }, { rootMargin: '0px 0px -8% 0px' })
    observer.observe(el)
    ;(el as HTMLElement & { _revealObserver?: IntersectionObserver })._revealObserver = observer
  },
  unmounted(el) {
    (el as HTMLElement & { _revealObserver?: IntersectionObserver })._revealObserver?.disconnect()
  },
}

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('reveal', reveal)
})
