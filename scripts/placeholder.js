// Matches only the markers used in placeholder content ("TODO: replace", "todo.replace", "TODO-replace"),
// so real content such as a project called "Todo App" is not flagged.
const PLACEHOLDER_PATTERN = /todo[:.\- ]*replace/i

export const isPlaceholder = (line) => PLACEHOLDER_PATTERN.test(line)
