export const cuttedDescription = str => {
    return str.split('').slice(0, 150).join('') + '...';
}