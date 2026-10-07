const icons: Record<string, string> = {
  'BERTurk': 'i-simple-icons-huggingface',
  'Chart.js': 'i-simple-icons-chartdotjs',
  'CSS': 'i-simple-icons-css',
  'Dart': 'i-simple-icons-dart',
  'Dio': 'i-simple-icons-dart',
  'FastAPI': 'i-simple-icons-fastapi',
  'fl_chart': 'i-tabler-chart-line',
  'Flutter': 'i-simple-icons-flutter',
  'Hive': 'i-tabler-database',
  'HTML': 'i-simple-icons-html5',
  'Hugging Face': 'i-simple-icons-huggingface',
  'JavaScript': 'i-simple-icons-javascript',
  'MVVM': 'i-tabler-stack-2',
  'Node.js': 'i-simple-icons-nodedotjs',
  'Nuxt': 'i-simple-icons-nuxt',
  'Python': 'i-simple-icons-python',
  'PyTorch': 'i-simple-icons-pytorch',
  'React': 'i-simple-icons-react',
  'SciPy': 'i-simple-icons-scipy',
  'TypeScript': 'i-simple-icons-typescript',
  'Vite': 'i-simple-icons-vite',
  'Vue': 'i-simple-icons-vuedotjs',
  'WebSocket': 'i-tabler-plug-connected',
}

export function techIcon(name: string) {
  return icons[name] ?? 'i-tabler-code'
}
