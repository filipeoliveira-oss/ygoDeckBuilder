import { card } from "../helpers/interfaces"
import { getCardInfo } from "../helpers/functions"
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
import { cardsAtom, cardToInspectAtom, currentCardsAtom, extraDeckCardsAtom, isCardInspectingAtom, searchAtom } from "../helpers/atoms"


export default function ExtraDeck(){

    //ATOMS
    const [cards,setCards] = useRecoilState(cardsAtom)
    const [extraDeckCards, setExtraDeckCards] = useRecoilState(extraDeckCardsAtom)
    const search = useRecoilValue(searchAtom) 
    const setCurrentCards = useSetRecoilState(currentCardsAtom)
    const setCardToInspect = useSetRecoilState(cardToInspectAtom)
    const setIsCardInspecting = useSetRecoilState(isCardInspectingAtom)

    function removeCardFromExtraDeck(card:card, e:any){
		e.preventDefault()
		let aux = cards.filter((each:card) =>{
			return each.name.toLowerCase().includes(search)
		})
        
		setExtraDeckCards(extraDeckCards.filter((each:card) =>{
			return (each.cardIndexOnArray != card.cardIndexOnArray)
		}))

		setCards([card, ...cards].sort((a:card, b:card) => parseInt(String(a.cardIndexOnArray)) - parseInt(String(b.cardIndexOnArray))))
		setCurrentCards([card, ...aux].sort((a:card, b:card) => parseInt(String(a.cardIndexOnArray)) - parseInt(String(b.cardIndexOnArray))))
	}

    return(
        <div className={`flex h-full flex-col`}>
            <div className='flex w-full h-8 items-center gap-4 deckHeader '>
                <h1 className='font-semibold text-base tracking-tight leading-normal ml-4'>Extra Deck</h1>
                <span className="font-semibold text-base">{extraDeckCards.length} </span>
            </div>
            <div className={`h-full bg-transparent w-full grid grid-cols-cards gap-4 overflow-auto px-4 pt-2 pb-4`}>
                {extraDeckCards.map((each:card) =>{
                    return(
                        <div key={each.cardIndexOnArray} className="w-40 h-56 cursor-pointer" onClick={() => getCardInfo(each.cardId.toString(), setCardToInspect, setIsCardInspecting)} onContextMenu={(e) => removeCardFromExtraDeck(each, e)}>
                            <img src={each.img} alt={each.cardId.toString()}/>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}