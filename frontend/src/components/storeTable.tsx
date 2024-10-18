'use client';
import { getStores } from "@/actions/queryStore";
import { getEdiCompanies } from "@/actions/getEdiCompanies";
import { getSizeStore } from "@/actions/getSizeStore";
import { getCheckoutCounts } from "@/actions/getCheckoutCounts";
import { useEffect, useState } from "react";
import ExpButton from "./ExpButton";

export default function LojaTable() { 
    const [lojas, setLojas] = useState<Record<string, any>[]>([]); 
    const [ediCompanies, setEdiCompanies] = useState<Record<string, any>[]>([]);
    const [checkoutCounts, setCheckoutCounts] = useState<Record<string, any>[]>([]); 
    const [sizeStores, setSizeStores] = useState<Record<string, any>[]>([]);
    const [selectAll, setSelectAll] = useState(false);
    const [selectedLojas, setSelectedLojas] = useState<boolean[]>([]); 

    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchedLojas = await getStores(); 
                const fetchedEdiCompanies = await getEdiCompanies();
                const fetchedCheckoutCounts = await getCheckoutCounts(); 
                const fetchedSizeStores = await getSizeStore(); 

                const mergedData = fetchedLojas.map((loja) => {
                    const ediCompany = fetchedEdiCompanies.find(
                        (edi) => edi.NROEMPRESA === loja.SEQPESSOA
                    );
                    const sizeStore = fetchedSizeStores.find(
                        (size) => size.NROEMPRESA === loja.SEQPESSOA
                    );
                    return {
                        ...loja,
                        codediempresa: ediCompany ? ediCompany.CODEDIEMPRESA : 'Não registrado',
                        descricaoPorte: sizeStore ? sizeStore.DESCRICAO : 'Não registrado',
                    };
                });

                setLojas(mergedData);
                setSelectedLojas(new Array(mergedData.length).fill(false)); 
                setCheckoutCounts(fetchedCheckoutCounts); 
                setSizeStores(fetchedSizeStores);
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
        const intervalId = setInterval(fetchData, 1440 * 60 * 1000);
        return () => clearInterval(intervalId);
    }, []);

    const handleSelectAllChange = () => {
        const newSelectedLojas = selectedLojas.map(() => !selectAll); 
        setSelectedLojas(newSelectedLojas); 
        setSelectAll(!selectAll);
    };

    const handleCheckboxChange = (index: number) => {
        const newSelectedLojas = [...selectedLojas]; 
        newSelectedLojas[index] = !newSelectedLojas[index]; 
        setSelectedLojas(newSelectedLojas); 
        setSelectAll(newSelectedLojas.every(Boolean)); 
    };

  
    const getSelectedLojas = () => {
        console.log("getSelectedLojas called");
        return lojas.filter((_, index) => selectedLojas[index]); 
    };

    
    return (
        <div className="flex max-h-[92%]">
            <div className="flex overflow-auto shadow-lg border rounded-xl w-full">
                <table className="table-auto w-full text-left">
                        <thead className="top-[-1px]">
                        <tr>
                        <th className="px-2 py-2 bg-zinc-300 border break-all font-bold text-xs whitespace-nowrap table-font sticky left-0 z-20">
                            <div className="flex items-center bg-zinc-300 p-2">
                                <input
                                type="checkbox"
                                checked={selectAll}
                                onChange={handleSelectAllChange}
                                className="form-checkbox h-4 w-4 text-blue-600 border-blue-400 rounded focus:ring-blue-500"
                                title="Selecionar todos"
                                />
                                <span className="ml-2">Loja</span>
                            </div>
                            </th>
                            <th className="px-2 py-2 bg-zinc-300 border break-all font-bold text-xs whitespace-nowrap table-font">Nome</th>
                            <th className="px-2 py-2 bg-zinc-300 border break-all font-bold text-xs whitespace-nowrap table-font">Razão Social</th> 
                            <th className="px-2 py-2 bg-zinc-300 border break-all font-bold text-xs whitespace-nowrap table-font">CNPJ</th>
                            <th className="px-2 py-2 bg-zinc-300 border break-all font-bold text-xs whitespace-nowrap table-font">I.E</th>
                            <th className="px-2 py-2 bg-zinc-300 border break-all font-bold text-xs whitespace-nowrap table-font">GLN</th>
                            <th className="px-2 py-2 bg-zinc-300 border break-all font-bold text-xs whitespace-nowrap table-font">Bairro</th>
                            <th className="px-2 py-2 bg-zinc-300 border break-all font-bold text-xs whitespace-nowrap table-font">Logradouro</th>
                            <th className="px-2 py-2 bg-zinc-300 border break-all font-bold text-xs whitespace-nowrap table-font">Número</th>
                            <th className="px-2 py-2 bg-zinc-300 border break-all font-bold text-xs whitespace-nowrap table-font">Cidade</th>
                            <th className="px-2 py-2 bg-zinc-300 border break-all font-bold text-xs whitespace-nowrap table-font">UF</th>
                            <th className="px-2 py-2 bg-zinc-300 border break-all font-bold text-xs whitespace-nowrap table-font">CEP</th>
                            <th className="px-2 py-2 bg-zinc-300 border break-all font-bold text-xs whitespace-nowrap table-font">Telefone</th>
                            <th className="px-2 py-2 bg-zinc-300 border break-all font-bold text-xs whitespace-nowrap table-font">Total PDVs</th>
                            <th className="px-2 py-2 bg-zinc-300 border break-all font-bold text-xs whitespace-nowrap table-font">Porte Loja</th>
                            <th className="px-2 py-2 bg-zinc-300 border break-all font-bold text-xs whitespace-nowrap table-font">Inauguração</th>
                        </tr>
                        </thead>
                        <tbody>
                        {lojas.length > 0 ? (
                            lojas.map((loja, index: number) => (
                            <tr key={index} className={index % 2 === 0 ? 'bg-gray-300' : 'bg-white'}>
                                <td className={`px-2 py-2 border break-all text-xs whitespace-nowrap table-font sticky left-0 z-10 ${index % 2 === 0 ? 'bg-gray-300' : 'bg-white'}`}>
                                <div className="flex items-center">
                                    <input
                                    type="checkbox"
                                    checked={selectedLojas[index]}
                                    onChange={() => handleCheckboxChange(index)}
                                    className="form-checkbox h-4 w-4 text-blue-600 border-blue-400 rounded focus:ring-blue-500"
                                    />
                                    <span className="ml-2 font-bold">{loja.SEQPESSOA || 'Não registrado'}</span>
                                </div>
                                    </td>
                                    <td className="px-2 py-2 border break-all font-bold text-xs whitespace-nowrap table-font">
                                        {loja.FANTASIA || 'Não registrado'} 
                                    </td>
                                    <td className="px-2 py-2 border break-all font-bold text-xs whitespace-nowrap table-font">
                                        {loja.NOMERAZAO || 'Não registrado'} 
                                    </td>
                                    <td className="px-2 py-2 border break-all font-bold text-xs whitespace-nowrap table-font">
                                        {loja.CNPJ || 'Não registrado'} 
                                    </td>
                                    <td className="px-2 py-2 border break-all font-bold text-xs whitespace-nowrap table-font">
                                        {loja.INSCRICAORG || 'Não registrado'} 
                                    </td>
                                    <td className="px-2 py-2 border break-all font-bold text-xs whitespace-nowrap table-font">
                                        {loja.codediempresa || 'Não registrado'} 
                                    </td>
                                    <td className="px-2 py-2 border break-all font-bold text-xs whitespace-nowrap table-font">
                                        {loja.BAIRRO || 'Não registrado'} 
                                    </td>
                                    <td className="px-2 py-2 border break-all font-bold text-xs whitespace-nowrap table-font">
                                        {loja.LOGRADOURO || 'Não registrado'} 
                                    </td>
                                    <td className="px-2 py-2 border break-all font-bold text-xs whitespace-nowrap table-font">
                                        {loja.NROLOGRADOURO || 'Não registrado'} 
                                    </td>
                                    <td className="px-2 py-2 border break-all font-bold text-xs whitespace-nowrap table-font">
                                        {loja.CIDADE || 'Não registrado'} 
                                    </td>
                                    <td className="px-2 py-2 border break-all font-bold text-xs whitespace-nowrap table-font">
                                        {loja.UF || 'Não registrado'} 
                                    </td>
                                    <td className="px-2 py-2 border break-all font-bold text-xs whitespace-nowrap table-font">
                                        {loja.CEP_FORMATADO || 'Não registrado'} 
                                    </td>
                                    <td className="px-2 py-2 border break-all font-bold text-xs whitespace-nowrap table-font">
                                        {(loja.FONEDDD1 && loja.FONENRO1) ? `(${loja.FONEDDD1}) ${loja.FONENRO1}` : 'Não registrado'} 
                                    </td>
                                    <td className="px-2 py-2 border break-all font-bold text-xs whitespace-nowrap table-font">
                                        {checkoutCounts.find(count => count.NROEMPRESA === loja.SEQPESSOA)?.TOTAL_CHECKOUTS || 0} 
                                    </td>
                                    <td className="px-2 py-2 border break-all font-bold text-xs whitespace-nowrap table-font">
                                        {loja.descricaoPorte || 'Não registrado'}
                                    </td>
                                    <td className="px-2 py-2 border break-all font-bold text-xs whitespace-nowrap table-font">
                                        {loja.DTANASCFUND ? new Date(loja.DTANASCFUND).toLocaleDateString('pt-BR') : 'N/A'} 
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={15} className="text-center py-4">Nenhuma loja encontrada</td> 
                            </tr>
                        )}
                    </tbody>
                </table>
                <ExpButton 
                    getSelectedLojas={getSelectedLojas}
                    getCheckoutCounts={() => checkoutCounts} 
                    getSizeStores={() => sizeStores}
                />
            </div>
        </div>
    );
}