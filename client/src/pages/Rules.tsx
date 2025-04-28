import React from "react";
import "../styles/Rules.css";

export default function Rules() {
  return (
    <div className="rules-container">
      <header className="rules-header">
        <h1>Regulile jocului Monopoly Empire</h1>
      </header>

      <main className="rules-content">
        <section className="section">
          <h2>📘 Despre joc</h2>
          <p>
            Monopoly Empire este o versiune modernă a clasicului joc Monopoly, în care jucătorii cumpără branduri celebre și construiesc turnul lor pentru a domina piața.
            Obiectivul este să fii primul care își umple turnul cu logourile brandurilor.
          </p>
        </section>

        <section className="section">
          <h2>🎯 Obiectivul jocului</h2>
          <p>
            Câștigă jocul fiind primul jucător care umple complet turnul său de imperiu.
            Achiziționează branduri valoroase, colectează chirii și sabotează avansul adversarilor.
          </p>
        </section>

        <section className="section">
          <h2>🧩 Cum se joacă</h2>
          <ul>
            <li>🔄 Fiecare jucător își începe turul aruncând zarul.</li>
            <li>🏢 Dacă aterizează pe o casetă liberă, pot cumpăra brandul afișat.</li>
            <li>💸 Dacă alt jucător deține acel brand, trebuie plătită chirie.</li>
            <li>🎁 Cărțile „Empire” sau „Fortune” pot influența jocul – bonusuri, penalizări, schimbări de branduri.</li>
            <li>📦 Brandurile achiziționate se adaugă vertical în turnul personal.</li>
          </ul>
        </section>

        <section className="section">
          <h2>🏆 Cum câștigi</h2>
          <p>
            Jucătorul care reușește să își completeze primul turnul cu logouri este declarat câștigător. Alege strategic ce branduri cumperi și când să le schimbi sau pierzi.
          </p>
        </section>

        <section className="section">
          <h2>💡 Sfaturi utile</h2>
          <ul>
            <li>Investește în branduri valoroase la începutul jocului.</li>
            <li>Folosește cărțile „Empire” la momentul potrivit pentru a bloca adversarii.</li>
            <li>Nu cheltui toți banii imediat – vei avea nevoie și pentru chirii!</li>
            <li>Fii atent la ordinea logourilor în turn – unele pot fi mutate!</li>
          </ul>
        </section>
      </main>

      <footer className="rules-footer">
        &copy; {new Date().getFullYear()} Monopoly Empire – Distracție strategică garantată!
      </footer>
    </div>
  );
}
