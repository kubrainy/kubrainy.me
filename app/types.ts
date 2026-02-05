import type * as NuxtUI from '@nuxt/ui'

declare global {

  type NavigationMenuItem = NuxtUI.NavigationMenuItem

  export interface SocialLink {
    name: string
    url: string
    icon: string
    description?: string
  }
  export interface SocialItem {
    name: string
    url: string
    icon: string
    description?: string
  }
  export interface SocialsFile {
    socials: SocialItem[]
  }
  export interface Project {
    name: string
    description: string
    icon: string
    link: string
    image?: string
  }
}
