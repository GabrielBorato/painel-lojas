'use client';
import * as XLSX from 'xlsx';

// Define a interface para as propriedades do componente
interface ExpButtonProps {
    getSelectedLojas: () => Record<string, any>[];  
    getCheckoutCounts: () => Record<string, any>[]; 
    getSizeStores: () => Record<string, any>[];
}

export default function ExpButton(props: ExpButtonProps) {
    const handleExport = () => {
        const selectedLojas = props.getSelectedLojas();  
        const checkoutCounts = props.getCheckoutCounts();  
        const sizeStores = props.getSizeStores();  

        if (selectedLojas.length === 0) {
            alert("Nenhuma loja foi selecionada para exportação!");
            return;
        }

        const dataToExport = selectedLojas.map((loja) => {
            const checkoutCount = checkoutCounts.find(count => count.NROEMPRESA === loja.SEQPESSOA);
            return {
                Loja: loja.SEQPESSOA || 'Não registrado',
                Nome: loja.FANTASIA || 'Não registrado',
                'Razão Social': loja.NOMERAZAO || 'Não registrado',
                CNPJ: loja.CNPJ || 'Não registrado',
                'Inscrição Estadual': loja.INSCRICAORG || 'Não registrado',
                GLN: loja.codediempresa || 'Não registrado',
                Bairro: loja.BAIRRO || 'Não registrado',
                Logradouro: loja.LOGRADOURO || 'Não registrado',
                Número: loja.NROLOGRADOURO || 'Não registrado',
                Cidade: loja.CIDADE || 'Não registrado',
                UF: loja.UF || 'Não registrado',
                CEP: loja.CEP_FORMATADO || 'Não registrado',
                Telefone: (loja.FONEDDD1 && loja.FONENRO1) ? `(${loja.FONEDDD1}) ${loja.FONENRO1}` : 'Não registrado',
                PDVs: checkoutCount ? checkoutCount.TOTAL_CHECKOUTS : 0,
                'Porte Empresa': loja.descricaoPorte || 'Não registrado', 
                Inauguração: loja.DTANASCFUND ? new Date(loja.DTANASCFUND).toLocaleDateString('pt-BR') : 'N/A'
            };
        });

        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Lojas Selecionadas');

        XLSX.writeFile(workbook, 'lojas_selecionadas.xlsx');
    };

    return (
        <div className="fixed bottom-9 right-12">
            <button 
                onClick={handleExport}
                className="bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg hover:bg-green-800 transition duration-300 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-50"
            >
                Exportar
            </button>
        </div>
    );
}
