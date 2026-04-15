import { create } from 'zustand'
import { type Tab } from './tab'
import { isValidTab } from '../lib/isVaildTab'

type ProfileCardState = {
  activeTab: Tab
}

type ProfileCardActions = {
  init: () => void
  setActiveTab: (tab: Tab) => void
}

const STORE_KEY = 'profile_activeTab'

export const useProfileCardStore = create<
  ProfileCardState & ProfileCardActions
>(set => ({
  activeTab: 'profile',

  init: () => {
    const saved = localStorage.getItem(STORE_KEY)

    if (saved && isValidTab(saved)) {
      set({ activeTab: saved })
    }
  },

  setActiveTab: activeTab => {
    localStorage.setItem(STORE_KEY, activeTab)
    set({ activeTab })
  },
}))
