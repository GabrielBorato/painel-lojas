// getEdiCompanies.ts
'use server';
import dotenv from 'dotenv';
import oracledb from 'oracledb';

dotenv.config();
const dbUser = process.env.CONSINCO_DB_USER;
const dbPassword = process.env.CONSINCO_DB_PASSWORD;
const dbString = process.env.CONSINCO_DB_CONNECT_STRING;

export async function getSizeStore() {
    try {
        console.log('Iniciando Oracle Client...');
        await oracledb.initOracleClient();

        console.log('Conectando ao banco de dados...');
        
        const conn = await oracledb.getConnection({
            user: dbUser,
            password: dbPassword,
            connectString: dbString
        });

        console.log('Executando query para EDI...');
        const result = await conn.execute(
            `SELECT A.NROEMPRESA,
            A.PORTEEMPRESA,
            B.DESCRICAO
            FROM 
            MAX_EMPRESAPORTE a
            JOIN MAX_ATRIBUTOFIXO B ON A.PORTEEMPRESA = B.LISTA
            WHERE 0=0
            AND B.TIPATRIBUTOFIXO LIKE '%PORTE%'
            AND A.STATUS = 'A'
            AND A.PORTEEMPRESA LIKE '%CL%'
            ORDER BY A.NROEMPRESA
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
