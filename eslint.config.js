import antfu from '@antfu/eslint-config'

export default antfu({
  vue: true,
  typescript: true,
  // Betikle üretilen veri (Noise Cleaner dalga formu)
  ignores: ['app/assets/data/**'],
})
