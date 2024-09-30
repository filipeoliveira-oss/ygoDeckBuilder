import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import './dropDown.css';
import { Check, Filter } from 'lucide-react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { cardRarityAtom, cardsAtom, cardSetAtom, currentCardsAtom, searchAtom } from '../../helpers/atoms';
import { card } from '../../helpers/interfaces';


interface filterDD{
    sets: Array<string>,
    rarity: Array<string>,
}

export default function FilterDropDown({ rarity,sets }: filterDD) {

    //ATOMS
    const cards = useRecoilValue(cardsAtom)
    const setCurrentCards = useSetRecoilState(currentCardsAtom)
    const search = useRecoilValue(searchAtom)
    const [cardRarity, setCardRarity] = useRecoilState(cardRarityAtom);
    const [cardSet, setCardSet] = useRecoilState(cardSetAtom)

    function handleSetSelection(set:string){
        if(set == cardSet){
            setCardSet('')
            setCurrentCards(cards)

            return
        }

        let currentCardsAux = cards.filter((each:card) =>{
            return each.rarity.toLowerCase().includes(cardRarity.toLowerCase()) 
            && each.set.toLowerCase().includes(cardSet.toLowerCase()) 
            && each.name.toLowerCase().includes(search.toLowerCase())
        })
        setCardSet(set)
        setCurrentCards(currentCardsAux)
        
    }

    function handleRaritySelection(rarity:string){
        if(rarity == cardRarity){
            setCardRarity('')
            setCurrentCards(cards)

            return
        }
        
        let currentCardsAux = cards.filter((each:card) =>{
            return each.rarity.toLowerCase().includes(rarity.toLowerCase()) 
            && each.set.toLowerCase().includes(cardSet.toLowerCase()) 
            && each.name.toLowerCase().includes(search.toLowerCase())
        })
        setCardRarity(rarity)
        setCurrentCards(currentCardsAux)

    }

    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
                <button className="iconButton" aria-label="Filters">
                    <Filter />
                </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
                <DropdownMenu.Content className="DropdownMenuContent" sideOffset={5}>
                    <DropdownMenu.Label className="DropdownMenuLabel">Filtrar por coleção</DropdownMenu.Label>
                    <DropdownMenu.RadioGroup >
                        {sets?.map((each: string) => (
                            <DropdownMenu.RadioItem className="DropdownMenuRadioItem" value={each} onClick={() => handleSetSelection(each)}>
                                {each == cardSet && (
                                    <Check className='check'/>
                                )}
                                <span className='capitalize text-base'>{each}</span>
                            </DropdownMenu.RadioItem>
                        ))}
                    </DropdownMenu.RadioGroup>

                    <DropdownMenu.Separator className="DropdownMenuSeparator" />

                    <DropdownMenu.Label className="DropdownMenuLabel">Filtrar por raridade</DropdownMenu.Label>
                    <DropdownMenu.RadioGroup >
                        {rarity?.map((each: string) => (
                            <DropdownMenu.RadioItem className="DropdownMenuRadioItem" value={each} onClick={() => handleRaritySelection(each)}>
                                 {each == cardRarity && (
                                    <Check className='check'/>
                                )}
                                <span className='capitalize text-base'>{each}</span>
                            </DropdownMenu.RadioItem>
                        ))}
                    </DropdownMenu.RadioGroup>

                    <DropdownMenu.Arrow className="DropdownMenuArrow" />
                </DropdownMenu.Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    );
};

