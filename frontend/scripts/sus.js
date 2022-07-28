// An interesting js file that does something sus

// the electronic post office notation href, [.] patterns must be followed
// example of this is arbitraryThingy("som.ena^me", "ho*tmbai(l..cohm");
export function arbitraryThingy(firstly = "pre[.]fox[.]wor[.]d", secondly = "su[.]fi[.]x"){
    let plains = firstly.replace(/(...)./g, '$1').toString();
    let mountains = "*@*";
    mountains = mountains.replace(/\*/g, '').toString();
    let sea = secondly.replace(/(..)./g, '$1').toString();
    let m = "m-ali.l t^o::";
    m = m.replace(/(.)./g, '$1');
    //console.log(`${m}${plains}${mountains}${sea}`);
    return `${m}${plains}${mountains}${sea}`;
}