import { atom } from "recoil";
import { card, CardRoot, decks } from "./interfaces";

export const cardsAtom = atom({
    key:'cards',
    default: [] as card[]
})

export const mainDeckCardsAtom = atom({
    key:'mainDeckCards',
    default: [] as decks[]
})

export const extraDeckCardsAtom = atom({
    key:'extraDeckCards',
    default: [] as decks[]
})

export const currentCardsAtom = atom({
    key:'currentCards',
    default: [] as card[],
})

export const searchAtom = atom({
    key:'search',
    default: ''
})

export const isCardInspectingAtom = atom({
    key:'isCardInspecting',
    default: false as boolean
})

export const cardToInspectAtom = atom({
    key:'cardToInspect',
    default: null as CardRoot | null
})

export const screenLoaderAtom = atom({
    key:'screenLoader',
    default: false as boolean
})