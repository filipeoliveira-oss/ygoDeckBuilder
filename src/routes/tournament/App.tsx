
import { ShootingStars } from '../../Components/ui/shootingStars';
import { StarsBackground } from '../../Components/ui/starsBackground';
import ScreenLoader from '../../Components/ui/screenLoader';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import TournamentLogged from '../../Components/TournamentLogged';
import TournamentHeader from '../../Components/TournamentHeader';
import { Tables } from '../../helpers/supabase';
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa, } from '@supabase/auth-ui-shared'
import { supabase } from '../../helpers/utils';
import { Session } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';

export default function Tournament() {

    const [loader, setLoader] = useState(false)
    const [tournamentId, setTournamentId] = useState('')
    const [competitors, setCompetitors] = useState<Array<Tables<'competitors'>>>([])
    const [session, setSession] = useState<Session | null>(null)

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
        })

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            setSession(session)
            
        })

        return () => subscription.unsubscribe()
    }, [])


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
                        <TournamentHeader competitors={competitors} tournamentId={tournamentId} setCompetitors={setCompetitors} />
                        <TournamentLogged userSession={session.user} />
                    </>
                    :
                    <AuthForm />
                }
            </div>
        </>
    )
}