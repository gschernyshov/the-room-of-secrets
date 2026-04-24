import { create } from 'zustand'
import { isValidTab, type Tab } from './tab'

type ProfileCardState = {
  activeTab: Tab
}

type ProfileCardActions = {
  setActiveTab: (tab: Tab) => void
  init: () => void
}

const STORE_KEY = 'profile_activeTab'

export const useProfileCardStore = create<
  ProfileCardState & ProfileCardActions
>(set => ({
  activeTab: 'profile',

  setActiveTab: activeTab => {
    localStorage.setItem(STORE_KEY, activeTab)
    set({ activeTab })
  },

  init: () => {
    const savedTab = localStorage.getItem(STORE_KEY)

    if (savedTab && isValidTab(savedTab)) {
      set({ activeTab: savedTab })
    }
  },
}))
