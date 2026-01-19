import { useState } from "react";
import "./index.css";

type Vehicle = {
  name: string;
  image: string;
  start: Date;
  end: Date;
  maxKm: number;
};

export default function App() {
  const today = new Date();

  const vehicles: Vehicle[] = [
    {
      name: "BMW iX3",
      image: "/bmw-ix3.png",
      start: new Date("2023-05-30"),
      end: new Date("2027-05-30"),
      maxKm: 62500,
    },
    {
      name: "Cupra Formentor",
      image: "/cupra-formentor.png",
      start: new Date("2025-01-17"),
      end: new Date("2027-01-17"),
      maxKm: 32500,
    },
  ];

  const [kms, setKms] = useState<Record<string, number>>({
    "BMW iX3": 0,
    "Cupra Formentor": 0,
  });

  const calc = (v: Vehicle) => {
    const totalDays = (v.end.getTime() - v.start.getTime()) / 86400000;
    const elapsedDays = Math.max(
      0,
      Math.min(totalDays, (today.getTime() - v.start.getTime()) / 86400000)
    );
    const perDay = v.maxKm / totalDays;
    const allowed = perDay * elapsedDays;
    const diff = allowed - kms[v.name];

    return { totalDays, elapsedDays, perDay, allowed, diff };
  };

  return (
    <>
      <h1>Leasing Kilometer Übersicht</h1>

      <div className="container">
        {vehicles.map((v) => {
          const c = calc(v);
          const ok = c.diff >= 0;

          return (
            <div className="card" key={v.name}>
              <img src={v.image} alt={v.name} />
              <h2>{v.name}</h2>

              <label>
                Aktueller Kilometerstand
                <input
                  type="number"
                  value={kms[v.name]}
                  onChange={(e) =>
                    setKms({ ...kms, [v.name]: Number(e.target.value) })
                  }
                />
              </label>

              <div className="info">
                <p>Laufzeit gesamt: {Math.round(c.totalDays)} Tage</p>
                <p>Vergangen: {Math.round(c.elapsedDays)} Tage</p>
                <p>Erlaubt pro Tag: {c.perDay.toFixed(2)} km</p>
                <div className="allowed-box">
                    Erlaubt bis heute: {Math.round(c.allowed)} km
                </div>
              </div>

              <div className={`status ${ok ? "ok" : "bad"}`}>
                {ok
                  ? `Puffer: ${Math.round(c.diff)} km`
                  : `Überschritten um ${Math.round(-c.diff)} km`}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
