import React, { useEffect, useState } from "react"
import { supabase } from "../helpers/utils"
import NoTournament from "./noTournament"
import { User } from '@supabase/supabase-js';
import { Tables } from "../helpers/supabase";
import { toast } from 'react-toastify';
import { Plus, X } from "lucide-react";
import { Button } from "./ui/button";
import * as Dialog from '@radix-ui/react-dialog';
import SelectElement from "./ui/select";
import SeasonAccordion from "./ui/seasonAccordion";
import SeasonScreen from "./ui/seasonScreen";
import Brackets from "./ui/brackets";

interface tournamentLoged {
    userSession: User,
    setLoader: Function,
    seasons: Array<Tables<'seasons'>>,
    competitors: Array<Tables<'competitors'>>,
    tournaments: Array<Tables<'tournaments'>>,
    setTournaments: Function,
    duelCode: string | null,
    setTournamentId: Function,
    currentSeasonResults: Array<results>,
    setCurrentSeasonResults: Function
}

interface results {
    competitorId: number,
    wins: number,
    losses: number,
    competitorName: string,
    photoUrl: string,
}

export default function TournamentLogged({ userSession, setLoader, seasons, competitors, setTournaments, tournaments, duelCode, setTournamentId, currentSeasonResults, setCurrentSeasonResults }: tournamentLoged) {

    // const [currentSeasonResults, setCurrentSeasonResults] = useState<Array<results>>([])
    const [duels, setDuels] = useState<Tables<'battles'>[]>([])
    const [newDuelModal, setNewDuelModal] = useState(false)

    //New Duel
    const [firstCompetitorId, setfirstCompetitorId] = useState('')
    const [SecondCompetitorId, setSecondCompetitorId] = useState('')
    const [fcompetitorResult, setFcompetitorResult] = useState<number>(0)
    const [scompetitorResult, setScompetitorResult] = useState<number>(0)

    async function getTournaments() {
        setLoader(true)

        const { data, error } = await supabase.from('competitors')
            .select(`tournaments(tournament_id, tournament_name, active, is_public)`)
            .eq('competitor_email', (userSession.email || ''))
            .eq('competitor_status', 'APPR')

        if (error) {
            throw new Error('Error during tournaments fetching')
        }

        setLoader(false)
        return data
    }

    function getCompetitorName(id: number) {
        let competitor = competitors.filter((competitor: Tables<'competitors'>) => {
            return competitor.competitor_id === id
        })

        return [competitor[0]?.name, competitor[0]?.photo_url]
    }

    async function sortBattles(battles: Tables<'battles'>[]) {
        const resultMap = new Map();

        battles.forEach(battle => {
            const { first_competitor, fcompetitor_result, second_competitor, scompetitor_result } = battle;


            if (!resultMap.has(first_competitor)) {
                resultMap.set(first_competitor, { wins: 0, losses: 0 });
            }


            if (!resultMap.has(second_competitor)) {
                resultMap.set(second_competitor, { wins: 0, losses: 0 });
            }


            resultMap.get(first_competitor).wins += fcompetitor_result;
            resultMap.get(first_competitor).losses += scompetitor_result;


            resultMap.get(second_competitor).wins += scompetitor_result;
            resultMap.get(second_competitor).losses += fcompetitor_result;
        });


        const results = Array.from(resultMap, ([competitorId, stats]) => ({
            competitorId,
            wins: stats.wins,
            losses: stats.losses,
            competitorName: getCompetitorName(competitorId)[0] || '',
            photoUrl: getCompetitorName(competitorId)[1] || ''
        }));


        let sorted = results.sort((a, b) => {
            const aHasNotPlayed = a.wins === 0 && a.losses === 0;
            const bHasNotPlayed = b.wins === 0 && b.losses === 0;

            if (aHasNotPlayed && !bHasNotPlayed) return 1;
            if (!aHasNotPlayed && bHasNotPlayed) return -1;

            if (a.wins !== b.wins) {
                return b.wins - a.wins;
            }

            return a.losses - b.losses;
        });

        return sorted
    }


    async function getCurrentSeasonBattles(seasonId: number) {
        setLoader(true)

        const { data, error } = await supabase.from('battles').select().eq("season_id", seasonId).order("created_at", { ascending: true })

        if (error) {
            setLoader(false)
            toast.error('Ocorreu um erro durante a requisição da temporada, tente novamente')
            return
        }

        const sorted = await sortBattles(data).then((res) => {
            return res
        })
        setCurrentSeasonResults(sorted)
        setDuels(data)
        setLoader(false)
    }

    useEffect(() => {
        if (userSession && tournaments.length === 0) {
            getTournaments().then((tournaments: any) => {
                setTournaments(tournaments)
            })
        }
    }, [userSession])

    useEffect(() => {
        if ((seasons.length > 0)) {
            getCurrentSeasonBattles(seasons[0].season_id)
        }
    }, [seasons])

    function closeNewDuel() {
        setNewDuelModal(false)
        setfirstCompetitorId('')
        setSecondCompetitorId('')
        setFcompetitorResult(0)
        setScompetitorResult(0)
    }

    async function createNewDuel() {
        setLoader(true)
        const { error } = await supabase.from('battles').insert({
            first_competitor: parseInt(firstCompetitorId),
            second_competitor: parseInt(SecondCompetitorId),
            fcompetitor_result: fcompetitorResult,
            scompetitor_result: scompetitorResult,
            season_id: seasons[0].season_id
        })

        if (error) {
            setLoader(false)
            toast.error('Ocorreu um erro na inserção do duelo, tente novamente')
            return
        }

        setLoader(false)
        getCurrentSeasonBattles(seasons[0].season_id)
        closeNewDuel()
        toast.success('Duelo inserido com sucesso')

    }

    const BracketsScreen = React.memo(function BracketsScreen() {
        return (
            <>
                {duels?.map((duel: Tables<'battles'>) => {
                    return (
                        <React.Fragment key={duel.battle_id}>
                            <Brackets duel={duel} competitors={competitors} setCurrentResults={getCurrentSeasonBattles} />
                        </React.Fragment>
                    )
                })}
            </>
        )
    })

    const HasTournament = () => {
        return (
            <div className="w-full h-full flex flex-row gap-4 px-4 overflow-hidden p-0 m-0">
                <div className="h-full w-[50%] flex flex-col rounded-tl-2xl rounded-tr-2xl rounded-bl-0 rounded-br-0 border border-zinc-400">
                    <div className='flex w-full h-8 items-center gap-4 deckHeader rounded-tl-2xl rounded-tr-2xl rounded-bl-0 rounded-br-0 justify-between px-4 '>
                        <h1 className='font-semibold text-base tracking-tight leading-normal uppercase'>{seasons.filter((season: Tables<'seasons'>) => { return season.season_status === 'CURRENT' })[0]?.season_name}</h1>
                        <div className="flex flex-row gap-2 cursor-pointer" onClick={() => { setNewDuelModal(true) }}>
                            <Plus />
                            <span>Novo duelo</span>
                        </div>
                    </div>

                    <SeasonScreen seasonResults={currentSeasonResults} />

                    {duels.length !== 0 &&
                        <div className="w-full h-full overflow-y-auto grid grid-cols-brackets gap-y-8 gap-x-4 px-4 pb-2 ">
                            <BracketsScreen />
                        </div>
                    }
                </div>

                <div className="h-full w-[50%] flex flex-col rounded-tl-2xl rounded-tr-2xl rounded-bl-0 rounded-br-0 border border-zinc-400 ">
                    <SeasonAccordion seasons={seasons.filter((season: Tables<'seasons'>) => { return season.season_status === 'OLD' }).sort((a, b) => a.season_id - b.season_id)} setLoader={setLoader} competitors={competitors} />
                </div>
            </div>
        )
    }

    return (
        <>
            <div className="h-full w-full flex flex-row gap-4 overflow-hidden">
                {tournaments && tournaments?.length > 0 ?
                    <HasTournament /> : <NoTournament setLoading={setLoader} setTournaments={setTournaments} userSession={userSession} searchParamsCode={duelCode} setTournamentId={setTournamentId} />
                }
            </div>

            <Dialog.Root open={newDuelModal}>
                <Dialog.Portal>
                    <Dialog.Overlay className="DialogOverlay " />
                    <Dialog.Content className="DialogContent bg-zinc-700 text-white border-2 border-violet-500 w-[35rem]">
                        <Dialog.Title className="DialogTitle text-white">Adicionar novo duelo</Dialog.Title>
                        <div className="mt-4 w-full h-fit justify-between items-center flex">
                            <div className="flex flex-col gap-4">
                                <SelectElement values={competitors.filter((competitor: Tables<'competitors'>) => { return competitor.competitor_status !== "DELETED" }).sort()} changeFunction={setfirstCompetitorId} placeholder="Selecione o competidor 1" label="Duelistas" />
                                <SelectElement values={[0, 1, 2]} changeFunction={setFcompetitorResult} placeholder="Resultado do competidor 1" label="Rounds ganhos" />
                            </div>
                            <X />
                            <div className="flex flex-col gap-4">
                                <SelectElement values={competitors.filter((competitor: Tables<'competitors'>) => { return competitor.competitor_status !== "DELETED" }).sort()} changeFunction={setSecondCompetitorId} placeholder="Selecione o competidor 2" label="Duelistas" />
                                <SelectElement values={[0, 1, 2]} changeFunction={setScompetitorResult} placeholder="Resultado do competidor 2" label="Rounds ganhos" />
                            </div>
                        </div>

                        <div className="flex flex-col w-full h-12  mt-4">
                            {(firstCompetitorId !== '' || SecondCompetitorId !== '') && (firstCompetitorId === SecondCompetitorId) && <span className="text-red-500">Os duelistas não podem ser o mesmo</span>}
                            {(parseInt(String(fcompetitorResult)) + parseInt(String(scompetitorResult))) > 3 && <span className="text-red-500">A soma dos duelos ultrapassa o limite de 3</span>}
                        </div>
                        <div className="w-full h-fit flex mt-4 justify-end">
                            <Button
                                disabled={(firstCompetitorId === SecondCompetitorId) || (parseInt(String(fcompetitorResult)) + parseInt(String(scompetitorResult))) > 3}
                                variant={(firstCompetitorId === SecondCompetitorId) || (parseInt(String(fcompetitorResult)) + parseInt(String(scompetitorResult))) > 3 ? 'secondary' : 'primary'}
                                type="button" aria-label="Close"
                                className='h-12 flex text-center bg-violet-500 justify-center self-end justify-self-end items-center p-1' onClick={() => { createNewDuel() }}>
                                Confirmar
                            </Button>
                        </div>

                        <Dialog.Close asChild>
                            <button className="IconButton" aria-label="Close" onClick={() => { closeNewDuel() }}>
                                <X />
                            </button>
                        </Dialog.Close>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </>
    )
}