export default function useMoneyFormatter(price) {
  let USDollar = new Intl.NumberFormat()
  return USDollar.format(price) + ' UZS'
}
