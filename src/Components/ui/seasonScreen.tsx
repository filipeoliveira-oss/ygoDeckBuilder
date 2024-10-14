import { Trophy } from "lucide-react"
import Podium from "./Podium"

interface results {
    competitorId: number,
    wins: number,
    losses: number,
    competitorName: string,
    photoUrl:string
}


export default function SeasonScreen({ seasonResults }: { seasonResults: Array<results>  }) {

    function countPodium() {
        let count = 3

        for (let i = 0; i < 3; i++) {
            if (seasonResults[i]?.wins === 0 && seasonResults[i]?.losses === 0) {
                count = count - 1
            }
        }
        return count
    }

    return (
        seasonResults.length === 0 ? <span className="flex text-center text-zinc-300 w-full h-[94dvh] items-center justify-center">Não existem dados de temporadas anteriores</span>
        : 
        <div className="w-full h-fit max-h-[100%] flex flex-col mb-4">
            <div className="w-full h-fit p-4 flex overflow-hidden mt-4 ">
                {seasonResults && <Podium first={seasonResults[0]} second={seasonResults[1]} third={seasonResults[2]} />}
            </div>

            {seasonResults.length >= 4 &&
                <div className="max-h-[30%] h-fit w-full px-4 overflow-auto mt-4">
                    <table className="h-full w-full">
                        <thead >
                            <tr className="text-center text-zinc-400">
                                <td>Colocação</td>
                                <td>Competidor</td>
                                <td>vitórias</td>
                                <td>Derrotas</td>
                            </tr>
                        </thead>

                        <tbody className="w-full h-full ">
                            {seasonResults?.slice(countPodium()).map((competitor: results, index: number) => {
                                return (
                                    <tr className=" cursor-pointer text-center bg-[#1b1f33] h-[2.5rem] hover:bg-[#242a45]" key={index}>
                                        <td className="rounded-tl-lg rounded-bl-lg">
                                            <div className="flex flex-row gap-2 items-center justify-center">
                                                <Trophy stroke="#a1a1aa" />
                                                {index + 4}
                                            </div>
                                        </td>
                                        <td className="capitalize">{competitor.competitorName}</td>
                                        <td >{competitor.wins}</td>
                                        <td className="rounded-tr-lg rounded-br-lg">{competitor.losses}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            }
        </div>
    )
}