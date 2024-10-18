// getErrors.ts
'use server';
import dotenv from 'dotenv';
import oracledb from 'oracledb';

dotenv.config();
const dbUser = process.env.CONSINCO_DB_USER;
const dbPassword = process.env.CONSINCO_DB_PASSWORD;
const dbString = process.env.CONSINCO_DB_CONNECT_STRING;

export async function getStores() {
    try {
        console.log('Iniciando Oracle Client...');
        await oracledb.initOracleClient();

        console.log('Conectando ao banco de dados...');
        
        const conn = await oracledb.getConnection({
            user: dbUser,
            password: dbPassword,
            connectString: dbString
        });

        console.log('Executando query...');
        const result = await conn.execute(
            `SELECT 
            A.*, 
            fc5cpfcnpjmask(A.NROCGCCPF, A.DIGCGCCPF, A.FISICAJURIDICA) AS CNPJ,
            SUBSTR(A.CEP, 1, 5) || '-' || SUBSTR(A.CEP, 6, 3) AS CEP_FORMATADO
            FROM 
            ge_pessoa A
            WHERE 
            A.SEQPESSOA < 1000
            AND A.SEQPESSOA NOT BETWEEN 500 AND 513
            `
        );

        console.log('Query executada com sucesso');

        if (!result.metaData) {
            console.log('Nenhuma metaData encontrada');
            return [];
        }

        if (!result.rows) {
            console.log('Nenhuma linha encontrada');
            return [];
        }

        const columns: string[] = result.metaData.map((column) => column.name);

        const rows = result.rows.map((row) => {
            const rowData: Record<string, string | number | Date> = {};
            (row as any[]).forEach((value, index) => {
                rowData[columns[index]] = value;
            });
            return rowData;
        });

        console.log('Retornando resultados:');    
        return rows;
    } catch (error) {
        console.error('Erro ao executar a query:', error);
        return [];
    }
}
