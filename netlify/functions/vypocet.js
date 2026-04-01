exports.handler = async function(event, context) {
    // 1. Ověření, že s námi mluví naše kalkulačka (metoda POST)
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Nepovoleno" };
    }

    // 2. Přijetí dat z formuláře (jakou banku, úvěr a částku uživatel vybral)
    const data = JSON.parse(event.body);

    // === ZDE ZAČÍNÁ SEJF PRO ÚVĚRY ===
    if (data.type === 'loans') {
        const { inst, prod, amtStr } = data.state;
        const amount = parseFloat(amtStr) || 0;

        // 3. NAŠE TAJNÁ DATA (Tohle návštěvník webu nikdy neuvidí)
        const secretLoanData = [
            { id: 'artesa', prods: [{ id: 'firemni', z: 3.214 }] },
            { id: 'burinka', prods: [{ id: 'hypo', z: 5.714 }, { id: 'ss_trend', z: 5.000 }, { id: 'nezajisteny', z: 8.214 }, { id: 'obnova', z: 3.571 }] },
            { id: 'cofidis', prods: [{ id: 'spotrebak', z: 8.929 }, { id: 'konsolidace', z: 8.929 }] },
            { id: 'csas', prods: [{ id: 'hypo', z: 5.357, k: 5.714 }, { id: 'hypo_refin', z: 2.678 }, { id: 'americka', z: 5.357 }, { id: 'spotrebak', z: 8.929 }, { id: 'konsolidace', z: 8.929 }, { id: 'bd_svj', z: 2.143 }, { id: 'bd_svj_vyj', z: 2.857 }, { id: 'preklen', z: 0.381 }, { id: 'invest_do5', z: 3.571 }, { id: 'invest_nad5', z: 2.857 }] },
            { id: 'csob', prods: [{ id: 'spotrebak', z: 8.929 }, { id: 'konsolidace', z: 8.929 }, { id: 'bd_svj', z: 2.857 }, { id: 'podnik_ucel', z: 3.571 }, { id: 'podnik_prov', z: 2.143 }] },
            { id: 'csob_hypo', prods: [{ id: 'hypo_api', z: 5.714 }, { id: 'hypo_noapi', z: 5.357 }, { id: 'hypo_90ltv', z: 4.642 }, { id: 'hypo_prub_poj', z: 2.857, k: 5.714 }, { id: 'hypo_prub_bezpoj', z: 2.143, k: 5.714 }] },
            { id: 'csob_leasing', prods: [{ id: 'podnik_auto', z: 14.286 }] },
            { id: 'essox', prods: [{ id: 'spotrebak', z: 8.929 }, { id: 'firemni', z: 8.929 }] },
            { id: 'fingood', prods: [{ id: 'firemni', z: 3.571 }] },
            { id: 'home_credit', prods: [{ id: 'spotrebak', z: 8.929 }, { id: 'podnik_nemov', z: 10.714 }] },
            { id: 'inbank', prods: [{ id: 'spotrebak', z: 8.929 }] },
            { id: 'kb', prods: [{ id: 'hypo_3', z: 5.714 }, { id: 'hypo_mene3', z: 4.643 }, { id: 'spotrebak', z: 8.929 }, { id: 'konsolidace', z: 8.929 }, { id: 'svj_bd', z: 1.786 }] },
            { id: 'mbank', prods: [{ id: 'hypo_2_5', z: 5.714 }, { id: 'hypo_1_float', z: 4.643 }, { id: 'spotrebak', z: 8.929 }] },
            { id: 'mpss', prods: [{ id: 'radny', z: 3.571 }, { id: 'bydleni', z: 8.929 }, { id: 'rychlo', z: 7.143 }, { id: 'hypo', z: 6.607 }, { id: 'reno', z: 5.357 }] },
            { id: 'oberbank', prods: [{ id: 'hypo', z: 5.714 }] },
            { id: 'partners', prods: [{ id: 'hypo', z: 3.571, k: 5.714 }, { id: 'hypo_zam', z: 1.190, k: 1.900 }, { id: 'spotrebak', z: 7.143, k: 8.928 }, { id: 'spotrebak_zam', z: 2.350, k: 2.940 }] },
            { id: 'rsts', prods: [{ id: 'preklen_fo', z: 8.214 }, { id: 'uver_fo_bez', z: 5.000 }, { id: 'uver_po', z: 3.214 }, { id: 'preklen_po', z: 2.500 }, { id: 'poplatek_po', z: 17.857, base: 10000 }] },
            { id: 'rb', prods: [{ id: 'hypo_3', z: 5.714 }, { id: 'hypo_1_float', z: 4.000 }, { id: 'spotrebak', z: 8.929 }, { id: 'micro', z: 5.714 }, { id: 'firm_invest', z: 3.571 }, { id: 'firm_provoz', z: 1.786 }] },
            { id: 'trinity', prods: [{ id: 'dev', z: 1.071 }, { id: 'splat', z: 1.071 }] },
            { id: 'ucb', prods: [{ id: 'hypo', z: 5.714 }, { id: 'spotrebak', z: 10.714 }, { id: 'svj_bd_5', z: 2.857 }, { id: 'svj_bd_nad5', z: 3.571 }, { id: 'presto_bus', z: 3.571 }] }
        ];

        // 4. Samotný výpočet
        const bnk = secretLoanData.find(b => b.id === inst) || secretLoanData[0];
        const prd = bnk.prods.find(p => p.id === prod) || bnk.prods[0];

        let zC = prd.z || 0;
        let kC = prd.k || prd.z || 0;
        let bs = prd.base || 100000;

        let zRes = (amount / bs) * zC;
        let kRes = (amount / bs) * kC;

        // 5. Odeslání čistého výsledku zpět na web
        return {
            statusCode: 200,
            body: JSON.stringify({ zRes, kRes, zC, kC })
        };
    }

    return { statusCode: 400, body: "Neznámý výpočet" };
};
