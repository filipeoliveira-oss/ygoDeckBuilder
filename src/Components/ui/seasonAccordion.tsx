import React, { useEffect, useState } from "react";
import * as Accordion from "@radix-ui/react-accordion";
import classNames from "classnames";
import "./SeasonAccordion.css";
import { ChevronDownIcon } from "lucide-react";
import { Tables } from "../../helpers/supabase";
import { supabase } from "../../helpers/utils";
import { toast } from 'react-toastify';
import SeasonScreen from "./seasonScreen";


interface AccordionTriggerProps extends React.ComponentPropsWithoutRef<typeof Accordion.Trigger> {
    children: React.ReactNode;
    className?: string;
}

interface AccordionContentProps extends React.ComponentPropsWithoutRef<typeof Accordion.Content> {
    children: React.ReactNode;
    className?: string;
}

function AccordionTrigger({ children, className, ...props }: AccordionTriggerProps) {
    return (
        <Accordion.Header className="AccordionHeader">
            <Accordion.Trigger className={classNames("AccordionTrigger", className)} {...props}>
                {children}
                <ChevronDownIcon className="AccordionChevron" aria-hidden />
            </Accordion.Trigger>
        </Accordion.Header>
    );
}

function AccordionContent({ children, className, ...props }: AccordionContentProps) {
    return (
        <Accordion.Content className={classNames("AccordionContent", className)} {...props}>
            <div className="AccordionContentText">{children}</div>
        </Accordion.Content>
    );
}

interface results {
    competitorId: number,
    wins: number,
    losses: number,
    competitorName: string
}

interface seasonsFetched {
    seasonId: number,
    battles: Array<results>
}

export default function SeasonAccordion({ seasons, setLoader, competitors }: { seasons: Array<Tables<'seasons'>>, setLoader: Function, competitors:Array<Tables<'competitors'>> }) {

    const [seasonsFetched, setSeasonsFetched] = useState<Array<seasonsFetched>>([])
    const [openItem, setOpenItem] = useState<string>('')

    function getCompetitorName(id: number) {
        let competitor = competitors.filter((competitor: Tables<'competitors'>) => {
            return competitor.competitor_id === id
        })

        return competitor[0]?.name
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
            competitorName: getCompetitorName(competitorId)
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

    async function handleClick(seasonId: string) {
        if (seasonId === '') {
            setOpenItem(seasonId)
            return
        }

        let index = seasonsFetched.findIndex((season: seasonsFetched) => {
            return season.seasonId === parseInt(seasonId)
        })

        if (index == -1) {
            // setLoader(true)

            const { data, error } = await supabase.from('battles').select().eq('season_id', parseInt(seasonId))

            if (error) {
                toast.error('Ocorreu um erro ao buscar essa temporada, tente novamente')
                // setLoader(false)
                return
            }

            let aux = [...seasonsFetched]
            
            const sorted = await sortBattles(data)

            aux.push({
                seasonId: parseInt(seasonId),
                battles: sorted
            })

            setSeasonsFetched(aux)
        }
        
        setOpenItem(seasonId)
    }



    return (
        <Accordion.Root className="AccordionRoot" type="single" collapsible onValueChange={(value) => handleClick(value)} value={openItem}>
            {seasons.map((season: Tables<'seasons'>) => {
                const curr = seasonsFetched.filter((seasonFetched:seasonsFetched) =>{
                    return seasonFetched.seasonId == season.season_id
                })

                return (
                    <Accordion.Item className="AccordionItem" value={String(season.season_id)} key={season.season_id} onClick={() => console.log('click')}>
                        <AccordionTrigger>{season.season_name}</AccordionTrigger>
                        <AccordionContent>
                            {curr[0]?.battles?.length > 0 ? <SeasonScreen seasonResults={curr[0].battles}/> : <span>Não existem dados disponíveis para essa temporada</span>} 
                        </AccordionContent>
                    </Accordion.Item>
                )
            })}
        </Accordion.Root>
    );
}
