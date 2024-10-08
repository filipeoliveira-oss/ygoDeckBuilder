import React, { useEffect, useState } from "react";
import { Action } from "./ui/headerAction";
import { useNavigate } from "react-router-dom";
import * as Dialog from '@radix-ui/react-dialog';
import { Button } from "./ui/button";
import { Check, LogOut, Pencil, Trash, WalletCards, X } from "lucide-react";
import { Tables } from "../helpers/supabase";
import { supabase } from "../helpers/utils";
import Checkbox from "./ui/checkbox";
import { toast } from 'react-toastify';
import TournamentDropdown from "./ui/tournamentsDropDown";
import { User } from "@supabase/supabase-js";

interface tournamentHeader{
    competitors:Array<Tables<'competitors'>>, 
    tournamentId:number, 
    setCompetitors:Function, 
    userSession:User,
    setTournamentId:Function,
    userTournaments:Array<any>,
    tournamentName:string,
    tournamentDetail:Tables<'tournaments'> | undefined,
    setUserTournaments:Function,
    setTournamentName:Function,
    setLoader:Function,
    setSeasons:Function
}

export default function TournamentHeader({ competitors, tournamentId, setCompetitors, userSession,setTournamentId ,userTournaments,tournamentName,tournamentDetail,setUserTournaments, setTournamentName,setLoader,setSeasons}: tournamentHeader) {

    const navigate = useNavigate()
    const [modalController, setModalController] = useState({
        competitorsModal: false,
        tournamentModal: false,
        addCompetitorModal:false,
        deleteCompetitorModal:false,
        editCompetitorModal:false,
        newSeasonModal:false
    })
    const [newCompetitorName, setNewCompetitorName] = useState('')
    const [newCompetitorEmail, setNewCompetitorEmail] = useState('')
    const [newCompetitorCollection, setNewCompetitorCollection] = useState<string>('')
    const [newCompetitorAdmin, setNewCompetitorAdmin] = useState(false)
    const [competitorToDelete, setCompetitorToDelete] = useState<Tables<'competitors'> | null>(null)
    const [competitorToEdit, setCompetitorToEdit] = useState<any>()

    const [newNameTournament, setNewNameTournament] = useState('')
    const [newActiveTournament, setNewActiveTournament] = useState(true)
    const [newPublicTournament, setNewPublicTournament] = useState(false)
    const [newSeasonName, setNewSeasonName] = useState('')


    useEffect(() =>{
        if(tournamentDetail){
            setNewNameTournament(tournamentDetail?.tournament_name)
            setNewActiveTournament(tournamentDetail?.active)
            setNewPublicTournament(tournamentDetail?.is_public)
        }
    },[tournamentDetail])

    async function handleNewCompetitor(e:React.FormEvent<HTMLFormElement>) {
        e.preventDefault()  
        setLoader(true)

        const {data, error} = await supabase.from('competitors').insert({
            name:newCompetitorName,
            tournament_id:tournamentId,
            collection:newCompetitorCollection,
            isAdmin:newCompetitorAdmin,
            competitor_email:newCompetitorEmail,
            competitor_status:"WAPPR",

        }).select()

        if(error){
            toast.error('Ocorreu um erro no cadastro do competidor, tente novamente')
            setLoader(false)
            return
        }

        setCompetitors([...competitors, {
            name:data[0].name,
            tournament_id:data[0].tournament_id,
            collection:data[0].collection,
            isAdmin:data[0].isAdmin,
            competitor_email:data[0].competitor_email,
            competitor_status:data[0].competitor_status,
            competitor_id:data[0].competitor_id,
            joinned_at:data[0].joinned_at
        }])

        setNewCompetitorAdmin(false)
        setNewCompetitorCollection('')
        setNewCompetitorEmail('')
        setNewCompetitorName('')
        setModalController({...modalController, addCompetitorModal:false})
        setLoader(false)
    }

    async function handleDelete() {
        if(!competitorToDelete){
            toast.error('Ocorreu um erro na deleção, tente novamente')
            return 
        }
        setLoader(true)
        await supabase.from('competitors').delete().eq("competitor_id", competitorToDelete.competitor_id)
        setLoader(false)
        toast.success('O competidor foi deletado com sucesso')
    }

    function handleCheckboxChange(e:boolean){
        setCompetitorToEdit({...competitorToEdit, isAdmin: e})
    }

    async function editCompetitor(e:React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        setLoader(true)
        const {error} = await supabase.from('competitors').update({
            name:competitorToEdit.name,
            collection:competitorToEdit.collection,
            competitor_email:competitorToEdit.competitor_email,
            isAdmin:competitorToEdit.isAdmin
        }).eq("competitor_id", competitorToEdit.competitor_id)

        const {data, error:tError} = await supabase.from('competitors').select().eq('tournament_id', tournamentId)

        if(error || tError){
            toast.error('Ocorreu um erro durante a edição, tente novamente')
            setLoader(false)
            return
        }

        if(data){
            setCompetitors(data)
            toast.success('Competidor editado com sucesso')

            setModalController({...modalController, editCompetitorModal:false})
            setCompetitorToEdit(null)
            setLoader(false)
        }

    }

    async function signOutCompetitor() {
        setLoader(true)
        await supabase.auth.signOut()
        setLoader(false)
    }

    async function handleTournamentUpdate(e:React.FormEvent<HTMLFormElement>){
        e.preventDefault()

       
        if(tournamentDetail){
            setLoader(true)
            const {error} = await supabase.from('tournaments').update({
                active:newActiveTournament,
                is_public:newPublicTournament,
                tournament_name:newNameTournament
            }).eq("tournament_id", tournamentDetail?.tournament_id)

            if(error){
                toast.error('Ocorreu um erro na edição, tente novamente')
                setLoader(false)
                return
            }

            const {data, error:Terror} = await supabase.from('competitors')
            .select('joinned_at, tournaments(tournament_id, tournament_name, active, is_public)')
            .eq('competitor_email',(userSession?.email || ''))
            .eq('competitor_status', 'APPR')

            if(Terror){
                setLoader(false)
                throw new Error('Ocorreu um erro na requisição, tente novamente')
            }

            setUserTournaments(data)

            let last = data.sort((a:any, b:any) => a.joinned_at - b.joinned_at)

            setTournamentId(last[0].tournaments?.tournament_id || 0)
            setTournamentName(last[0].tournaments?.tournament_name || '')
            setModalController({...modalController, tournamentModal:false})
            toast.success('Torneio editado com sucesso')
            setLoader(false)
        }
    }

    async function handleCreateNewSeason(e:React.FormEvent<HTMLFormElement>){
        e.preventDefault()

        setLoader(true)

        const {error} = await supabase.from('seasons').update({
            season_status:"OLD"
        }).eq("season_status", "CURRENT")

        const {error:newError} = await supabase.from('seasons').insert({
            tournament_id:tournamentId,
            season_name:newSeasonName,
            season_status:"CURRENT"
        })

        if(error || newError){
            toast.error('Ocorreu um erro na criação da temporada, tente novamente')
            setLoader(false)
            return
        }

        const {data, error:fetchError} = await supabase.from('seasons').select().eq('tournament_id', tournamentId)

        if(fetchError){
            toast.error('Ocorreu um erro na requisição das temporadas, por favor atualize a página')
            setLoader(false)
            return
        }

        if(data){
            setSeasons(data)
            setLoader(false)
            toast.success('Temporada nova criada. Bons jogos!')
            setModalController({...modalController, newSeasonModal:false, tournamentModal:false})
            setNewSeasonName('')
        }

        setLoader(false)

    }

    return (
        <div className="flex flex-row justify-center items-center px-4">  
            <span className="absolute left-4">{tournamentName}</span>
            <div className="flex items-center justify-center px-2 h-12 gap-4">
                <Action onClick={() => { navigate('/') }}>Deck builder</Action>
                <Action onClick={() => { setModalController({ ...modalController, competitorsModal: true }) }}>Competidores</Action>
                <Action onClick={() => { setModalController({ ...modalController, tournamentModal: true }) }}>Gerenciar torneio</Action>
                {/* <Action onClick={() => { setModalController({ ...modalController, tournamentModal: true }) }}>Torneios</Action> */}
                <TournamentDropdown setTournamentId={setTournamentId} userTournaments={userTournaments} tournamentId={tournamentId}/>
            </div>
            <div className="cursor-pointer absolute right-4" onClick={() => signOutCompetitor()}>
                <LogOut/>
            </div>

            <Dialog.Root open={modalController.competitorsModal}>
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
                                            <td className="border-r border-zinc-500">Email</td>
                                            <td className="border-r border-zinc-500">Deck</td>
                                            <td className="border-r border-zinc-500">Admin?</td>
                                            <td className="border-r border-zinc-500">Aceito?</td>
                                            <td className="border-r border-zinc-500">Ações</td>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {competitors.sort((a, b) => new Date(a.joinned_at).getTime() - new Date(b.joinned_at).getTime()).map((competitor:Tables<'competitors'>) =>{
                                            return(
                                                <tr key={competitor.competitor_id} className="leading-8 border-b border-zinc-500 hover:bg-zinc-500">
                                                    <td className="border-r border-zinc-500">{competitor.name}</td>
                                                    <td className="border-r border-zinc-500">{competitor.competitor_email}</td>
                                                    <td className="border-r border-zinc-500">
                                                        <a href={competitor.collection || '/'} className="flex justify-center" target="_blank" rel="noopener noreferrer">
                                                            {competitor.collection && <WalletCards/>}
                                                        </a>
                                                    </td>
                                                    <td className="border-r border-zinc-500 items-center justify-center"><div className="w-full h-full flex items-center justify-center">{competitor.isAdmin ? <Check />: <X/>}</div></td>
                                                    <td className="border-r border-zinc-500 items-center justify-center "><div className="w-full h-full flex items-center justify-center">{competitor.competitor_status === 'APPR' ? <Check />: <X/>}</div></td>
                                                    <td>
                                                        <div className="flex flex-row gap-4 items-center justify-center">
                                                            <span className="cursor-pointer" onClick={() => {setCompetitorToEdit(competitor), setModalController({...modalController, editCompetitorModal:true})}}><Pencil/></span>
                                                            <span className="cursor-pointer" onClick={() => {setCompetitorToDelete(competitor), setModalController({...modalController, deleteCompetitorModal:true})}}><Trash/></span>
                                                        </div>
                                                    </td>
                                                </tr>
                                                
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </Dialog.Description>

                        <div className='w-full h-fit min-h-8 flex justify-end gap-4 mt-4'>
                            <Button aria-label="Close" onClick={() => {setModalController({ ...modalController, addCompetitorModal:true })}} className='h-12 flex text-center bg-violet-500 justify-center items-center p-1'>
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
            </Dialog.Root>

            <Dialog.Root open={modalController.addCompetitorModal}>
                <Dialog.Portal>
                    <Dialog.Overlay className="DialogOverlay " />
                    <Dialog.Content className="DialogContent bg-zinc-700 text-white border-2 border-violet-500 w-96">
                        <Dialog.Title className="DialogTitle text-white">Adicionar competidor</Dialog.Title>
                        
                        <form onSubmit={(e) =>{handleNewCompetitor(e)}} className="mt-4 flex gap-4 flex-col">
                            <label htmlFor="name" className="flex flex-col gap-2">
                                Nome:
                                <input type="text" required name="name" id="name" className="bg-zinc-400 h-8 cursor-auto pl-2" value={newCompetitorName} onChange={(e) => setNewCompetitorName(e.target.value)}/>
                            </label>

                            <label htmlFor="email" className="flex flex-col gap-2">
                                Email:
                                <input type="email" required name="email" id="email" className="bg-zinc-400 h-8 cursor-auto pl-2" value={newCompetitorEmail} onChange={(e) => setNewCompetitorEmail(e.target.value)}/>
                            </label>

                            <label htmlFor="name" className="flex flex-col gap-2">
                                Coleção (url):
                                <input type="text" name="name" id="name" className="bg-zinc-400 h-8 cursor-auto pl-2" value={newCompetitorCollection} onChange={(e) => setNewCompetitorCollection(e.target.value)}/>
                            </label>

                            <label htmlFor="admin" className="flex flex-col gap-2">
                                É administrador?
                                <Checkbox changeFunction={setNewCompetitorAdmin} identifier="admin" />
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
            </Dialog.Root>

            <Dialog.Root open={modalController.deleteCompetitorModal}>
                <Dialog.Portal>
                    <Dialog.Overlay className="DialogOverlay " />
                    <Dialog.Content className="DialogContent bg-zinc-700 text-white border-2 border-violet-500">
                        <Dialog.Title className="DialogTitle text-white">Deletar competidor</Dialog.Title>

                        <Dialog.Description>
                            Após a exclusão, essa ação não pode ser desfeita <br />
                            Você tem certeza que deseja excluir o competidor: <strong>{competitorToDelete?.name} </strong>
                        </Dialog.Description>

                        <div className='w-full h-fit min-h-8 flex justify-end gap-4 mt-4'>
                            <Button aria-label="Close" onClick={() => {handleDelete()}} className='h-12 flex text-center bg-violet-500 justify-center items-center p-1'>
                                Deletar competidor
                            </Button>

                            <Button aria-label="Close" onClick={() => {setCompetitorToDelete(null), setModalController({ ...modalController, deleteCompetitorModal: false })}} className='h-12 flex text-center bg-violet-500 justify-center items-center p-1'>
                                Fechar
                            </Button>
                        </div>

                        <Dialog.Close asChild>
                            <button className="IconButton" aria-label="Close" onClick={() => {setCompetitorToDelete(null), setModalController({ ...modalController, deleteCompetitorModal: false })}}>
                                <X />
                            </button>
                        </Dialog.Close>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>

            <Dialog.Root open={modalController.editCompetitorModal}>
                <Dialog.Portal>
                    <Dialog.Overlay className="DialogOverlay " />
                    <Dialog.Content className="DialogContent bg-zinc-700 text-white border-2 border-violet-500 w-96">
                        <Dialog.Title className="DialogTitle text-white">Gerenciar competidor</Dialog.Title>
                        
                        <form onSubmit={(e) =>{editCompetitor(e)}} className="mt-4 flex gap-4 flex-col">
                            <label htmlFor="name" className="flex flex-col gap-2">
                                Nome:
                                <input type="text" required name="name" id="name" className="bg-zinc-400 h-8 cursor-auto pl-2" value={competitorToEdit?.name} onChange={(e) => setCompetitorToEdit({...competitorToEdit, name:e.target.value})}/>
                            </label>

                            <label htmlFor="email" className="flex flex-col gap-2">
                                Email:
                                <input type="email" required name="email" id="email" className="bg-zinc-400 h-8 cursor-auto pl-2" value={competitorToEdit?.competitor_email} onChange={(e) => setCompetitorToEdit({...competitorToEdit, competitor_email:e.target.value})}/>
                            </label>

                            <label htmlFor="name" className="flex flex-col gap-2">
                                Coleção (url):
                                <input type="text" name="name" id="name" className="bg-zinc-400 h-8 cursor-auto pl-2" value={competitorToEdit?.collection || ''} onChange={(e) => setCompetitorToEdit({...competitorToEdit, collection:e.target.value})}/>
                            </label>

                            <label htmlFor="admin" className="flex flex-col gap-2">
                                É administrador?
                                <Checkbox changeFunction={handleCheckboxChange} identifier="admin" checked={competitorToEdit?.isAdmin}/>
                            </label>

                            <div className='w-full h-fit min-h-8 flex justify-end gap-4 mt-4'>
                                <Button aria-label="Close" onClick={() => { setCompetitorToEdit(null) ,setModalController({ ...modalController, editCompetitorModal:false })}} className='h-12 flex text-center bg-violet-500 justify-center items-center p-1'>
                                    Cancelar
                                </Button>

                                <Button type="submit" aria-label="Close" className='h-12 flex text-center bg-violet-500 justify-center items-center p-1'>
                                    Salvar competidor
                                </Button>

                            </div>
                        </form>


                        <Dialog.Close asChild>
                            <button className="IconButton" aria-label="Close" onClick={() => { setCompetitorToEdit(null) ,setModalController({ ...modalController, editCompetitorModal:false })}}>
                                <X />
                            </button>
                        </Dialog.Close>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>

            <Dialog.Root open={modalController.tournamentModal}>
                <Dialog.Portal>
                    <Dialog.Overlay className="DialogOverlay " />
                    <Dialog.Content className="DialogContent bg-zinc-700 text-white border-2 border-violet-500 w-96">
                        <Dialog.Title className="DialogTitle text-white">Gerenciar torneio</Dialog.Title>
                        
                        <form className="mt-4 flex gap-4 flex-col" onSubmit={(e) =>handleTournamentUpdate(e)}>
                            <label htmlFor="tournamentName" className="flex flex-col gap-2" >
                                Nome:
                                <input type="text" className="bg-zinc-400 h-8 cursor-auto pl-2" id="tournamentName" name="tournamentName" value={newNameTournament} onChange={(e) => setNewNameTournament(e.target.value)}/>
                            </label>

                            <div className="flex flex-row gap-4">
                                <label htmlFor="tournamentActive" className="flex flex-col gap-2">
                                    Ativo?
                                    <Checkbox changeFunction={setNewActiveTournament} identifier="tournamentActive" checked={newActiveTournament}/>
                                </label>

                                <label htmlFor="tournamentPublic" className="flex flex-col gap-2">
                                    Publico?
                                    <Checkbox changeFunction={setNewPublicTournament} identifier="tournamentPublic" checked={newPublicTournament}/>
                                </label>
                            </div>

                            <div className="flex flex-row justify-between mt-4">
                                <Button type="button" aria-label="Close" className='h-12 flex text-center bg-violet-500 justify-center items-center p-1' onClick={() => {setModalController({ ...modalController, newSeasonModal:true })}}>
                                    Nova temporada
                                </Button>

                                <Button type="submit" aria-label="Close" className='h-12 flex text-center bg-violet-500 justify-center items-center p-1'>
                                    Salvar
                                </Button>

                                <Button type="button" aria-label="Close" className='h-12 flex text-center bg-violet-500 justify-center items-center p-1' onClick={() => {setModalController({ ...modalController, tournamentModal:false })}}>
                                    Fechar
                                </Button>
                            </div>
                        </form>


                        <Dialog.Close asChild>
                            <button className="IconButton" aria-label="Close" onClick={() => {setModalController({ ...modalController, tournamentModal:false })}}>
                                <X />
                            </button>
                        </Dialog.Close>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>

            <Dialog.Root open={modalController.newSeasonModal}>
                <Dialog.Portal>
                    <Dialog.Overlay className="DialogOverlay " />
                    <Dialog.Content className="DialogContent bg-zinc-700 text-white border-2 border-violet-500 w-[35rem]">
                        <Dialog.Title className="DialogTitle text-white">Gerenciar torneio</Dialog.Title>
                        <Dialog.Description>
                            Você tem certeza que deseja encerrar a temporada atual e criar uma nova? essa ação não pode ser desfeita
                        </Dialog.Description>
                        <form className="mt-4 flex gap-4 flex-col" onSubmit={(e) =>{handleCreateNewSeason(e)}}>
                            <label htmlFor="seasonName" className="flex flex-col gap-2" >
                                Nome da temporada:
                                <input type="text" className="bg-zinc-400 h-8 cursor-auto pl-2" id="seasonName" name="seasonName" value={newSeasonName} onChange={(e) => setNewSeasonName(e.target.value)}/>
                            </label>

                            <div className="flex flex-row gap-4 mt-4 items-center justify-end">
                                <Button type="submit" aria-label="Close" className='h-12 flex text-center bg-violet-500 justify-center items-center p-1'>
                                    Criar temporada
                                </Button>

                                <Button type="button" aria-label="Close" className='h-12 flex text-center bg-violet-500 justify-center items-center p-1' onClick={() => {setModalController({ ...modalController, newSeasonModal:false })}}>
                                    Fechar
                                </Button>
                            </div>
                        </form>


                        <Dialog.Close asChild>
                            <button className="IconButton" aria-label="Close" onClick={() => {setModalController({ ...modalController, tournamentModal:false })}}>
                                <X />
                            </button>
                        </Dialog.Close>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </div>
    )
}

