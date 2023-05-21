import numeral from "numeral"

export const formatNumstrToCurrency = (
    numStr,
    format = "0,0$",
    currencySymbol
) => {
    // Convert the numeral string to a number
    const number = parseFloat(numStr)

    // Format the number as Vietnamese currency
    const formattedCurrency =
        numeral(number).format(format).replace(",", ".") + " " + currencySymbol

    return formattedCurrency
}
