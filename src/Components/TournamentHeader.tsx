import React, { useEffect, useState } from "react";
import { Action } from "./ui/headerAction";
import { useNavigate } from "react-router-dom";
import * as Dialog from '@radix-ui/react-dialog';
import { Button } from "./ui/button";
import { WalletCards, X } from "lucide-react";
import { Tables } from "../helpers/supabase";
import { supabase } from "../helpers/utils";
import Checkbox from "./ui/checkbox";
import { toast } from 'react-toastify';

export default function TournamentHeader({ competitors, tournamentId,setCompetitors }: { competitors:Array<Tables<'competitors'>>, tournamentId:string, setCompetitors:Function}) {

    const navigate = useNavigate()
    const [modalController, setModalController] = useState({
        competitorsModal: false,
        tournamentModal: false,
        addCompetitorModal:false
    })
    const [newCompetitorName, setNewCompetitorName] = useState('')
    const [newCompetitorDeck, setNewCompetitorDeck] = useState<string | null>(null)
    const [newCompetitorAdmin, setNewCompetitorAdmin] = useState(false)

    return (
        <>
            <div className="flex items-center justify-center px-2 h-12 gap-4">
                <Action onClick={() => { navigate('/') }}>Deck builder</Action>
                <Action onClick={() => { setModalController({ ...modalController, competitorsModal: true }) }}>Competidores</Action>
                <Action onClick={() => { setModalController({ ...modalController, tournamentModal: true }) }}>Gerenciar torneio</Action>
                <Action onClick={() => { setModalController({ ...modalController, tournamentModal: true }) }}>Torneios</Action>
            </div>

            {/* <Dialog.Root open={modalController.competitorsModal}>
                <Dialog.Portal>
                    <Dialog.Overlay className="DialogOverlay " />
                    <Dialog.Content className="DialogContent bg-zinc-700 text-white border-2 border-violet-500">
                        <Dialog.Title className="DialogTitle text-white">Gerenciar competidores</Dialog.Title>

                        <Dialog.Description>
                            <div className='flex flex-col gap-4 mt-4'>
                                <table className="text-center border border-zinc-500 border-separate border-tools-table-outline rounded-lg">
                                    <thead className="leading-8">
                                        <tr className="text-zinc-400">
                                            <td className="border-r border-zinc-500">Nome</td>
                                            <td className="border-r border-zinc-500">Deck</td>
                                            <td>Ações</td>
                                        </tr>
                                    </thead>

                                    <tbody className="">
                                        {competitors.map((competitor:Tables<'competitors'>) =>{
                                            return(
                                                <>
                                                    <tr key={competitor.competitor_id} className="leading-8 border-b border-zinc-500 hover:bg-zinc-500">
                                                        <td className="border-r border-zinc-500">{competitor.name}</td>
                                                        <td className="border-r border-zinc-500">
                                                            <a href={competitor.deck || '/'} className="flex justify-center" target="_blank" rel="noopener noreferrer">
                                                                {competitor.deck && <WalletCards/>}
                                                            </a>
                                                        </td>
                                                        <td>Actions</td>
                                                    </tr>
                                                </>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </Dialog.Description>

                        <div className='w-full h-fit min-h-8 flex justify-end gap-4 mt-4'>
                            <Button aria-label="Close" onClick={() => {setModalController({ ...modalController, competitorsModal: false, addCompetitorModal:true })}} className='h-12 flex text-center bg-violet-500 justify-center items-center p-1'>
                                Adicionar novo competidor
                            </Button>

                            <Button aria-label="Close" onClick={() => {setModalController({ ...modalController, competitorsModal: false })}} className='h-12 flex text-center bg-violet-500 justify-center items-center p-1'>
                                Fechar
                            </Button>
                        </div>

                        <Dialog.Close asChild>
                            <button className="IconButton" aria-label="Close" onClick={() => {setModalController({ ...modalController, competitorsModal: false })}}>
                                <X />
                            </button>
                        </Dialog.Close>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root> */}

            {/* <Dialog.Root open={modalController.addCompetitorModal}>
                <Dialog.Portal>
                    <Dialog.Overlay className="DialogOverlay " />
                    <Dialog.Content className="DialogContent bg-zinc-700 text-white border-2 border-violet-500 w-96">
                        <Dialog.Title className="DialogTitle text-white">Gerenciar competidores</Dialog.Title>
                        
                        <form onSubmit={(e) =>{handleNewCompetitor(e)}} className="mt-4 flex gap-4 flex-col">
                            <label htmlFor="name" className="flex flex-col gap-2">
                                Nome:
                                <input type="text" required name="name" id="name" className="bg-zinc-400 h-8 cursor-auto pl-2" value={newCompetitorName} onChange={(e) => setNewCompetitorName(e.target.value)}/>
                            </label>

                            <label htmlFor="name" className="flex flex-col gap-2">
                                Deck (url):
                                <input type="text" name="name" id="name" className="bg-zinc-400 h-8 cursor-auto pl-2" value={newCompetitorDeck || ''} onChange={(e) => setNewCompetitorDeck(e.target.value)}/>
                            </label>

                            <label htmlFor="admin" className="flex flex-col gap-2">
                                É administrador?
                                <Checkbox setNewCompetitorAdmin={setNewCompetitorAdmin}/>
                            </label>

                            <div className='w-full h-fit min-h-8 flex justify-end gap-4 mt-4'>
                                <Button aria-label="Close" onClick={() => {setModalController({ ...modalController, addCompetitorModal: false, competitorsModal:true })}} className='h-12 flex text-center bg-violet-500 justify-center items-center p-1'>
                                    Cancelar
                                </Button>

                                <Button type="submit" aria-label="Close" className='h-12 flex text-center bg-violet-500 justify-center items-center p-1'>
                                    Adicionar competidor
                                </Button>

                            </div>
                        </form>


                        <Dialog.Close asChild>
                            <button className="IconButton" aria-label="Close" onClick={() => {setModalController({ ...modalController, addCompetitorModal: false, competitorsModal:true })}}>
                                <X />
                            </button>
                        </Dialog.Close>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root> */}
        </>
    )
}

