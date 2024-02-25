'use client'

import { ChangeEvent, useEffect, useState } from "react";

type Tip = {
  casa: string;
  fora: string;
  palpiteOdd: string;
  repeats: number;
  rating: number;
}

type Bet = {
  tips: Tip[];
  odd: number;
}

import './styles.css'

function getRandom(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function fatorial(n: number): number {
  if (n <= 1) {
    return 1;
  }

  return n * fatorial(n - 1)
}

function getArrays(betQty: number, gamesQty: number, tipsLenght: number): Array<number[]> {
  const arrays = [];

  while (arrays.length < betQty) {

    const array: number[] = [];

    while (array.length < gamesQty) {
      const n = getRandom(0, tipsLenght - 1);
      if (!array.includes(n)) {
        array.push(n)
      }
    }

    array.sort((a, b) => a - b);

    let verify = true;

    arrays.forEach((ar) => {
      if (JSON.stringify(ar) === JSON.stringify(array)) {
        verify = false;
      }
    })

    if (verify) {
      arrays.push(array)
    }
  }

  return arrays;
}

export default function Home() {

  useEffect(() => {
    const _tipsL = localStorage.getItem('tips') as string
    const _betsL = localStorage.getItem('bets') as string
    const tipsL = JSON.parse(_tipsL)
    const betsL = JSON.parse(_betsL)
    if (tipsL) {
      setTips(tipsL)
    }

    if (betsL) {
      setBets(betsL)
    }

    setLoading(false)
  }, [])

  const newTip = {
    casa: '',
    fora: '',
    palpiteOdd: '',
    repeats: 1,
    rating: 5
  }

  const [tips, setTips] = useState<Tip[]>([])
  const [tip, setTip] = useState<Tip>(newTip)
  const [loading, setLoading] = useState(true)
  const [betQty, setBetQty] = useState(1);
  const [gamesQty, SetGamesQty] = useState(10)
  const [betAmount, setBetAmount] = useState(5)
  const [bets, setBets] = useState<Bet[]>([]);

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    const _tip = { ...tip }
    setTip({ ..._tip, [e.target.name]: e.target.value })
  }

  function handleAddTip() {
    const _tips = [...tips];
    _tips.push(tip);
    setTips(_tips);
    setTip(newTip);

    localStorage.setItem('tips', JSON.stringify(_tips))
  }

  function handleRemoveTip(index: number) {
    const _tips = [...tips]
    _tips.splice(index, 1)
    setTips(_tips)

    localStorage.setItem('tips', JSON.stringify(_tips))
  }

  function btnEnabled(): boolean {
    if (tip.casa !== "" && tip.fora !== "" && tip.palpiteOdd !== "") return false

    return true
  }

  async function handleGenerateBets() {

    const up = fatorial(tips.length)
    const down = fatorial(gamesQty) * fatorial(tips.length - gamesQty)
    const limit = up / down

    if (betQty > limit) {
      alert('Quantidade de palpites insuficientes para número de apostas distintas, adicione mais palpites ou diminua a quantidade de apostas geradas!')
      return;
    }

    if (gamesQty >= tips.length) {
      alert('Quantidade de palpites insuficientes, adicione mais palpites!')
      return;
    }

    const _bets: Bet[] = [];

    const arrays = getArrays(betQty, gamesQty, tips.length)


    arrays.forEach((array) => {
      let _bet: Bet = {
        tips: [],
        odd: 0
      };
      array.forEach((n) => {
        _bet.tips.push(tips[n])
      })

      let oddMult = 1
      _bet.tips.forEach((bet) => {
        oddMult *= +bet.palpiteOdd.split('@')[1]
      })

      _bet.odd = oddMult;

      _bets.push(_bet)
    })

    // for (let i = 0; i < betQty; i++) {
    //   let _bet: Bet = {
    //     tips: [],
    //     odd: 0
    //   };

    //   const _tips = [...tips]

    //   while (_bet.tips.length < gamesQty) {
    //     const n = getRandom(0, _tips.length - 1);
    //     _bet.tips.push(_tips[n])
    //     _tips.splice(n, 1)
    //   }

    //   let oddMult = 1;
    //   _bet.tips.forEach((bet => {
    //     oddMult *= +bet.palpiteOdd.split('@')[1]
    //   }))

    //   _bet.odd = oddMult;

    //   _bets.push(_bet)

    // }

    setBets(_bets)
    localStorage.setItem('bets', JSON.stringify(_bets))
  }

  function handleClearBets() {
    const res = prompt('Escreva "limpar" para apagar as apostas ?')
    if (res === 'limpar' || res === 'limpar') {
      setBets([]);
      localStorage.removeItem('bets')
    } else {
      return;
    }
  }

  function handleClearTips() {
    const res = prompt('Escreva "limpar" para apagar os palpites ?')
    if (res === 'limpar' || res === 'limpar') {
      setTips([]);
      localStorage.removeItem('tips')
    } else {
      return;
    }
  }

  if (loading) {
    return (
      <main className="w-full h-full flex items-center justify-center">
        <p>carregando...</p>
      </main>
    )
  }

  return (
    <main className="w-full h-auto min-h-full flex flex-col items-center justify-start p-8">
      <h1 className="text-4xl font.black font m-8">Misturador de Palpites 1.0</h1>
      <div className="flex flex-wrap justify-center items-end gap-2 bg-slate-100 p-4 rounded-md">
        <div className="flex flex-col">
          <label htmlFor="">Casa</label>
          <input className="input" type="text" placeholder="Casa" name="casa" value={tip.casa} onChange={(e) => onChange(e)} />
        </div>
        <div className="flex flex-col">
          <label htmlFor="">Fora</label>
          <input className="input" type="text" placeholder="Fora" name="fora" value={tip.fora} onChange={(e) => onChange(e)} />
        </div>
        <div className="flex flex-col">
          <label htmlFor="">Palpite/Odd</label>
          <input className="input" type="text" placeholder="Palpite/Odd" name="palpiteOdd" value={tip.palpiteOdd} onChange={(e) => onChange(e)} />
        </div>
        <div className="flex flex-col">
          <label htmlFor="">Repetições</label>
          <input disabled className="input" type="number" placeholder="Repetições" name="repeats" value={tip.repeats} onChange={(e) => onChange(e)} />
        </div>
        <div className="flex flex-col">
          <label htmlFor="">{'Classificação (1-5)'}</label>
          <input disabled className="input" type="number" placeholder="Classificação" name="rating" value={tip.rating} onChange={(e) => onChange(e)} />
        </div>
        <button className="btn" type="button" onClick={handleAddTip} disabled={btnEnabled()}>Adicionar</button>
        <button className="btn red" type="button" onClick={handleClearTips} disabled={tips.length === 0}>Limpar palpites</button>
      </div>
      <div className=" mt-8 flex flex-wrap gap-2 bg-slate-100 w-full p-4 items-center justify-center">
        {
          tips.length > 0 ?
            tips.map((tip, index) => (
              <div key={index} className="bg-amber-300 p-2 rounded-md">
                <button onClick={() => handleRemoveTip(index)} className="float-right text-red-600 text-lg"><strong>X</strong></button>
                <p><b>Casa: </b>{tip.casa}</p>
                <p><b>Fora: </b>{tip.fora}</p>
                <p><b>Palpite@Odd: </b>{tip.palpiteOdd}</p>
                <p><b>Repetições: </b>{tip.repeats}</p>
                <p><b>Classificação: </b>{tip.rating}</p>
              </div>
            ))
            :
            <p><b>{'Nenhum palpite ainda :('}</b></p>
        }
      </div>
      <div className="flex gap-2 items-end justify-center mt-8 bg-slate-100 w-3/5">
        <div className="flex flex-col">
          <label htmlFor="">Nº apostas</label>
          <input className="input" type="number" placeholder="nº Apostas" value={betQty} onChange={(e) => setBetQty(+e.target.value)} />
        </div>
        <div className="flex flex-col">
          <label htmlFor="">Q. Jogos p/ aposta</label>
          <input className="input" type="number" max={tips.length - 1} placeholder="Quant. Jogos" value={gamesQty} onChange={(e) => SetGamesQty(+e.target.value)} />
        </div>
        <div className="flex flex-col">
          <label htmlFor="">Valor das apostas</label>
          <input className="input" type="number" placeholder="Valor Ap." value={betAmount} onChange={(e) => setBetAmount(+e.target.value)} />
        </div>
        <button className="btn" onClick={handleGenerateBets}>Gerar Apostas</button>
        <button className="btn red" onClick={handleClearBets} disabled={bets.length === 0}>Limpar Apostas</button>
      </div>
      <div className="flex flex-wrap gap-2 items-end justify-center mt-8 bg-slate-100 w-full">
        {
          bets.length > 0 ?
            bets.map((bet, index) => (
              <div key={index} className="flex flex-col p-4 bg-cyan-600 rounded-md">
                <p className="font-black">{`Aposta nº ${index + 1}`}</p>
                <p>-------------------------------------------------</p>
                {
                  bet.tips.map((tip, index) => (
                    <div key={index} className="flex justify-between gap-2">
                      <p className="text-sm"><i>{`${tip.casa} X ${tip.fora}`}</i></p>
                      <p className="text-xs">{`${tip.palpiteOdd}`}</p>
                    </div>
                  ))
                }
                <p>-------------------------------------------------</p>
                <div className="flex flex-col items-end">
                  <p className="text-sm ">{`odd: ${bet.odd.toFixed(2)}`}</p>
                  <p className="font-black text-sm"><u><b>{`Total: R$ ${(bet.odd * betAmount).toFixed(2)}`}</b></u></p>
                </div>
              </div>
            ))
            :
            <p><b>Nenhuma aposta ainda...</b></p>
        }

      </div>
    </main >
  );
}
