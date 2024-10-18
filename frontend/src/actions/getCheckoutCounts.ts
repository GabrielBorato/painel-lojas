// getCheckoutCounts.ts
'use server';
import dotenv from 'dotenv';
import oracledb from 'oracledb';

dotenv.config();
const dbUser = process.env.CONSINCO_DB_USER;
const dbPassword = process.env.CONSINCO_DB_PASSWORD;
const dbString = process.env.CONSINCO_DB_CONNECT_STRING;

export async function getCheckoutCounts() {
    try {
        console.log('Iniciando Oracle Client...');
        await oracledb.initOracleClient();

        console.log('Conectando ao banco de dados...');

        const conn = await oracledb.getConnection({
            user: dbUser,
            password: dbPassword,
            connectString: dbString
        });

        console.log('Executando query para contagem de checkouts...');
        const result = await conn.execute(
            `SELECT 
                tc.NROEMPRESA,
                COUNT(tc.NROCHECKOUT) AS TOTAL_CHECKOUTS
            FROM 
                CONSINCOMONITOR.TB_CHECKOUT tc 
            WHERE 
                tc.ativo = 'S'
                AND (tc.NROEMPRESA != 1 OR tc.NROCHECKOUT NOT IN (97, 98, 99))
                AND tc.NROCHECKOUT != 100
            GROUP BY 
                tc.NROEMPRESA
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
