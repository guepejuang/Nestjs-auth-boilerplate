export class DigiflazzUrl {
  public static PRICELIST: string = 'https://api.digiflazz.com/v1/price-list';
  public static TRANSACTION: string =
    'https://api.digiflazz.com/v1/transaction';
  public static DEPOSIT: string = 'https://api.digiflazz.com/v1/deposit';
}

export type DIGIFLAZZ_TRANSACTION_RESPONSE = {
  ref_id: string;
  customer_no: string;
  buyer_sku_code: string;
  message: string;
  status: string;
  rc: string;
  sn: string;
  buyer_last_saldo: number;
  price: number;
  tele: string;
  wa: string;
};
