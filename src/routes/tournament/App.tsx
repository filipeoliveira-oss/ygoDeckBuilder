
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
import { useSetRecoilState } from 'recoil';
import { isAdminAtom } from '../../helpers/atoms';

export default function Tournament() {

    //Loader
    const [loader, setLoader] = useState(false)

    //Tournaments
    const [tournaments, setTournaments] = useState<Array<Tables<'tournaments'>>>([])
    const [tournamentId, setTournamentId] = useState<number>(0)
    const [tournamentName, setTournamentName] = useState<string>('')
    const [userTournaments,setUserTournaments] = useState<Array<any>>([])
    const [tournamentDetail, setTournamentDetail] = useState<Tables<'tournaments'>>()
    const [seasons, setSeasons] = useState<Tables<'seasons'>[]>([])

    //Competitors
    const [competitors, setCompetitors] = useState<Array<Tables<'competitors'>>>([])
    const [session, setSession] = useState<Session | null>(null)
    const setIsAdmin = useSetRecoilState(isAdminAtom)

    async function getTournamentsByUser(){
        setLoader(true)
        const {data, error} = await supabase.from('competitors')
        .select('joinned_at, tournaments(tournament_id, tournament_name, active, is_public)')
        .eq('competitor_email',(session?.user?.email || ''))
        .eq('competitor_status', 'APPR')

        if(error){
            setLoader(false)
            throw new Error('Algo inesperado aconteceu, tente novamente!')
        }
        setLoader(false)

        return data
    }

    async function getUsersByTournament() {
        setLoader(true)

        const {data, error} = await supabase.from('competitors').select().eq('tournament_id', tournamentId)

        if(error){
            setLoader(false)
            throw new Error('Ocorreu um erro inesperado, tente novamente')
        }
        setLoader(false)

        return data
    }

    async function getTournamentDetails(){
        setLoader(true)

        const {data, error} = await supabase.from('tournaments').select().eq('tournament_id', tournamentId)

        if(error){
            setLoader(false)

            throw new Error('Ocorreu um erro na requisição, tente novamente')
        }
        setLoader(false)
        return data
    }

    async function getSeasonsForTournament() {
        setLoader(true)

        const {data, error} = await supabase.from('seasons').select().eq('tournament_id', tournamentId).order('season_id',{ascending:false})

        if(error){
            setLoader(false)
            throw new Error('Ocorreu um erro na requisição das temporadas, tente novamente')
        }
        setLoader(false)
        return data
    }

    useEffect(() => {
        if(!session){
            supabase.auth.getSession().then(({ data: { session } }) => {
                setSession(session)
            })
    
            const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
                setSession(session)
                
            })

            return () => subscription.unsubscribe()
        }
    }, [])

    useEffect(() =>{
        if(session && userTournaments.length == 0){
            getTournamentsByUser().then((res) =>{
                setUserTournaments(res)

                let last = res.sort((a:any, b:any) => a.joinned_at - b.joinned_at)

                setTournamentId(last[0].tournaments?.tournament_id || 0)
                setTournamentName(last[0].tournaments?.tournament_name || '')
                
            })
        }
    },[session])

    useEffect(() =>{
        if(tournamentId && competitors.length === 0){
            getUsersByTournament().then((res) =>{
                setCompetitors(res)

                let currentUser = res.filter((each:Tables<'competitors'>) =>{
                    return each.competitor_email === session?.user.email
                })

                setIsAdmin(currentUser[0].isAdmin)
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
            <div style={loader ? {} : {display:'none'}}>
                <ScreenLoader/>
            </div>
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
                            setTournaments={setTournaments}
                        />
                        <TournamentLogged userSession={session.user} setLoader={setLoader} seasons={seasons} competitors={competitors} setTournaments={setTournaments} tournaments={tournaments}/>
                    </>
                    :
                    <AuthForm />
                }
            </div>
        </>
    )
}