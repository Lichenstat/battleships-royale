// GenerateButton class to help with generating buttons for a choice in html
// Can generate and return button(s)

export {GenerateButton}

class GenerateButton{
    constructor(buttonclass='generic-button', buttonid='generic-button', buttontype = 'button', buttoninternal='generic button'){
        this.buttonclass = buttonclass;
        this.buttonid = buttonid;
        this.buttontype = buttontype;
        this.buttoninternal = buttoninternal;
        this.currentbutton = this.#generateHTMLButton();
    }

    // generate the set html button
    #generateHTMLButton(){
        let finalizedbutton = '<button' + 
                              ' class=' + this.buttonclass + '__button' +
                              ' id=' + this.buttonid + '__button' +
                              ' type=' + this.buttontype + 
                              '>' + this.buttoninternal + 
                              '</button>';
        return finalizedbutton;
    }

    // set html button properties when wanting to generate a html button
    setHTMLButtonProperties(buttonclass, buttonid, buttontype, buttoninternals){
        this.buttonclass = buttonclass;
        this.buttonid = buttonid;
        this.buttontype = buttontype;
        this.buttoninternal = buttoninternals;
        this.currentbutton = this.#generateHTMLButton();
    }

    // get the currently made html button
    getHTMLButton(){
        return this.currentbutton;
    }

}