import { atom } from "recoil";
import { card, CardRoot } from "./interfaces";

export const cardsAtom = atom({
    key:'cards',
    default: [] as card[]
})

export const mainDeckCardsAtom = atom({
    key:'mainDeckCards',
    default: [] as card[]
})

export const extraDeckCardsAtom = atom({
    key:'extraDeckCards',
    default: [] as card[]
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