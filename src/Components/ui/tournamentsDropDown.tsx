import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import './dropDown.css';
import { Action } from './headerAction';
import { useEffect, useState } from 'react';
import { Check, X } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import CreateNewTournament from './createNewTournament';
import { supabase } from '../../helpers/utils';
import { toast } from 'react-toastify';
import { User } from '@supabase/supabase-js';
import JoinTournament from './joinTournament';
import { Tables } from '../../helpers/supabase';

interface tournamentDropdow {
    // tournamentId:number,
    setTournamentId: Function,
    userTournaments: Array<userTournaments>,
    tournamentId: number,
    setLoader: Function,
    userSession: User,
    setTournaments: Function,
    duelCode: string | null
}

interface userTournaments {
    joinned_at: Date,
    tournaments: {
        active:boolean,
        is_public:boolean
        tournament_id:number
        tournament_name:string
    }
}

export default function TournamentDropdown({ setTournamentId, userTournaments, tournamentId, setLoader, userSession, setTournaments, duelCode }: tournamentDropdow) {

    const [selected, setSelected] = useState<number>(0)
    const [newTournamentModal, setNewTournamentModal] = useState(false)
    const [newTournamentName, setNewTournamentName] = useState('')
    const [newTournamentPublic, setNewTournamentPublic] = useState<boolean>(false)
    const [joinTournamentModal, setJoinTournamentModal] = useState(false)
    const [joinTournamentCode, setJoinTournamentCode] = useState('')
    const [seasonName, setSeasonName] = useState('')

    function handleChange(e: string) {
        setTournamentId(parseInt(e))
        setSelected(parseInt(e))
    }

    useEffect(() => {
        setSelected(tournamentId)
    }, [tournamentId])

    async function handleCreation(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()


        setLoader(true)
        const { data: TournamentData, error: TournamentError } = await supabase.from('tournaments').insert({
            active: true,
            is_public: newTournamentPublic,
            tournament_name: newTournamentName
        }).select()

        if (TournamentError) {
            toast.error('Ocorreu um erro durante a criação do torneio, tente novamente.')
            return
        }

        if (TournamentData) {
            const { error: CompetitorError } = await supabase.from('competitors').insert({
                name: userSession.user_metadata.full_name,
                tournament_id: TournamentData[0]?.tournament_id,
                competitor_email: userSession.email,
                isAdmin: true
            })
            
            const {error: SeasonError} = await supabase.from('seasons').insert({
                tournament_id: TournamentData[0]?.tournament_id,
                season_name:seasonName || 'Temporada 1',
                season_status:"CURRENT"
            })

            if (CompetitorError || SeasonError) {
                toast.error('Ocorreu um erro durante a criação do torneio, tente novamente.')
                return
            }
        }


        const { data: Tournaments, error: TournamentsError } = await supabase.from('competitors').select(`tournaments(tournament_id, tournament_name, active, is_public)`).eq('competitor_email', (userSession.email || ''))

        if (!TournamentsError) {
            setTournaments(Tournaments)
            toast.success('Torneio criado com sucesso!')
        }
        setLoader(false)
    }

    async function handleJoinTournament(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        if (!joinTournamentCode) {
            toast.error('Digite um código válido')
            return
        }

        setLoader(true)
        const { data, error } = await supabase.from('tournaments').select().eq('tournament_id', joinTournamentCode).limit(1).returns<Tables<'tournaments'>[]>()

        if (error) {
            toast.error('Algo inesperado aconteceu, tente novamente!')
            return
        }

        if (data.length < 1) {
            toast.error('Esse código de torneio não existe')
            return
        }

        if (data[0].active === false) {
            toast.error('Esse torneio não está mais disponível')
            return
        }

        if (data[0].is_public === false) {

            const { data, error } = await supabase.from('competitors').select().eq("tournament_id", joinTournamentCode).eq("competitor_status", "WAPPR")

            if (error) {
                toast.error('Ocorreu um erro inesperado, tente novamente!')
                return
            }

            if (data.length > 0) {
                if (userSession.email) {
                    const { error } = await supabase.from('competitors')
                        .update({
                            competitor_status: "APPR"
                        })
                        .eq("competitor_email", userSession.email)
                        .eq("tournament_id", joinTournamentCode)


                    if (error) {
                        toast.error('Ocorreu um erro inesperado, tente novamente!')
                        return
                    }
                }
            } else {
                setJoinTournamentModal(false)
                setLoader(false)
                toast.error('Seu email não consta na lista de convidados ou você já está nesse torneio. Por favor, entre em contato com um administrador')
                return
            }
        }

        if (data[0].is_public === true) {
            const { error } = await supabase.from('competitors').insert({
                name: userSession.user_metadata.full_name,
                tournament_id: parseInt(joinTournamentCode),
                competitor_email: userSession.email,
            })

            if (error) {
                toast.error('Ocorreu um erro na inserção, tente novamente')
                return
            }
        }

        const { data: Tournaments, error: TournamentsError } = await supabase.from('competitors').select(`tournaments(tournament_id, tournament_name, active, is_public)`).eq('competitor_email', (userSession.email || '')).eq("competitor_status", "APPR")

        if (!TournamentsError && Tournaments?.length > 0) {
            setTournaments(Tournaments)
            toast.success('Juntou-se com sucesso!')
        }

        setLoader(false)
    }

    useEffect(() => {
        if (duelCode) {
            setJoinTournamentModal(true)
            setJoinTournamentCode(duelCode)
        }
    }, [])

    return (
        <>
            <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                    <Action>Torneios</Action>
                </DropdownMenu.Trigger>

                <DropdownMenu.Portal>
                    <DropdownMenu.Content className="DropdownMenuContent" sideOffset={5}>
                        <DropdownMenu.Label className="DropdownMenuLabel">Torneios disponíveis</DropdownMenu.Label>
                        <DropdownMenu.RadioGroup onValueChange={(e) => handleChange(e)} >
                            {userTournaments?.map((tournament: any) => {
                                return (
                                    <DropdownMenu.RadioItem className="DropdownMenuRadioItem cursor-pointer" value={tournament.tournaments.tournament_id} key={tournament.tournaments.tournament_id}>
                                        {selected == tournament.tournaments.tournament_id && <Check className='absolute -translate-x-6' />}
                                        {tournament.tournaments.tournament_name}
                                    </DropdownMenu.RadioItem>
                                )
                            })}
                        </DropdownMenu.RadioGroup>

                        <DropdownMenu.Separator className="DropdownMenuSeparator" />

                        <span className="DropdownMenuRadioItem cursor-pointer" onClick={() => setJoinTournamentModal(true)}>Entrar em um torneio</span>
                        <span className="DropdownMenuRadioItem cursor-pointer" onClick={() => setNewTournamentModal(true)}>Criar novo torneio</span>

                        <DropdownMenu.Arrow className="DropdownMenuArrow" />
                    </DropdownMenu.Content>
                </DropdownMenu.Portal>
            </DropdownMenu.Root>

            <Dialog.Root open={newTournamentModal}>
                <Dialog.Portal>
                    <Dialog.Overlay className="DialogOverlay " />
                    <Dialog.Content className="DialogContent bg-zinc-700 text-white border-2 border-violet-500 w-96">

                        <CreateNewTournament changeNameFunction={setNewTournamentName} handlePublic={setNewTournamentPublic} tournamentName={newTournamentName} handleSubmit={handleCreation} changeSeasonName={setSeasonName} seasonName={seasonName}/>
                        <Dialog.Close asChild>
                            <button className="IconButton" aria-label="Close" onClick={() => { setNewTournamentModal(false) }}>
                                <X />
                            </button>
                        </Dialog.Close>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>

            <Dialog.Root open={joinTournamentModal}>
                <Dialog.Portal>
                    <Dialog.Overlay className="DialogOverlay " />
                    <Dialog.Content className="DialogContent bg-zinc-700 text-white border-2 border-violet-500 w-96">
                        <div className='flex gap-4 flex-col'>
                            <JoinTournament changeCode={setJoinTournamentCode} code={joinTournamentCode} handleSubmit={handleJoinTournament} />
                        </div>
                        <Dialog.Close asChild>
                            <button className="IconButton" aria-label="Close" onClick={() => { setJoinTournamentModal(false) }}>
                                <X />
                            </button>
                        </Dialog.Close>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </>
    );
};

