/**
 * Sales record TypeScript interface
 * Represents a single row from the uploaded CSV/XLSX file
 */

export interface SalesRecord {
    Date: string;
    Product_Category: string;
    Region: string;
    Units_Sold: number;
    Unit_Price: number;
    Revenue: number;
    Status: string;
}

export type SalesDataset = SalesRecord[];
