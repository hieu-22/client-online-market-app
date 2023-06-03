export const toUnicodeCharacter = (codePointSequence) => {
    const unicodeCharacter = String.fromCodePoint(
        ...codePointSequence.split(" ").map((cp) => parseInt(cp, 16))
    )
    return unicodeCharacter
}
