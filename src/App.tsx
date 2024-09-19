
import {  useState } from 'react'
import './App.css'
import * as Dialog from '@radix-ui/react-dialog';
import './modal.css'
import { Book, Shield,  Swords, X } from 'lucide-react';
import Header from './Components/header';
import { card, CardRoot } from './helpers/interfaces';
import MainDeck from './Components/mainDeck';
import ExtraDeck from './Components/extraDeck';
import Collection from './Components/collection';
import { ShootingStars } from './Components/ui/shootingStars';
import { StarsBackground } from './Components/ui/starsBackground';
import { ToastContainer } from 'react-toastify';

export default function App() {
	const [cards, setCards] = useState<card[]>([])
	const [mainDeckCards, setMainDeckCards] = useState<card[]>([])
	const [extraDeckCards, setExtraDeckCards] = useState<card[]>([])
	const [isCardInspecting, setIsCardInspecting] = useState(false)
	const [cardToInspect, setCardToInspect] = useState<CardRoot | null>(null)
	const [currentCards, setCurrentCards] = useState<card[]>(cards)
	const [search, setSearch] = useState('')

	return (
		<>
			<ShootingStars starWidth={20} starHeight={2} minDelay={3000} maxDelay={4200}/>
			<StarsBackground starDensity={0.00130}/>
			<ToastContainer  closeOnClick theme='dark' />
			<div className='flex flex-col h-screen w-screen items-center overflow-hidden relative' >
				<Header 
					cards={cards} 
					extraDeckCards={extraDeckCards} 
					mainDeckCards={mainDeckCards} 
					search={search} setCards={setCards} 
					setCurrentCards={setCurrentCards} 
					setExtraDeckCards={setExtraDeckCards} 
					setMainDeckCards={setMainDeckCards} 
					setSearch={setSearch}
				/>

				<div className='h-full w-full flex items-center justify-center gap-4 p-4 overflow-hidden'>
					<div className='h-full w-[60%] border border-zinc-400 rounded-2xl gap-1 flex flex-col' > 
						<div className='w-full h-[69%] rounded-tl-2xl rounded-tr-2xl rounded-bl-0 rounded-br-0'>
							<MainDeck 
								cards={cards} 
								mainDeckCards={mainDeckCards} 
								search={search} 
								setCardToInspect={setCardToInspect} 
								setCards={setCards} 
								setCurrentCards={setCurrentCards} 
								setIsCardInspecting={setIsCardInspecting} 
								setMainDeckCards={setMainDeckCards}
							/>
						</div>

						<div className='w-full h-[31%] rounded-bl-2xl rounded-br-2xl rounded-tl-0 rounded-tr-0'>
							<ExtraDeck
								cards={cards}
								extraDeckCards={extraDeckCards}
								search={search}
								setCardToInspect={setCardToInspect}
								setCards={setCards}
								setCurrentCards={setCurrentCards}
								setExtraDeckCards={setExtraDeckCards}
								setIsCardInspecting={setIsCardInspecting}
							/>
						</div>

					</div>

					<div className='h-full w-[40%] border border-zinc-400 rounded-2xl'>
						<Collection
							cards={cards}
							currentCards={currentCards}
							extraDeckCards={extraDeckCards}
							mainDeckCards={mainDeckCards}
							search={search}
							setCardToInspect={setCardToInspect}
							setCards={setCards}
							setCurrentCards={setCurrentCards}
							setExtraDeckCards={setExtraDeckCards}
							setIsCardInspecting={setIsCardInspecting}
							setMainDeckCards={setMainDeckCards}
						/>
					</div>
				</div>
				
				<Dialog.Root open={isCardInspecting}>
					<Dialog.Portal>
						<Dialog.Overlay className="DialogOverlay " />
						<Dialog.Content className="DialogContent bg-zinc-950 text-white border-2 border-violet-500">
						<Dialog.Title className="DialogTitle text-white">{cardToInspect?.name}</Dialog.Title>

						<div className='flex w-full h-full gap-4'>
							<div className='w-[30%] h-full'>
								<img src={cardToInspect?.card_images[0]?.image_url}/>
							</div>
							
							<div className='h-full w-full  gap-4 flex flex-col text-white bg'>
								<div className='flex flex-1  h-fit gap-4'>
									<div className='w-full h-full flex flex-col  p-2 gap-2 inspectItemBg'>
										<span className='font-medium text-sm tracking-tight leading-normal '>Type</span>
										<div className='flex gap-2'>
											<Book/>
											<span>{cardToInspect?.type}</span>
										</div>
									</div>

									<div className='w-full h-full flex flex-col  inspectItemBg p-2 gap-2'>
										<span className='font-medium text-sm tracking-tight leading-normal '>Attribute</span>
										<div className='flex gap-2'>
											<img src={`https://images.ygoprodeck.com/images/cards/${cardToInspect?.attribute}.jpg`} alt={cardToInspect?.attribute}  className='w-6 h-6'/>
											<span>{cardToInspect?.attribute}</span>
										</div>
									</div>

									<div className='w-full h-full flex flex-col  inspectItemBg p-2 gap-2'>
										<span className='font-medium text-sm tracking-tight leading-normal '>typing</span>
										<div className='flex gap-2'>
											<img src={`https://images.ygoprodeck.com/images/cards/icons/race/${cardToInspect?.race}.png`} alt={cardToInspect?.race}  className='w-6 h-6'/>
											<span>{cardToInspect?.race}</span>
										</div>
									</div>
								</div>
								
								<div className='flex flex-1  h-fit gap-4'>
									<div className='w-full h-full flex flex-col  inspectItemBg p-2 gap-2'>
										<span className='font-medium text-sm tracking-tight leading-normal '>Level/Rank</span>
										<div className='flex gap-2'>
											<img src={`https://ygoprodeck.com/wp-content/uploads/2017/01/level.png`} alt={cardToInspect?.race}  className='w-6 h-6'/>
											<span>{cardToInspect?.level}</span>
										</div>
									</div>

									<div className='w-full h-full flex flex-col inspectItemBg p-2 gap-2'>
										<span className='font-medium text-sm tracking-tight leading-normal '>ATK</span>
										<div className='flex gap-2'>
											<Swords/>
											<span>{cardToInspect?.atk}</span>
										</div>
									</div>

									<div className='w-full h-full flex flex-col  inspectItemBg p-2 gap-2'>
										<span className='font-medium text-sm tracking-tight leading-normal '>DEF</span>
										<div className='flex gap-2'>
											<Shield/>
											<span>{cardToInspect?.def}</span>
										</div>
									</div>
								</div>

								<div className='flex flex-col flex-1  inspectItemBg p-2 gap-2'>
									<span>Card Text</span>
									<span>{cardToInspect?.desc}</span>
								</div>
							</div>
						</div>


						<Dialog.Close asChild>
							<button className="IconButton" aria-label="Close" onClick={() => {setIsCardInspecting(false), setCardToInspect(null)}}>
							<X/>
							</button>
						</Dialog.Close>
						</Dialog.Content>
					</Dialog.Portal>
				</Dialog.Root>

			</div>
		</>
	)
}