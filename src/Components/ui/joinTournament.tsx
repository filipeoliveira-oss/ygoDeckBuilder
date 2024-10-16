import { Button } from "./button"
import { useSearchParams } from 'react-router-dom';

interface joinTournament{
    handleSubmit:Function,
    code:string,
    changeCode:Function
}

export default function JoinTournament({changeCode,code,handleSubmit}:joinTournament) {

    const [searchParams, setSearchParams] = useSearchParams();

    function removeParam(){
        const params = new URLSearchParams(searchParams);

        params.delete('code')

        setSearchParams(params)
    }


    return (
        <>
            <span className="text-2xl font-bold">Digite o código do torneio</span>
            <form onSubmit={(e) => { handleSubmit(e), removeParam() }} className="flex flex-col items-center gap-4">
                <input type="number" className="bg-zinc-500 h-20 w-48 text-2xl text-center font-semibold" value={code} onChange={(e) => { changeCode(e.target.value) }} />
                <Button className="w-40 h-8 text-lg">Entrar</Button>
            </form>
        </>
    )
}