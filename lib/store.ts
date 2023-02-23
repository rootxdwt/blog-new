import { configureStore, createAction, createReducer } from '@reduxjs/toolkit'
import { createWrapper } from 'next-redux-wrapper';


const initialState = { theme: typeof window != "undefined" ? localStorage.getItem("theme") == null ? true : localStorage.getItem("theme") == "true" : true, isSideMenuOpen: false }
const toggle = createAction('theme/toggle')
const toggleSide = createAction('side/toggle')

const rootReducer = createReducer(initialState, (builder) => {
    builder.addCase(toggle, (state, _) => { localStorage.setItem("theme", (!state.theme).toString()); state.theme = !state.theme })
    builder.addCase(toggleSide, (state, _) => { state.isSideMenuOpen = !state.isSideMenuOpen })
})

export type StoreType = ReturnType<typeof store>;
export type StateType = ReturnType<StoreType['getState']>;

const store = () => configureStore({
    reducer: rootReducer,
})

export const wrapper = createWrapper<StoreType>(store)