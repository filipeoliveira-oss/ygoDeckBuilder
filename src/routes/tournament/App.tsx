
import { ShootingStars } from '../../Components/ui/shootingStars';
import { StarsBackground } from '../../Components/ui/starsBackground';
import ScreenLoader from '../../Components/ui/screenLoader';
import { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import TournamentLogged from '../../Components/TournamentLogged';
import TournamentHeader from '../../Components/TournamentHeader';
import { Tables } from '../../helpers/supabase';
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa, } from '@supabase/auth-ui-shared'
import { supabase } from '../../helpers/utils';
import { Session } from '@supabase/supabase-js';

export default function Tournament() {

    const [loader, setLoader] = useState(false)
    const [tournamentId, setTournamentId] = useState<number>(0)
    const [tournamentName, setTournamentName] = useState<string>('')
    const [competitors, setCompetitors] = useState<Array<Tables<'competitors'>>>([])
    const [userTournaments,setUserTournaments] = useState<Array<any>>([])
    const [session, setSession] = useState<Session | null>(null)
    const [tournamentDetail, setTournamentDetail] = useState<Tables<'tournaments'>>()
    const [seasons, setSeasons] = useState<Tables<'seasons'>[]>([])

    async function getTournamentsByUser(){
        const {data, error} = await supabase.from('competitors')
        .select('joinned_at, tournaments(tournament_id, tournament_name, active, is_public)')
        .eq('competitor_email',(session?.user?.email || ''))
        .eq('competitor_status', 'APPR')

        if(error){
            throw new Error('Algo inesperado aconteceu, tente novamente!')
        }

        return data
    }

    async function getUsersByTournament() {
        const {data, error} = await supabase.from('competitors').select().eq('tournament_id', tournamentId)

        if(error){
            throw new Error('Ocorreu um erro inesperado, tente novamente')
        }

        return data
    }

    async function getTournamentDetails(){
        const {data, error} = await supabase.from('tournaments').select().eq('tournament_id', tournamentId)

        if(error){
            throw new Error('Ocorreu um erro na requisição, tente novamente')
        }

        return data
    }

    async function getSeasonsForTournament() {
        const {data, error} = await supabase.from('seasons').select().eq('tournament_id', tournamentId).order('season_id',{ascending:false})

        if(error){
            throw new Error('Ocorreu um erro na requisição das temporadas, tente novamente')
        }

        return data
    }


    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
        })

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
            
        })
        return () => subscription.unsubscribe()
    }, [])



    useEffect(() =>{
        if(session){
            getTournamentsByUser().then((res) =>{
                setUserTournaments(res)

                let last = res.sort((a:any, b:any) => a.joinned_at - b.joinned_at)

                setTournamentId(last[0].tournaments?.tournament_id || 0)
                setTournamentName(last[0].tournaments?.tournament_name || '')
                
            })
        }
    },[session])

    useEffect(() =>{
        if(tournamentId){
            getUsersByTournament().then((res) =>{
                setCompetitors(res)
            })

            getTournamentDetails().then((tournamentDetail) =>{
                //@ts-ignore
                setTournamentDetail(tournamentDetail[0])
            })

            getSeasonsForTournament().then((seasons) =>{
                setSeasons(seasons)
            })
        }
    },[tournamentId])

    const AuthForm = () => {
        return (
            <div className='w-full h-full flex justify-center items-center'>
                <div className='h-fit w-[30%] flex flex-col justify-center bg-zinc-700 gap-8 px-4 '>
                    <Auth
                        supabaseClient={supabase}
                        appearance={{ theme: ThemeSupa, variables: { default: { space: { buttonPadding: '.5rem 0px' }, colors: { inputText: '#ffffff' } } } }}
                        providers={['discord']}
                        redirectTo='/tournament'
                    />
                    <a className='text-zinc-400 text-center cursor-pointer pb-4' href='/'>Voltar para Yu-Gi-Oh Deck builder</a>
                </div>
            </div>
        )
    }

    return (
        <>
            <ShootingStars starWidth={20} starHeight={2} minDelay={3000} maxDelay={4200} />
            <StarsBackground starDensity={0.00130} />
            {loader && <ScreenLoader />}
            <ToastContainer />
            <div className='flex flex-1 flex-col relative h-[100dvh]'>
                {session /*LOGGED*/ ?
                    <>
                        <TournamentHeader 
                            competitors={competitors} 
                            tournamentId={tournamentId} 
                            setCompetitors={setCompetitors} 
                            userSession={session.user} 
                            setTournamentId={setTournamentId}
                            userTournaments={userTournaments}
                            tournamentName={tournamentName}
                            tournamentDetail={tournamentDetail}
                            setUserTournaments={setUserTournaments}
                            setTournamentName={setTournamentName}
                            setLoader={setLoader}
                            setSeasons={setSeasons}
                            />
                        <TournamentLogged userSession={session.user} setLoader={setLoader} seasons={seasons}/>
                    </>
                    :
                    <AuthForm />
                }
            </div>
        </>
    )
}